'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Chaincode Invoke
 */

let FabricClient = require('fabric-client');
let path = require('path');
let util = require('util');
// let os = require('os');

//
let fabricClient = new FabricClient();

// setup the fabric network
let channel = fabricClient.newChannel('mychannel');
let peer = fabricClient.newPeer('grpc://localhost:7051');
channel.addPeer(peer);
let order = fabricClient.newOrderer('grpc://localhost:7050');
channel.addOrderer(order);

//
// let member_user = null;
let storePath = path.join(__dirname, 'fabric-scripts/build/hfc-key-store');
console.log('Store path:' + storePath);
let txId = null;

module.exports.writeToLedger = async function(aData, sFcn) {
	// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
	FabricClient.newDefaultKeyValueStore({
		path: storePath
	})
		.then(stateStore => {
			// assign the store to the fabric client
			fabricClient.setStateStore(stateStore);
			let cryptoSuite = FabricClient.newCryptoSuite();
			// use the same location for the state store (where the users' certificate are kept)
			// and the crypto store (where the users' keys are kept)
			let cryptoStore = FabricClient.newCryptoKeyStore({
				path: storePath
			});
			cryptoSuite.setCryptoKeyStore(cryptoStore);
			fabricClient.setCryptoSuite(cryptoSuite);

			// get the enrolled user from persistence, this user will sign all requests
			return fabricClient.getUserContext('user1', true);
		})
		.then(userFromStore => {
			if (userFromStore && userFromStore.isEnrolled()) {
				console.log('Successfully loaded user1 from persistence');
				// member_user = userFromStore;
			} else {
				throw new Error('Failed to get user1.... run registerUser.js');
			}

			// get a transaction id object based on the current user assigned to fabric client
			txId = fabricClient.newTransactionID();
			console.log('Assigning transaction_id: ', txId._transaction_id);

			// createCar chaincode function - requires 5 args, ex: args: ['CAR12', 'Honda', 'Accord', 'Black', 'Tom'],
			// changeCarOwner chaincode function - requires 2 args , ex: args: ['CAR10', 'Dave'],
			// must send the proposal to endorsing peers
			let request = {
				// targets: let default to the peer assigned to the client
				chaincodeId: 'fabcar',
				fcn: sFcn,
				args: aData,
				chainId: 'mychannel',
				txId: txId
			};

			// send the transaction proposal to the peers
			return channel.sendTransactionProposal(request);
		})
		.then(results => {
			let proposalResponses = results[0];
			let proposal = results[1];
			let isProposalGood = false;
			if (proposalResponses && proposalResponses[0].response && proposalResponses[0].response.status === 200) {
				isProposalGood = true;
				console.log('Transaction proposal was good');
			} else {
				console.error('Transaction proposal was bad');
			}
			if (isProposalGood) {
				console.log(
					util.format(
						'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
						proposalResponses[0].response.status,
						proposalResponses[0].response.message
					)
				);

				// build up the request for the orderer to have the transaction committed
				let request = {
					proposalResponses: proposalResponses,
					proposal: proposal
				};

				// set the transaction listener and set a timeout of 30 sec
				// if the transaction did not get committed within the timeout period,
				// report a TIMEOUT status
				// Get the transaction ID string to be used by the event processing
				let transactionIdString = txId.getTransactionID();
				let promises = [];

				let sendPromise = channel.sendTransaction(request);
				promises.push(sendPromise); // we want the send transaction first, so that we know where to check status

				// get an eventhub once the fabric client has a user assigned. The user
				// is required bacause the event registration must be signed
				let eventHub = fabricClient.newEventHub();
				eventHub.setPeerAddr('grpc://localhost:7053');

				// using resolve the promise so that result status may be processed
				// under the then clause rather than having the catch clause process
				// the status
				let txPromise = new Promise((resolve, reject) => {
					let handle = setTimeout(() => {
						eventHub.disconnect();
						resolve({
							event_status: 'TIMEOUT'
						}); // we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
					}, 3000);
					eventHub.connect();
					eventHub.registerTxEvent(
						transactionIdString,
						(tx, code) => {
							// this is the callback for transaction event status
							// first some clean up of event listener
							clearTimeout(handle);
							eventHub.unregisterTxEvent(transactionIdString);
							eventHub.disconnect();

							// now let the application know what happened
							let returnStatus = {
								event_status: code,
								tx_id: transactionIdString
							};
							if (code !== 'VALID') {
								console.error('The transaction was invalid, code = ' + code);
								// we could use reject(new Error('Problem with the tranaction, event status ::'+code));
								resolve(returnStatus);
							} else {
								console.log(
									'The transaction has been committed on peer ' + eventHub._ep._endpoint.addr
								);
								resolve(returnStatus);
							}
						},
						err => {
							// this is the callback if something goes wrong with the event registration or processing
							reject(new Error('There was a problem with the eventhub ::' + err));
						}
					);
				});
				promises.push(txPromise);

				return Promise.all(promises);
			} else {
				console.error(
					'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'
				);
				throw new Error(
					'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...'
				);
			}
		})
		.then(results => {
			console.log('Send transaction promise and event listener promise have completed');
			// check the results in the order the promises were added to the promise all list
			if (results && results[0] && results[0].status === 'SUCCESS') {
				console.log('Successfully sent transaction to the orderer.');
			} else {
				console.error('Failed to order the transaction. Error code: ' + response.status);
			}

			if (results && results[1] && results[1].event_status === 'VALID') {
				console.log('Successfully committed the change to the ledger by the peer');
			} else {
				console.log('Transaction failed to be committed to the ledger due to ::' + results[1].event_status);
			}
		})
		.catch(err => {
			console.error('Failed to invoke successfully :: ' + err);
		});
};

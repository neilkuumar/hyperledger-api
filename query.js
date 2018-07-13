'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Chaincode query
 */

let FabricClient = require('fabric-client');
let path = require('path');

//

let fabricClient = new FabricClient();
// setup the fabric network
let channel = fabricClient.newChannel('mychannel');
let peer = fabricClient.newPeer('grpc://localhost:7051');
channel.addPeer(peer);

//
// let memberUser = null;
let storePath = path.join(__dirname, 'fabric-scripts/build/hfc-key-store');
console.log('Store path:' + storePath);
// let tx_id = null;

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
			// memberUser = userFromStore;
		} else {
			throw new Error('Failed to get user1.... run registerUser.js');
		}
	})
	.catch(err => {
		console.error('Failed to query successfully :: ' + err);
	});

module.exports = {
	queryByKey: function(partKey) {
		return new Promise((resolve, reject) => {
			const request = {
				// targets : --- letting this default to the peers assigned to the channel
				chaincodeId: 'fabpart',
				fcn: 'queryByKey',
				args: partKey
			};

			// send the query proposal to the peer
			channel
				.queryByChaincode(request)
				.then(queryResponses => {
					console.log('Query has completed, checking results');
					// query_responses could have more than one  results if there multiple peers were used as targets
					if (queryResponses && queryResponses.length == 1) {
						if (queryResponses[0] instanceof Error) {
							console.error(
								'error from query = ',
								queryResponses[0]
							);
						} else {
							console.log(
								'Response is ',
								queryResponses[0].toString()
							);
							resolve(queryResponses[0].toString());
						}
					} else {
						console.log('No payloads were returned from query');
					}
				})
				.catch(err => {
					reject();
					console.error('Failed to query successfully :: ' + err);
				});
		});
	},
	historyByKey: function(partKey) {
		return new Promise((resolve, reject) => {
			const request = {
				// targets : --- letting this default to the peers assigned to the channel
				chaincodeId: 'fabpart',
				fcn: 'historyByKey',
				args: partKey
			};

			// send the query proposal to the peer
			channel
				.queryByChaincode(request)
				.then(queryResponses => {
					console.log('Query has completed, checking results');
					// query_responses could have more than one  results if there multiple peers were used as targets
					if (queryResponses && queryResponses.length == 1) {
						if (queryResponses[0] instanceof Error) {
							console.error(
								'error from query = ',
								queryResponses[0]
							);
						} else {
							console.log(
								'Response is ',
								queryResponses[0].toString()
							);
							resolve(queryResponses[0].toString());
						}
					} else {
						console.log('No payloads were returned from query');
					}
				})
				.catch(err => {
					reject();
					console.error('Failed to query successfully :: ' + err);
				});
		});
	},
	queryByOwner: function(owner) {
		return new Promise((resolve, reject) => {
			const request = {
				// targets : --- letting this default to the peers assigned to the channel
				chaincodeId: 'fabpart',
				fcn: 'queryByOwner',
				args: [owner]
			};

			// send the query proposal to the peer
			channel
				.queryByChaincode(request)
				.then(queryResponses => {
					console.log('Query has completed, checking results');
					// query_responses could have more than one  results if there multiple peers were used as targets
					if (queryResponses && queryResponses.length == 1) {
						if (queryResponses[0] instanceof Error) {
							console.error(
								'error from query = ',
								queryResponses[0]
							);
						} else {
							console.log(
								'Response is ',
								queryResponses[0].toString()
							);
							resolve(queryResponses[0].toString());
						}
					} else {
						console.log('No payloads were returned from query');
					}
				})
				.catch(err => {
					reject();
					console.error('Failed to query successfully :: ' + err);
				});
		});
	},
	createPart: function(newPartData) {
		return new Promise((resolve, reject) => {
			// queryCar chaincode function - requires 1 argument, ex: args: ['CAR4'],
			// queryAllCars chaincode function - requires no arguments , ex: args: [''],
			const request = {
				// targets : --- letting this default to the peers assigned to the channel
				chaincodeId: 'fabpart',
				fcn: 'createPart',
				args: []
			};

			// push args in the correct order
			request.args = [
				'4',
				'4',
				'geminiParts',
				'0012',
				'0012',
				'0012',
				'0012',
				'0012',
				'0012',
				'0012',
				'0012',
				'0012',
				'done',
				'engineering'
			];

			// send the query proposal to the peer
			channel
				.queryByChaincode(request)
				.then(queryResponses => {
					console.log('Query has completed, checking results');
					// query_responses could have more than one  results if there multiple peers were used as targets
					if (queryResponses && queryResponses.length == 1) {
						if (queryResponses[0] instanceof Error) {
							console.error(
								'error from query = ',
								queryResponses[0]
							);
						} else {
							console.log(
								'Response is ',
								queryResponses[0].toString()
							);
							resolve(queryResponses[0].toString());
						}
					} else {
						console.log('No payloads were returned from query');
					}
				})
				.catch(err => {
					reject();
					console.error('Failed to query successfully :: ' + err);
				});
		});
	}
};

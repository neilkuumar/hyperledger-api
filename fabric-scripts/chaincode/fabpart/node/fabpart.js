/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const shim = require('fabric-shim');

let Chaincode = class {
	/**
	 * The Init method is called when the Smart Contract 'fabpart' is instantiated by the blockchain network
	 * Best practice is to have any Ledger initialization in separate function -- see initLedger()
	 * @param  {stub} stub
	 * @return {shim} success
	 */
	async Init(stub) {
		console.info('=========== Instantiated fabpart chaincode ===========');
		return shim.success();
	}

	/**
	 * The Invoke method is called as a result of an application request to run the Smart Contract
	 * 'fabpart'. The calling application program has also specified the particular smart contract
	 * function to be called, with arguments
	 * @param  {stub} stub
	 * @return {shim} success/fail
	 */
	async Invoke(stub) {
		let ret = stub.getFunctionAndParameters();
		console.info(ret);

		let method = this[ret.fcn];
		if (!method) {
			console.error('no function of name:' + ret.fcn + ' found');
			throw new Error(
				'Received unknown function ' + ret.fcn + ' invocation'
			);
		}
		try {
			let payload = await method(stub, ret.params);
			return shim.success(payload);
		} catch (err) {
			console.log(err);
			return shim.error(err);
		}
	}

	/**
	 * Initialises the ledger and populates with data
	 * @param  {stub} stub
	 */
	async initLedger(stub) {
		console.info('============= START : Initialize Ledger ===========');
		let parts = [];

		// parent
		parts.push({
			serialNumber: '1',
			partNumber: '1',
			manufacturerName: 'Aircraft X',
			cageCode: '1',
			faaApprovalCode: '1',
			description: 'Aircraft',
			revision: '1',
			drawingNumber: '1',
			quantity: '1',
			uom: 'm',
			batchNumber: '1',
			grDate: '15/06/2018',
			status: 'ok',
			owner: 'Aircraft X',
			location: 'Hanger',
			parentPart: '',
			prePart: ''
		});

		// part of aircraft
		parts.push({
			serialNumber: '11',
			partNumber: '2',
			manufacturerName: 'Aircraft X',
			cageCode: '1',
			faaApprovalCode: '1',
			description: 'Hydraulics',
			revision: '1',
			drawingNumber: '1',
			quantity: '1',
			uom: 'm',
			batchNumber: '1',
			grDate: '15/06/2018',
			status: 'ok',
			owner: 'Aircraft X',
			location: 'Hanger',
			parentPart: 'Aircraft X-1-1',
			prePart: ''
		});
		parts.push({
			serialNumber: '12',
			partNumber: '3',
			manufacturerName: 'Aircraft X',
			cageCode: '1',
			faaApprovalCode: '1',
			description: 'Fuel System',
			revision: '1',
			drawingNumber: '1',
			quantity: '1',
			uom: 'm',
			batchNumber: '1',
			grDate: '15/06/2018',
			status: 'ok',
			owner: 'Aircraft X',
			location: 'Hanger',
			parentPart: 'Aircraft X-1-1',
			prePart: ''
		});
		parts.push({
			serialNumber: '13',
			partNumber: '4',
			manufacturerName: 'Aircraft X',
			cageCode: '1',
			faaApprovalCode: '1',
			description: 'Engine',
			revision: '1',
			drawingNumber: '1',
			quantity: '1',
			uom: 'm',
			batchNumber: '1',
			grDate: '15/06/2018',
			status: 'ok',
			owner: 'Aircraft X',
			location: 'Hanger',
			parentPart: 'Aircraft X-1-1',
			prePart: ''
		});

		// part of engine
		parts.push({
			serialNumber: '31',
			partNumber: '11',
			manufacturerName: 'FanBladeBase',
			cageCode: '1',
			faaApprovalCode: '1',
			description: 'Fan Blades',
			revision: '1',
			drawingNumber: '1',
			quantity: '1',
			uom: 'm',
			batchNumber: '1',
			grDate: '15/06/2018',
			status: 'ok',
			owner: 'Aircraft X',
			location: 'Hanger',
			parentPart: 'Aircraft X-13-4',
			prePart: ''
		});

		// part of fuel system
		parts.push({
			serialNumber: '21',
			partNumber: '5',
			manufacturerName: 'FuelPartBros',
			cageCode: '1',
			faaApprovalCode: '1',
			description: 'Fuel Pump',
			revision: '1',
			drawingNumber: '1',
			quantity: '1',
			uom: 'm',
			batchNumber: '1',
			grDate: '15/06/2018',
			status: 'ok',
			owner: 'Aircraft X',
			location: 'Hanger',
			parentPart: 'Aircraft X-12-3',
			prePart: ''
		});
		parts.push({
			serialNumber: '22',
			partNumber: '6',
			manufacturerName: 'Aircraft X',
			cageCode: '1',
			faaApprovalCode: '1',
			description: 'Fuel Pipes',
			revision: '1',
			drawingNumber: '1',
			quantity: '1',
			uom: 'm',
			batchNumber: '1',
			grDate: '15/06/2018',
			status: 'ok',
			owner: 'Aircraft X',
			location: 'Hanger',
			parentPart: 'Aircraft X-12-3',
			prePart: ''
		});
		parts.push({
			serialNumber: '23',
			partNumber: '7',
			manufacturerName: 'JustNozzles',
			cageCode: '1',
			faaApprovalCode: '1',
			description: 'Fuel Nozzle',
			revision: '1',
			drawingNumber: '1',
			quantity: '1',
			uom: 'm',
			batchNumber: '1',
			grDate: '15/06/2018',
			status: 'ok',
			owner: 'Aircraft X',
			location: 'Hanger',
			parentPart: 'Aircraft X-12-3',
			prePart: ''
		});
		parts.push({
			serialNumber: '24',
			partNumber: '8',
			manufacturerName: 'FuelPartBros',
			cageCode: '1',
			faaApprovalCode: '1',
			description: 'Fuel Level Control Valve',
			revision: '1',
			drawingNumber: '1',
			quantity: '1',
			uom: 'm',
			batchNumber: '1',
			grDate: '15/06/2018',
			status: 'ok',
			owner: 'Aircraft X',
			location: 'Hanger',
			parentPart: 'Aircraft X-12-3',
			prePart: ''
		});
		parts.push({
			serialNumber: '25',
			partNumber: '9',
			manufacturerName: 'ValveCo',
			cageCode: '1',
			faaApprovalCode: '1',
			description: 'Shut Off Valve',
			revision: '1',
			drawingNumber: '1',
			quantity: '1',
			uom: 'm',
			batchNumber: '1',
			grDate: '15/06/2018',
			status: 'ok',
			owner: 'Aircraft X',
			location: 'Hanger',
			parentPart: 'Aircraft X-12-3',
			prePart: ''
		});
		parts.push({
			serialNumber: '26',
			partNumber: '10',
			manufacturerName: 'FuelPartBros',
			cageCode: '1',
			faaApprovalCode: '1',
			description: 'Fuel Tank',
			revision: '1',
			drawingNumber: '1',
			quantity: '1',
			uom: 'm',
			batchNumber: '1',
			grDate: '15/06/2018',
			status: 'ok',
			owner: 'Aircraft X',
			location: 'Hanger',
			parentPart: 'Aircraft X-12-3',
			prePart: ''
		});

		// gemini parts
		parts.push({
			serialNumber: '1',
			partNumber: '1',
			manufacturerName: 'geminiParts',
			cageCode: '1',
			faaApprovalCode: '1',
			description: 'Fuel Nozzle',
			revision: '1',
			drawingNumber: '1',
			quantity: '1',
			uom: 'm',
			batchNumber: '1',
			grDate: '15/06/2018',
			status: 'available',
			owner: 'geminiParts',
			location: 'engine',
			parentPart: '',
			prePart: ''
		});
		parts.push({
			serialNumber: '2',
			partNumber: '2',
			manufacturerName: 'geminiParts',
			cageCode: '2',
			faaApprovalCode: '2',
			description: 'Fan Blade',
			revision: '2',
			drawingNumber: '2',
			quantity: '2',
			uom: 'm',
			batchNumber: '2',
			grDate: '15/06/2018',
			status: 'available',
			owner: 'geminiParts',
			location: 'engine',
			parentPart: '',
			prePart: ''
		});
		parts.push({
			serialNumber: '3',
			partNumber: '3',
			manufacturerName: 'geminiParts',
			cageCode: '2',
			faaApprovalCode: '2',
			description: 'Landing Gear',
			revision: '2',
			drawingNumber: '2',
			quantity: '2',
			uom: 'm',
			batchNumber: '2',
			grDate: '15/06/2018',
			status: 'available',
			owner: 'geminiParts',
			location: 'engine',
			parentPart: '',
			prePart: ''
		});

		for (let i = 0; i < parts.length; i++) {
			parts[i].docType = 'part';
			let key = await stub.createCompositeKey(
				'manufacturerName~partNumber~serialNumber',
				[
					parts[i].manufacturerName,
					parts[i].partNumber,
					parts[i].serialNumber
				]
			);
			await stub.putState(key, Buffer.from(JSON.stringify(parts[i])));
			console.info('Added <--> ', parts[i]);
		}
		console.info('============= END : Initialize Ledger ===========');
	}
	/**
	 * @param  {stub} stub
	 * @param  {Array} args expected docType: 'part',
	 						serialNumber: args[0],
	 						partNumber: args[1],
							manufacturerName: args[2],
							cageCode: args[3],
							faaApprovalCode: args[4],
							description: args[5],
							revision: args[6],
							drawingNumber: args[7],
							quantity: args[8],
							uom: args[9],
							batchNumber: args[10],
							grDate: args[11],
							status: args[12],
							owner: args[13],
							location: args[14],
							parentPart: args[15],
							prePart: args[16]
	 */
	async createPart(stub, args) {
		console.info('============= START : Create Part ===========');
		if (args.length != 17) {
			throw new Error('Incorrect number of arguments. Expecting 17');
		}

		let part = {
			docType: 'part',
			serialNumber: args[0],
			partNumber: args[1],
			manufacturerName: args[2],
			cageCode: args[3],
			faaApprovalCode: args[4],
			description: args[5],
			revision: args[6],
			drawingNumber: args[7],
			quantity: args[8],
			uom: args[9],
			batchNumber: args[10],
			grDate: args[11],
			status: args[12],
			owner: args[13],
			location: args[14],
			parentPart: args[15],
			prePart: args[16]
		};

		let key = await stub.createCompositeKey(
			'manufacturerName~partNumber~serialNumber',
			[args[2], args[1], args[0]]
		);

		await stub.putState(key, Buffer.from(JSON.stringify(part)));
		console.info('============= END : Create Part ==========');
	}

	/**
	 * @param  {stub} stub
	 * @param  {Array} args
	 */
	async changePartOwner(stub, args) {
		console.info('============= START : changePartOwner ===========');
		if (args.length != 4) {
			throw new Error('Incorrect number of arguments. Expecting 4');
		}

		let key = stub.createCompositeKey(
			'manufacturerName~partNumber~serialNumber',
			[args[2], args[1], args[0]]
		);

		try {
			let partAsBytes = await stub.getState(key);
			let part = JSON.parse(partAsBytes);
			part.owner = args[3];
			await stub.putState(key, Buffer.from(JSON.stringify(part)));
		} catch (err) {
			throw new Error(err);
		}
		console.info('============= END : changePartOwner ===========');
	}
	/**
	 * @param  {stub} stub
	 * @param  {Array} args parts with key
	 * @return {Array} part(s)
	 */
	async queryByKey(stub, args) {
		console.info('============= START : returnallparts ===========');
		if (args.length != 3) {
			throw new Error('Incorrect number of arguments. Expecting 2');
		}

		let key = [];

		args.forEach(arg => {
			if (arg !== '') {
				key.push(arg);
			}
		});

		let iterator = await stub.getStateByPartialCompositeKey(
			'manufacturerName~partNumber~serialNumber',
			key
		);

		let allResults = [];
		while (true) {
			let res = await iterator.next();

			if (res.value && res.value.value.toString()) {
				let jsonRes = {};
				console.log(res.value.value.toString('utf8'));

				jsonRes.Key = res.value.key;
				try {
					jsonRes.Record = JSON.parse(
						res.value.value.toString('utf8')
					);
				} catch (err) {
					console.log(err);
					jsonRes.Record = res.value.value.toString('utf8');
				}
				allResults.push(jsonRes);
			}
			if (res.done) {
				console.log('end of data');
				await iterator.close();
				console.info(allResults);
				return Buffer.from(JSON.stringify(allResults));
			}
		}

		console.info('============= END : returnallparts ===========');
	}

	/**
	 * @param  {stub} stub
	 * @param  {Array} args
	 * @return {Array} parts belonging to owner
	 */
	async queryByOwner(stub, args) {
		console.info('============= START : queryByOwner ===========');

		const query = {
			selector: {
				owner: args[0]
			}
		};

		let iterator = await stub.getQueryResult(JSON.stringify(query));

		let allResults = [];
		while (true) {
			let res = await iterator.next();

			if (res.value && res.value.value.toString()) {
				let jsonRes = {};
				console.log(res.value.value.toString('utf8'));

				jsonRes.Key = res.value.key;
				try {
					jsonRes.Record = JSON.parse(
						res.value.value.toString('utf8')
					);
				} catch (err) {
					console.log(err);
					jsonRes.Record = res.value.value.toString('utf8');
				}
				allResults.push(jsonRes);
			}
			if (res.done) {
				console.log('end of data');
				await iterator.close();
				console.info(allResults);
				return Buffer.from(JSON.stringify(allResults));
			}
		}

		console.info('============= END : queryByOwner ===========');
	}
	/**
	 * @param  {stub} stub
	 * @param  {Array} args [serialNumber, partNumber, manufacturerName]
	 * @return {Array} part history
	 */
	async historyByKey(stub, args) {
		console.info('============= START : historyByKey ===========');
		if (args.length != 3) {
			throw new Error('Incorrect number of arguments. Expecting 2');
		}

		let key = stub.createCompositeKey(
			'manufacturerName~partNumber~serialNumber',
			[args[2], args[1], args[0]]
		);

		let iterator = await stub.getHistoryForKey(key);

		let allResults = [];
		while (true) {
			let res = await iterator.next();

			if (res.value && res.value.value.toString()) {
				let jsonRes = {};
				console.log(res.value.value.toString('utf8'));

				jsonRes.TxId = res.value.tx_id;
				jsonRes.Timestamp = res.value.timestamp;
				jsonRes.Key = res.value.key;
				try {
					jsonRes.Record = JSON.parse(
						res.value.value.toString('utf8')
					);
				} catch (err) {
					console.log(err);
					jsonRes.Record = res.value.value.toString('utf8');
				}
				allResults.push(jsonRes);
			}
			if (res.done) {
				console.log('end of data');
				await iterator.close();
				console.info(allResults);
				return Buffer.from(JSON.stringify(allResults));
			}
		}

		console.info('============= END : historyByKey ===========');
	}
};

shim.start(new Chaincode());

const query = require('./query.js');
const write = require('./write.js');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const WebSocket = require('ws');

app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
// app.set('json spaces', 2);

app.get('/', (req, res) => {
	res.send('Blockchain Network is up and running! v1');
});

app.get('/getParts', (req, res) => {
	let sManufacturerKey = typeof req.query.manufacturerName === 'undefined' ? '' : req.query.manufacturerName;
	let sSerialKey = typeof req.query.serialNo === 'undefined' ? '' : req.query.serialNo;
	let sPartKey = typeof req.query.partNo === 'undefined' ? '' : req.query.partNo;
	const partKey = [sSerialKey, sPartKey, sManufacturerKey];
	if (partKey.length !== 0) {
		query
			.queryByKey(partKey)
			.then(response => {
				const responseJson = {
					parts: JSON.parse(response)
				};
				res.json(responseJson);
			})
			.catch(err => {
				res.send(err);
			});
	} else {
		res.send('Please add a manufacturerName, serialNo or partNo in the query params');
	}
});

app.get('/getPartsByOwner', (req, res) => {
	let owner = typeof req.query.owner === 'undefined' ? '' : req.query.owner;
	if (owner !== '') {
		query
			.queryByOwner(owner)
			.then(response => {
				const responseJson = {
					parts: JSON.parse(response)
				};
				res.json(responseJson);
			})
			.catch(err => {
				res.send(err);
			});
	} else {
		res.send('Please add an owner in the query params');
	}
});

app.post('/part', async (req, res) => {
	const b = req.body;
	const part = [b.manufacturerName, b.partNumber, b.serialNumber];
	try {
		let response = await query.queryPart(part);
		console.log(response);
		res.send(JSON.parse(response));
	} catch (err) {
		res.send(err);
	}
});

app.post('/history', async (req, res) => {
	const b = req.body;
	const part = [b.serialNumber, b.partNumber, b.manufacturerName];
	try {
		let response = await query.historyByKey(part);
		console.log(response);
		res.send(JSON.parse(response));
	} catch (err) {
		res.send(err);
	}
});

app.post('/create', async (req, res) => {
	const b = req.body;
	let part = [];

	// S4 doesn't know what case it will be sent back in
	part.push(getParameterCaseInsensitive(b, 'serialNumber'));
	part.push(getParameterCaseInsensitive(b, 'partNumber'));
	part.push(getParameterCaseInsensitive(b, 'manufacturerName'));
	part.push(getParameterCaseInsensitive(b, 'cageCode'));
	part.push(getParameterCaseInsensitive(b, 'faaApprovalCode'));
	part.push(getParameterCaseInsensitive(b, 'description'));
	part.push(getParameterCaseInsensitive(b, 'revision'));
	part.push(getParameterCaseInsensitive(b, 'drawingNumber'));
	part.push(getParameterCaseInsensitive(b, 'quantity'));
	part.push(getParameterCaseInsensitive(b, 'uom'));
	part.push(getParameterCaseInsensitive(b, 'batchNumber'));
	part.push(getParameterCaseInsensitive(b, 'grDate'));
	part.push(getParameterCaseInsensitive(b, 'status'));
	part.push(getParameterCaseInsensitive(b, 'owner'));
	part.push(getParameterCaseInsensitive(b, 'location'));
	part.push(getParameterCaseInsensitive(b, 'parentPart'));
	part.push(getParameterCaseInsensitive(b, 'prePart'));

	try {
		let writeRequest = await write.writeToLedger(part, 'createPart');
		console.log(writeRequest);
		res.send('done');
	} catch (err) {
		res.send(err);
	}
});

app.post('/changeOwner', async (req, res) => {
	const body = req.body;
	const newPartData = returnArgs(body);
	try {
		let writeRequest = await write.writeToLedger(newPartData, 'changePartOwner');
		console.log(writeRequest);
		res.send('done');
	} catch (err) {
		res.send(err);
	}
});

app.post('/changeStatus', async (req, res) => {
	const b = req.body;
	const part = [b.serialNumber, b.partNumber, b.manufacturerName, b.status];
	try {
		let writeRequest = await write.writeToLedger(part, 'changePartStatus');
		console.log(writeRequest);
		websocketUpdate();
		res.send('done');
	} catch (err) {
		res.send(err);
	}
});

app.get('/checkSerial', async (req, res) => {
	let serial = typeof req.query.serialNumber === 'undefined' ? '' : req.query.serialNumber;
	if (serial !== '') {
		try {
			let response = await query.queryBySerial(serial);
			console.log(response);
			res.send(JSON.parse(response));
		} catch (err) {
			res.send(err);
		}
	} else {
		res.send('Please enter a serial number. E.g. checkSerial?serialNumber');
	}
});

app.get('/search', async (req, res) => {
	let description = typeof req.query.description === 'undefined' ? '' : req.query.description;
	if (description !== '') {
		try {
			let response = await query.queryByDescription(description);
			console.log(response);
			res.send(JSON.parse(response));
		} catch (err) {
			res.send(err);
		}
	} else {
		res.send('Please enter a description. E.g. search?description=');
	}
});

app.post('/changeStatusOwner', async (req, res) => {
	const body = req.body;
	const newPartData = returnArgs(body);
	try {
		let writeRequest = await write.writeToLedger(newPartData, 'changePartOwnerAndStatus');
		console.log(writeRequest);
		res.send('done');
	} catch (err) {
		res.send(err);
	}
});

app.post('/restorePartBackForDemo', async (req, res) => {
	const body = req.body;
	const newPartData = returnArgs(body);
	try {
		let writeRequest = await write.writeToLedger(newPartData, 'restorePartBackToDemoStatus');
		console.log(writeRequest);
		res.send('done');
	} catch (err) {
		res.send(err);
	}
});

app.listen(3000, () => console.log('Blockchain listening on port 3000!'));

function returnArgs(oData) {
	return Object.values(oData);
}

function websocketUpdate() {
	try {
		const url = 'ws://ec2-18-130-8-136.eu-west-2.compute.amazonaws.com:8080';
		// const url = 'ws://localhost:8080';
		// Create WebSocket connection.
		const socket = new WebSocket(url);
		// Connection opened
		socket.addEventListener('open', function(event) {
			setTimeout(() => {
				socket.send('Hello Server!');
			}, 3000);

			// socket.close();
		});
	} catch (err) {
		console.log(err);
	}
}

/**
 * @param {Object} object
 * @param {string} key
 * @return {any} value
 */
function getParameterCaseInsensitive(object, key) {
	return object[Object.keys(object).find(k => k.toLowerCase() === key.toLowerCase())];
}

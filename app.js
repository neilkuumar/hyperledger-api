const query = require('./query.js');
const write = require('./write.js');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

/**
 * Express setup
 */

app.use(bodyParser.json());
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);

	next();
});

app.get('/', (req, res) => {
	res.send('Blockchain Network is up and running! v1');
});

// Routes
/**
 * get parts for a specific manufacturer (or partial composite key)
 */
app.get('/getParts', (req, res) => {
	const b = req.body;
	let compositeKey = [];

	// ignore case
	compositeKey.push(getParameterCaseInsensitive(b, 'serialNumber'));
	compositeKey.push(getParameterCaseInsensitive(b, 'partNumber'));
	compositeKey.push(getParameterCaseInsensitive(b, 'manufacturerName'));

	if (compositeKey.length !== 0) {
		query
			.queryByKey(compositeKey)
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
		res.send(
			'Please add a manufacturerName, serialNo or partNo in the query params'
		);
	}
});

/**
 * get parts by owner
 */
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

/**
 * get all the history for the part
 */
app.post('/history', async (req, res) => {
	const b = req.body;
	let part = [];
	// ignore case
	part.push(getParameterCaseInsensitive(b, 'serialNumber'));
	part.push(getParameterCaseInsensitive(b, 'partNumber'));
	part.push(getParameterCaseInsensitive(b, 'manufacturerName'));

	try {
		let response = await query.historyByKey(part);
		console.log(response);
		res.send(JSON.parse(response));
	} catch (err) {
		res.send(err);
	}
});

/**
 * Create new part
 */
app.post('/create', async (req, res) => {
	const b = req.body;
	let part = [];

	// ignore case
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

/**
 * Create part owner
 */
app.post('/changeOwner', async (req, res) => {
	const body = req.body;
	const newPartData = returnArgs(body);
	try {
		let writeRequest = await write.writeToLedger(
			newPartData,
			'changePartOwner'
		);
		console.log(writeRequest);
		res.send('done');
	} catch (err) {
		res.send(err);
	}
});

app.listen(3000, () => console.log('Blockchain listening on port 3000!'));

/**
 * @param {Object} object
 * @param {string} key
 * @return {any} value
 */
function getParameterCaseInsensitive(object, key) {
	return object[
		Object.keys(object).find(k => k.toLowerCase() === key.toLowerCase())
	];
}

// ##################### Platzhalter für die app Logik 

const api = require("./api.js");
const web3 = require("./blockchain/connector.js");
const eth = web3.eth;

const express = require('express');
const app = express();
const uuid = require('uuid');
const _ = require('lodash');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var _insurer = eth.accounts[0];
var _insurant = eth.accounts[1];

// api.createFlightDelayContract(_insurer).then(res => {
//     // console.log(res.args._contract + " created");
//     _addr = res.args._contract;
//     _from = res.args._from;
//     console.log(`FlightDelayContract with address ${_addr} was created by ${_from} \n`)

//     let _contractInfo = api.getContract(_addr)
//     console.log(`The current FlightDelayContract info: \n ${JSON.stringify(_contractInfo)}`)
// })

app.get('/', function (req, res) {
	res.sendfile('public/index.html');
})

var requests = [];

var update = function(id, data) {
	for (var i=0; i<requests.length; i++) {
		if (requests[i].id === id) {
			return _.extend(requests[i], data);
		}
	}
	return null;
}

// return requests
app.get('/api/requests', function(req, res) {
  res.send(requests);
});

app.post('/api/request', function(req, res) {
    var airlinecode = req.body.airlinecode;
    var flightnumber = req.body.flightnumber;
    var originflightdate = req.body.originflightdate;
    var insuranceValue = req.body.insuranceValue;

	api.createFlightDelayContract(_insurer).then(res => {
	    _addr = res.args._contract;
	    _from = res.args._from;
	    console.log(`FlightDelayContract with address ${_addr} was created by ${_from} \n`)

	    let _contractInfo = api.getContract(_addr)
	    console.log(`The current FlightDelayContract info: \n ${JSON.stringify(_contractInfo)}`)

	    requests.push({id: _addr, airlinecode: airlinecode, flightnumber: flightnumber, 
    		originflightdate: originflightdate , insuranceValue: insuranceValue, price: null, state: 'requested'})

	    api.request(_addr, airlinecode, flightnumber, originflightdate, insuranceValue, 9999, _insurant).then(res => {
	    	res.status(200);
	    	res.send('request created');
		}).catch(function (err) {
			res.status(500);
			res.send('request create error');
	  	})
	}).catch(function (err) {
		res.status(500);
		res.send('request unable to create contract');
  	})
});

app.post('/api/accept', function(req, res) {
    var id = req.body.id;
    var price = req.body.price;

    var result = update(id, { price: price, state: 'accepted' });
    if (!result) {
    	res.status(500);
		res.send('request not found');
    }

    api.accept(id, price, _insurer, result.insuranceValue).then(res => {
    	res.status(200);
    	res.send('request accepted');
	}).catch(function (err) {
		res.status(500);
		res.send('request accepted error');
  	})
});

app.post('/api/confirm', function(req, res) {
    var id = req.body.id;

    var result = update(id, { state: 'confirmed' });
    if (!result) {
    	res.status(500);
		res.send('request not found');
    }

    api.confirm(id, _insurant, result.price).then(res => {
    	res.status(200);
    	res.send('request confirmed');
	}).catch(function (err) {
		res.status(500);
		res.send('request confirm error');
  	})
});

app.post('/api/trigger', function(req, res) {
    var id = req.body.id;

    var result = update(id, { state: 'triggered' });
    if (!result) {
    	res.status(500);
		res.send('request not found');
    }

    api.trigger(id, accesToken?).then(res => {
    	res.status(200);
    	res.send('request triggered');
	}).catch(function (err) {
		res.status(500);
		res.send('request trigger error');
  	})
});

app.post('/api/close', function(req, res) {
    var id = req.body.id;

    var result = update(id, { state: 'closed' });
    if (!result) {
    	res.status(500);
		res.send('request not found');
    }

    api.close(id).then(res => {
    	res.status(200);
    	res.send('request closed');
	}).catch(function (err) {
		res.status(500);
		res.send('request close error');
  	})
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

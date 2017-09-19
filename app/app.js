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

app.post('/api/request', function(request, response) {
    var airlinecode = request.body.airlinecode;
    var flightnumber = request.body.flightnumber;
    var originflightdate = request.body.originflightdate;
    var insuranceValue = request.body.insuranceValue;

    console.log(request.body)

	api.createFlightDelayContract(_insurer).then(res => {
        _addr = res.args._contract;
        _from = res.args._from;
        console.log(`FlightDelayContract with address ${_addr} was created by ${_from} \n`)

	    let _contractInfo = api.getContract()
        console.log(`The current FlightDelayContract info: \n ${JSON.stringify(_contractInfo)}`)

        api.setDefaultFlightDelayContract(_addr);

        api.request(airlinecode, flightnumber, originflightdate, insuranceValue, 9999, _insurant).then(res2 => {
            requests.push({id: _addr, airlinecode: airlinecode, flightnumber: flightnumber, 
                originflightdate: originflightdate , insuranceValue: insuranceValue, price: null, state: 'requested'})
         	response.status(200);
         	response.send('request created');
        }, err2 => {
            response.status(500);
            response.send('request create error');
        });
	}, err => {
        response.status(500);
        response.send('request unable to create contract');
    });
});

app.post('/api/accept', function(request, response) {
    var id = request.body.id;
    var price = request.body.price;

    api.setDefaultFlightDelayContract(id);

    var result = update(id, { price: price, state: 'accepted' });
    if (!result) {
    	response.status(500);
		response.send('request not found');
    }

    api.accept(price, _insurer, result.insuranceValue).then(res => {
    	response.status(200);
    	response.send('request accepted');
	}, err => {
		response.status(500);
		response.send('request accepted error');
  	});
});

app.post('/api/confirm', function(request, response) {
    var id = request.body.id;

    api.setDefaultFlightDelayContract(id);

    var result = update(id, { state: 'confirmed' });
    if (!result) {
    	response.status(500);
		response.send('request not found');
    }

    api.confirm(_insurant, result.price).then(res => {
    	response.status(200);
    	response.send('request confirmed');
	}, err => {
		response.status(500);
		response.send('request confirm error');
  	});
});

app.post('/api/trigger', function(request, response) {
    var id = request.body.id;

    api.setDefaultFlightDelayContract(id);

    var result = update(id, { state: 'triggered' });
    if (!result) {
    	response.status(500);
		response.send('request not found');
    }

    api.trigger().then(res => {
    	response.status(200);
    	response.send('request triggered');
	}, err => {
		response.status(500);
		response.send('request trigger error');
  	});
});

app.post('/api/close', function(request, response) {
    var id = request.body.id;

    api.setDefaultFlightDelayContract(id);

    var result = update(id, { state: 'closed' });
    if (!result) {
    	response.status(500);
		response.send('request not found');
    }

    api.close().then(res => {
    	response.status(200);
    	response.send('request closed');
	}, err => {
		response.status(500);
		response.send('request close error');
  	});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

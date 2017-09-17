"use strict";
require('babel-polyfill');
const co = require('co');
const chai = require('chai');
const expect = chai.expect;
const request = require('request');


const FlightDelayContract = artifacts.require("./FlightDelayContract.sol");
const Oracle = artifacts.require("./Oracle.sol");

let instanceFlightDelayContract;
let instanceOracle;
let owner;
let eth = web3.eth;


// ############################# Diese Daten müssen stets angepasst werden, da die accessTokens nur eine bestimmte Zeit lang gültig sind und Flüge nur für den aktuellen Tag abrufbar sind
const flightdata = {
    airlinecode: "LH",
    flightnumber: 1051,
    originflightdate: "2017-09-17"
}
const accessToken = "0dc5a0faa07c8529f4fbe72cb4dc9d3b";


contract("instanceFlightDelayContract", function(accounts) {

    before(function() {
        return co(function*() {
            owner = accounts[0];
            instanceFlightDelayContract = yield FlightDelayContract.deployed();
            instanceOracle = yield Oracle.deployed();
        });
    });


    it('the contract should be deployed to the blockchain', function() {
        assert(instanceFlightDelayContract != undefined, "factory not deployed");
    });

    it("set oracle contract", function() {
        return co(function*() {
            yield instanceFlightDelayContract.setOracle(instanceOracle.address);
        });
    })

    it('request', function() {
        return co(function*() {
            // yield instanceFlightDelayContract.setOracle(instanceOracle.address);
            instanceFlightDelayContract.request(flightdata.airlinecode, flightdata.flightnumber, flightdata.originflightdate, 1000, 100, { from: eth.accounts[1] })
            let airlinecode = yield instanceFlightDelayContract.airlinecode();
            let flightnumber = yield instanceFlightDelayContract.flightnumber();
            let originflightdate = yield instanceFlightDelayContract.originflightdate();
            let insuranceValue = yield instanceFlightDelayContract.insuranceValue();
            let durationInBlocks = yield instanceFlightDelayContract.durationInBlocks();
            let customer = yield instanceFlightDelayContract.customer();

            assert(airlinecode == flightdata.airlinecode)
            assert(flightnumber == flightdata.flightnumber);
            assert(originflightdate == flightdata.originflightdate);
            assert(insuranceValue == 1000);
            assert(durationInBlocks == 100);
            assert(customer == eth.accounts[1]);

        });
    });

    it('request should fail when called twice', function() {
        return co(function*() {
            try {
                yield instanceFlightDelayContract.request(flightdata.airlinecode, flightdata.flightnumber, flightdata.originflightdate, 1000, 100, { from: eth.accounts[1] })
            } catch (error) {
                assert(String(error.message).endsWith("invalid opcode"));
            }
        });
    });

    it('accept call only by insurer', function(done) {
        let p1 = co(function*() {
            yield instanceFlightDelayContract.accept(99, { from: eth.accounts[0], value: 1000 });
            try {
                yield instanceFlightDelayContract.accept(99, { from: eth.accounts[1] });
            } catch (error) {
                assert(String(error.message).endsWith("invalid opcode"));
            }
        });

        let p2 = new Promise((resolve, reject) => {
            instanceFlightDelayContract.Accepted((error, result) => {
                if (!error) {
                    resolve(result);
                } else { reject(error); }
            })
        })

        Promise.all([p1, p2]).then(values => {
            let result = values[1];
            let _price = result.args._price
            assert(_price == 99);
            done();
        })
    });


    it('confirm', function(done) {
        let p1 = co(function*() {
            yield instanceFlightDelayContract.confirm({ from: eth.accounts[1], value: 99 });
        });

        let p2 = new Promise((resolve, reject) => {
            instanceFlightDelayContract.isActiveEvent((error, result) => {
                if (!error) {
                    resolve(result);
                } else { reject(error); }
            })
        })

        Promise.all([p1, p2]).then(values => {
            let result = values[1];

            let _airlinecode = result.args._airlinecode
            let _flightnumber = result.args._flightnumber
            let _originflightdate = result.args._originflightdate

            assert(_airlinecode == flightdata.airlinecode);
            assert(_flightnumber == flightdata.flightnumber);
            assert(_originflightdate == flightdata.originflightdate);
            done();
        })

    });



    it('MGSOracle test query', function(done) {
        this.timeout(30000); // falls events nicht geworfen werden beendet timer den test

        let p1 = co(function*() {
            yield instanceFlightDelayContract.trigger(accessToken);
        })

        let p2 = new Promise(function(resolve, reject) {
            instanceOracle.Query(function(error, result) {
                if (!error) {
                    resolve(result);
                } else { reject(error); }
            })
        });

        let p3 = Promise.all([p1, p2]).then(values => {
            let result = values[1];

            let _airlinecode = result.args._airlinecode
            let _flightnumber = result.args._flightnumber
            let _originflightdate = result.args._originflightdate
            let _accesstoken = result.args._accessToken
            let id = result.args.id

            let options = {
                url: 'https://developer.fraport.de/api/flights/1.0/flightDetails/' + _airlinecode + '/' + _flightnumber + '/' + _originflightdate,
                headers: {
                    "Authorization": "Bearer " + _accesstoken
                }
            };

            function callback(error, response, body) {
                if (!error && response.statusCode == 200) {
                    let info = JSON.parse(body);
                    // console.log(info)
                    instanceFlightDelayContract.__callback(id, info[0].flight.flightStatus)
                }
            }

            request(options, callback);

        });


        let p4 = new Promise(function(resolve, reject) {
            instanceFlightDelayContract.flightStatusEvent(function(error, result) {
                if (!error) {
                    // console.log(result);
                    resolve(result);
                } else { reject(error); }
            })
        });


        let p5 = new Promise(function(resolve, reject) {
            instanceFlightDelayContract.InsuranceExecuted(function(error, result) {
                if (!error) {
                    // console.log(result);
                    resolve(result);
                } else { reject(error); }
            })
        });

        Promise.all([p3, p4, p5]).then(values => {
            let result1 = values[1];
            let _status = result1.args._status
            let result2 = values[2];
            let _coll = result2.args._collateral;
            // console.log(`coll is ${_coll}`)
            // console.log(`flight status is ${_status}`);
            done()
        });

    });


});
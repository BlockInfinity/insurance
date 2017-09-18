const app = require("../app.js");
const web3 = require("../connector.js");
const eth = web3.eth;
const path = require("path");
const fs = require("fs");
const assert = require('chai').assert

var _airlinecode = "LH"
var _flightnumber = 157
var _originflightdate = "2017-09-18"
var _insuranceValue = 10000
var _durationInBlocks = 100
var _customer = eth.accounts[1]
var _insurer = eth.accounts[0]
var _price = 500;
var _accessToken = "fe9d187704da223dc1c8762447a858de"
var _addr;

// todo: in memory die contracts abspeichern samt status 
// todo: in memory die requests abspeichern 

describe('app.js', function() {

    it('createFlightDelayContract', function(done) {
        this.timeout(30000); // falls events nicht geworfen werden beendet timer den test
        app.createFlightDelayContract(_insurer).then(res => {
            // console.log(res.args._contract + " created");
            _addr = res.args._contract;
            _from = res.args._from;
            assert(_from == _insurer)
            console.log("_from", _from)
            console.log("web3.InsuranceContractFactory.address ", web3.InsuranceContractFactory.address )
            done();
        })
    });


    it('setDefaultFlightDelayContract', function() {
        this.timeout(20000);
        let res = app.setDefaultFlightDelayContract(_addr);
        assert(res == _addr);
    })

    it('setOracle', function(done) {
        app.setOracle(web3.Oracle.address, _insurer).then(res => {
            assert(res.args._oracle == web3.Oracle.address, `${res.args._oracle} is not equal ${web3.Oracle.address}`);
            done();
        })
    });
    it('request', function(done) {
        app.request(_airlinecode, _flightnumber, _originflightdate, _insuranceValue, _durationInBlocks, _customer).then(res => {
            assert(res.args._flightnumber == _flightnumber);
            done();
        })
    });
    it('accept', function(done) {
        app.accept(_price, _insurer, _insuranceValue).then(res => {
            assert(res.args._price == _price);
            done();
        })
    });
    it('confirm', function(done) {
        app.confirm(_customer, _price).then(res => {
            assert(res.args._flightnumber == _flightnumber);
            done();
        })
    });

    it('trigger', function(done) {
        this.timeout(30000); // falls events nicht geworfen werden beendet timer den test
        app.trigger(_accessToken).then(res => {
            done();
        })
    });

});
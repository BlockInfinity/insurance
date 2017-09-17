const app = require("../app.js");
const web3 = require("../connector.js");

const assert = require('assert');

var _airlinecode = "LH"
var _flightnumber = 1051
var _originflightdate = "2017-09-17"
var _insuranceValue = 10000
var _durationInBlocks = 100
var _accountNoCustomer = 1
var _accountNoInsurer = 0
var _price = 500;
var _accessToken = "a38be8fba36fe256ba3e405a812f1098"
var _contract;

// todo: in memory die contracts abspeichern samt status 
// todo: in memory die requests abspeichern 


describe('app.js', function() {

    it('createFlightDelayContract', function(done) {
        this.timeout(30000); // falls events nicht geworfen werden beendet timer den test
        app.createFlightDelayContract(_accountNoInsurer).then(res => {
            // console.log(res.args._contract + " created");
            _contract = res.args._contract;
            done();
        })
    });

    // todo: bug
    it.skip('setDefaultFlightDelayContract', function(done) {
        _contract = app.setDefaultFlightDelayContract(_contract);
        console.log(_contract + "is set as default")
        done()
    });

    it('setOracle', function(done) {
        app.setOracle(web3.Oracle.address, _accountNoInsurer).then(res => {
            assert(res.args._oracle == web3.Oracle.address, `${res.args._oracle} is not equal ${web3.Oracle.address}`);
            done();
        })
    });
    it('request', function(done) {
        app.request(_airlinecode, _flightnumber, _originflightdate, _insuranceValue, _durationInBlocks, _accountNoCustomer).then(res => {
            assert(res.args._flightnumber == _flightnumber);
            done();
        })
    });
    it('accept', function(done) {
        app.accept(_price, _accountNoInsurer, _insuranceValue).then(res => {
            assert(res.args._price == _price);
            done();
        })
    });
    it('confirm', function(done) {
        app.confirm(_accountNoCustomer, _price).then(res => {
            assert(res.args._flightnumber == _flightnumber);
            done();
        })
    });

    it('trigger', function(done) {
        this.timeout(30000); // falls events nicht geworfen werden beendet timer den test
        app.trigger(_accessToken).then(res => {
            // assert(res.args == _flightnumber);
            // console.log(res.args);
            done();
        })
    });




});
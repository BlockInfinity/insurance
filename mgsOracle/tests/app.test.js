const app = require("../app.js");
const web3 = require("../connector.js");
const eth = web3.eth;
const path = require("path");
const fs = require("fs");
const assert = require('chai').assert

var _airlinecode = "LH"
var _flightnumber = 1051
var _originflightdate = "2017-09-17"
var _insuranceValue = 10000
var _durationInBlocks = 100
var _customer = eth.accounts[1]
var _insurer = eth.accounts[0]
var _price = 500;
var _accessToken = "a38be8fba36fe256ba3e405a812f1098"
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

    // todo: bug
    it('setDefaultFlightDelayContract', function(done) {
        this.timeout(20000);

        let abiPath = path.join(__dirname, '..', '..',
            '/truffle/build/contracts/', "FlightDelayContract.json");
        let abi_contract = fs.readFileSync(abiPath).toString();
        abi_contract = JSON.parse(abi_contract).abi;
        let contract = web3.eth.contract(abi_contract);
        instanceFlightDelayContract = contract.at(_addr);

        console.log("instanceFlightDelayContract.insurer() ", instanceFlightDelayContract.insurer())
        console.log("_insurer", _insurer)
        console.log("_customer", _customer)
        console.log("eth.accounts[0]", eth.accounts[0])
        console.log("eth.accounts[1", eth.accounts[1])



        assert(instanceFlightDelayContract.address == _addr)    
        assert(instanceFlightDelayContract.insurer() == _insurer, `${instanceFlightDelayContract.insurer()} is not equal ${_insurer}`);
        // console.log(1, insurerFromCurrentContract, _insurer);

        done()
        // instanceFlightDelayContract.setOracle(web3.Oracle.address, { from: _insurer });


        // let p1 = Promise((resolve, reject) => {
        //     instanceFlightDelayContract.OracleSet((error, result) => {
        //         if (!error) {
        //             console.log(1)
        //             resolve(result);
        //         } else {
        //             // console.warn(error);
        //             reject(error);
        //         }
        //     })
        // })


        // p1.then((res => {
        //     console.log(res);
        //     done()
        // })).catch((error) => {
        //     assert.isNotOk(error, 'Promise error');
        //     console.log(error);
        //     done()
        // });
    })



    // _contract = app.setDefaultFlightDelayContract(_contract);
    // app.createFlightDelayContract(_insurer).then(res => {
    //     // console.log(res.args._contract + " created");
    //     console.log(res.args)
    //     let _addr = res.args._contract;
    //     console.log(res.args._contract + "was created");

    //         let abiPath = path.join(__dirname, '..', '..',
    //             '/truffle/build/contracts/', "FlightDelayContract.json");
    //         let abi_contract = fs.readFileSync(abiPath).toString();
    //         abi_contract = JSON.parse(abi_contract).abi;
    //         let contract = web3.eth.contract(abi_contract);
    //         instanceFlightDelayContract = contract.at(_addr);

    //         let insurer = instanceFlightDelayContract.insurer();
    //         assert(insurer, _insurer)
    //         console.log(1, insurer, _insurer)
    //         instanceFlightDelayContract.setOracle(web3.Oracle.address, { from: _insurer });


    //         let p1 = Promise((resolve, reject) => {
    //             instanceFlightDelayContract.OracleSet((error, result) => {
    //                 if (!error) {
    //                     console.log(1)
    //                     resolve(result);
    //                 } else {
    //                     // console.warn(error);
    //                     reject(error);
    //                 }
    //             })
    //         })


    //         p1.then((res => {
    //             console.log(res);
    //             done()
    //         })).catch((error) => {
    //             assert.isNotOk(error, 'Promise error');
    //             console.log(error);
    //             done()
    //         });


    //         // instanceFlightDelayContract.request(_airlinecode, _flightnumber, _originflightdate, _insuranceValue, _durationInBlocks, { from: eth.accounts[_customer], gas: 4000000 })

    //         // let p2 = new Promise((resolve, reject) => {
    //         //     instanceFlightDelayContract.InsuranceRequest((error, result) => {
    //         //         if (!error) {
    //         //             console.log(2)
    //         //             resolve(result);
    //         //         } else {
    //         //             // console.warn(error);
    //         //             reject(error);
    //         //         }
    //         //     })
    //         // })

    //         // p2.then((res => {
    //         //     console.log(res);
    //         //     done();
    //         // })).catch((error) => {
    //         //     assert.isNotOk(error, 'Promise error');
    //         //     done()
    //         // });


    //         // Promise.all([p1, p2]).then((values) => {
    //         //     let ora = values[0];
    //         //     let req = values[1];
    //         //     console.log("Insurance Request event received: ", req);
    //         //     console.log("Insurance Request event received: ", ora);
    //         //     done()
    //         // }).catch((error) => {
    //         //     assert.isNotOk(error, 'Promise error');
    //         //     done()
    //         // });
    //     }).catch(error => {
    //         assert.isNotOk(error, 'Promise error');
    //         console.og(error);
    //         done()
    //     })
    // })
    // });

    it.skip('setOracle', function(done) {
        app.setOracle(web3.Oracle.address, _insurer).then(res => {
            assert(res.args._oracle == web3.Oracle.address, `${res.args._oracle} is not equal ${web3.Oracle.address}`);
            done();
        })
    });
    it.skip('request', function(done) {
        app.request(_airlinecode, _flightnumber, _originflightdate, _insuranceValue, _durationInBlocks, _customer).then(res => {
            assert(res.args._flightnumber == _flightnumber);
            done();
        })
    });
    it.skip('accept', function(done) {
        app.accept(_price, _insurer, _insuranceValue).then(res => {
            assert(res.args._price == _price);
            done();
        })
    });
    it.skip('confirm', function(done) {
        app.confirm(_customer, _price).then(res => {
            assert(res.args._flightnumber == _flightnumber);
            done();
        })
    });

    it.skip('trigger', function(done) {
        this.timeout(30000); // falls events nicht geworfen werden beendet timer den test
        app.trigger(_accessToken).then(res => {
            // assert(res.args == _flightnumber);
            // console.log(res.args);
            done();
        })
    });

});
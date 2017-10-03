const web3 = require("./blockchain/connector.js");
const eth = web3.eth;
var instanceFlightDelayContract = web3.FlightDelayContract;
const co = require('co');
const path = require("path");
const fs = require("fs");
const assert = require("assert");
const instanceInsuranceContractFactory = web3.InsuranceContractFactory;
// ##### database 
const loki = require("lokijs");
var db = new loki('loki.json')
var contractCollection = db.addCollection('contractCollection')
var _accessToken = "456339bf02f958ef1b8fe4bf9b16bc79";

module.exports = {

    createFlightDelayContract: function(_sender) {

        instanceInsuranceContractFactory.createFlightDelayContract({ from: _sender, gas: 4000000 });

        return new Promise((resolve, reject) => {
            instanceInsuranceContractFactory.FlightDelayContractCreation((error, result) => {
                if (!error) {
                    _addr = result.args._contract;
                    _from = result.args._from;
                    contractCollection.insert({
                        address: _addr,
                        insurer: _from,
                        oracle: "undefined",
                        airlinecode: "undefined",
                        flightnumber: "undefined",
                        originflightdate: "undefined",
                        insuranceValue: "undefined",
                        durationInBlocks: "undefined",
                        customer: "undefined",
                        collateral: "undefined",
                        price: "undefined",
                        status: "open"
                    })
                    resolve(result);
                } else { reject(error); }
            })
        })
    },

    setDefaultFlightDelayContract: function(_contract) {
        abiPath = path.join(__dirname, '..', '/truffle/build/contracts/', "FlightDelayContract.json");
        abi_contract = fs.readFileSync(abiPath).toString();
        abi_contract = JSON.parse(abi_contract).abi;
        contract = web3.eth.contract(abi_contract);
        instanceFlightDelayContract = contract.at(_contract);
        return (instanceFlightDelayContract.address)
    },

    setOracle: function(_oracle, _sender) {
        instanceFlightDelayContract.setOracle(_oracle, { from: _sender });

        return new Promise((resolve, reject) => {
            instanceFlightDelayContract.OracleSet((error, result) => {
                if (!error) {
                    let _oracle = result.args._oracle;

                    let contract = contractCollection.findOne({ 'address': instanceFlightDelayContract.address });
                    contract.oracle = _oracle;
                    contractCollection.update(contract);

                    resolve(result);
                } else { reject(error); }
            })
        })

    },

    request: function(_airlinecode, _flightnumber, _originflightdate, _insuranceValue, _durationInBlocks, _sender) {

        instanceFlightDelayContract.request(_airlinecode, _flightnumber, _originflightdate, _insuranceValue, _durationInBlocks, { from: _sender, gas: 4000000 });

        return new Promise((resolve, reject) => {
            instanceFlightDelayContract.InsuranceRequest((error, result) => {
                if (!error) {
                    console.log("request ok");

                    let contract = contractCollection.findOne({ 'address': instanceFlightDelayContract.address });
                    contract.airlinecode = _airlinecode;
                    contract.flightnumber = _flightnumber;
                    contract.originflightdate = _originflightdate;
                    contract.insuranceValue = _insuranceValue;
                    contract.durationInBlocks = _durationInBlocks;
                    contract.customer = _sender;
                    contract.status = "requested";

                    contractCollection.update(contract);


                    resolve(result);
                } else { reject(error); }
            })
        });
    },

    accept: function(_price, _sender, _value) {

        instanceFlightDelayContract.accept(_price, { from: _sender, value: _value });

        return new Promise((resolve, reject) => {
            instanceFlightDelayContract.Accepted((error, result) => {
                if (!error) {
                    console.log("accept ok");

                    let contract = contractCollection.findOne({ 'address': instanceFlightDelayContract.address });
                    contract.collateral = _value;
                    contract.price = _price;
                    contract.status = "accepted";
                    contractCollection.update(contract);

                    resolve(result);
                } else { reject(error); }
            })
        })
    },

    confirm: function(_sender, _value) {

        instanceFlightDelayContract.confirm({ from: _sender, value: _value });

        return new Promise((resolve, reject) => {
            instanceFlightDelayContract.isActiveEvent((error, result) => {
                if (!error) {
                    console.log("confirm ok");


                    let contract = contractCollection.findOne({ 'address': instanceFlightDelayContract.address });
                    contract.paid = _value;
                    contract.status = "active";
                    contractCollection.update(contract);

                    resolve(result);
                } else { reject(error); }
            })
        })
    },

    trigger: function(_sender) {

        instanceFlightDelayContract.trigger(_accessToken, {from: _sender});

        return new Promise(function(resolve, reject) {
            instanceFlightDelayContract.flightStatusEvent(function(error, result) {
                if (!error) {
                    resolve(result);
                } else { reject(error); }
            })
        });
    },

    close: function() {

        instanceFlightDelayContract.close();

        return new Promise(function(resolve, reject) {
            instanceFlightDelayContract.closeEvent(function(error, result) {
                if (!error) {

                    let contract = contractCollection.findOne({ 'address': instanceFlightDelayContract.address });
                    contract.status = "closed";
                    contractCollection.update(contract);

                    resolve(result);
                } else { reject(error); }
            })
        });
    },

    getContract: function() {
        let contract = contractCollection.findOne({ 'address': _addr });
        return contract;
    },

    web3: web3,
    contractCollection: contractCollection,
}

instanceFlightDelayContract.InsuranceExecuted(function(error, result) {
    if (!error) {
        let contract = contractCollection.findOne({ 'address': instanceFlightDelayContract.address });
        contract.status = "executed";
        contractCollection.update(contract);
    } else {}
})

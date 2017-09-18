const web3 = require("./connector.js");
const co = require('co');
const path = require("path");
const fs = require("fs");
const assert = require("assert");
const instanceInsuranceContractFactory = web3.InsuranceContractFactory;
const eth = web3.eth;

var instanceFlightDelayContract = web3.FlightDelayContract;



module.exports = {

    createFlightDelayContract: function(_sender) {

        instanceInsuranceContractFactory.createFlightDelayContract({ from: _sender, gas: 4000000 });

        return new Promise((resolve, reject) => {
            instanceInsuranceContractFactory.FlightDelayContractCreation((error, result) => {
                if (!error) {
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
        return(instanceFlightDelayContract.address)
    },

    setOracle: function(_oracle, _sender) {

        instanceFlightDelayContract.setOracle(_oracle, { from: _sender });

        return new Promise((resolve, reject) => {
            instanceFlightDelayContract.OracleSet((error, result) => {
                if (!error) {
                    resolve(result);
                } else { reject(error); }
            })
        })

    },

    request: function(_airlinecode, _flightnumber, _originflightdate, _insuranceValue, _durationInBlocks, _sender) {

        instanceFlightDelayContract.request(_airlinecode, _flightnumber, _originflightdate, _insuranceValue, _durationInBlocks, { from: _sender, gas: 4000000 })

        return new Promise((resolve, reject) => {
            instanceFlightDelayContract.InsuranceRequest((error, result) => {
                if (!error) {
                    resolve(result);
                } else { reject(error); }
            })
        })

    },

    accept: function(_price, _sender, _value) {

        instanceFlightDelayContract.accept(_price, { from: _sender, value: _value });

        return new Promise((resolve, reject) => {
            instanceFlightDelayContract.Accepted((error, result) => {
                if (!error) {
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
                    resolve(result);
                } else { reject(error); }
            })
        })

    },
    trigger: function(_accessToken) {

        instanceFlightDelayContract.trigger(_accessToken);

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
                    // console.log(result);
                    resolve(result);
                } else { reject(error); }
            })
        });
    },
    web3: web3

}
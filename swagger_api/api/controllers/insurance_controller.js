'use strict';
var web3 = require("./blockchain/connector.js");


module.exports = {

    requestInsurance: function(req, res) {
        try {
            var yourAddress = req.swagger.params.requestInsuranceRequest.value.yourAddress;
            var eqcontract = req.swagger.params.requestInsuranceRequest.value.eqcontract;
            var strength = req.swagger.params.requestInsuranceRequest.value.strength;
            var geolocation = req.swagger.params.requestInsuranceRequest.value.geolocation;
            var value = req.swagger.params.requestInsuranceRequest.value.value;
            var duration = req.swagger.params.requestInsuranceRequest.value.duration;

            if (eqcontract == "string") {
                eqcontract = web3.eqcontract.address;
            }
            if (yourAddress == "string") {
                yourAddress = web3.eth.accounts[1];
            }

            console.log(eqcontract, 123123)
            var contract = web3.eqcontract_contract.at(eqcontract);

            var addr = contract.request(strength, geolocation, value, duration, { from: yourAddress });

            contract.insuranceRequest(function(error, result) {
                var _strength = result.args._strength;
                var _geolocation = result.args._geolocation;
                var _value = result.args._value;
                var _duration = result.args._duration;

                res.statusCode = 200;
                res.end(JSON.stringify({ "strength": _strength, "geolocation": _geolocation, "value": _value, "duration": _duration }));
            })

        } catch (error) {
            res.statusCode = 500;
            res.end(error.message);
        }
    },

    confirm: function(req, res) {
        try {
            var yourAddress = req.swagger.params.confirmRequest.value.yourAddress;
            var eqcontract = req.swagger.params.confirmRequest.value.eqcontract;
            var ether = req.swagger.params.confirmRequest.value.ether;

            if (eqcontract == "string") {
                eqcontract = web3.eqcontract.address;
            }

            if (yourAddress == "string") {
                yourAddress = web3.eth.accounts[2];
            }

            var contract = web3.eqcontract_contract.at(eqcontract);

            // console.log(contract.costs())
            contract.confirm({ from: yourAddress, value: ether });

            contract.confirmEvent(function(error, result) {
                var _paid = result.args._paid;
                var _from = result.args._from;


                res.statusCode = 200;
                res.end(JSON.stringify({ "paid": _paid, "from": _from }));
            })


        } catch (error) {
            res.statusCode = 500;
            res.end("not enough money sent");
        }
    },

    accept: function(req, res) {
        try {
            var yourAddress = req.swagger.params.acceptRequest.value.yourAddress;
            var eqcontract = req.swagger.params.acceptRequest.value.eqcontract;
            var costs = req.swagger.params.acceptRequest.value.costs;

            if (eqcontract == "string") {
                eqcontract = web3.eqcontract.address;
            }

            if (yourAddress == "string") {
                yourAddress = web3.eth.accounts[0];
            }

            var contract = web3.eqcontract_contract.at(eqcontract);

            // console.log(contract.costs())
            contract.accept(costs, { from: yourAddress });

            contract.acceptEvent(function(error, result) {
                var _costs = result.args._costs;

                res.statusCode = 200;
                res.end(JSON.stringify({ "_costs": _costs }));
            })


        } catch (error) {
            res.statusCode = 500;
            res.end(error.message);
        }
    },
    lockCollateral: function(req, res) {
        try {
            var yourAddress = req.swagger.params.lockCollateralRequest.value.yourAddress;
            var eqcontract = req.swagger.params.lockCollateralRequest.value.eqcontract;
            var ether = req.swagger.params.lockCollateralRequest.value.ether;

            if (eqcontract == "string") {
                eqcontract = web3.eqcontract.address;
            }

            if (yourAddress == "string") {
                yourAddress = web3.eth.accounts[0];
            }

            var contract = web3.eqcontract_contract.at(eqcontract);

            // console.log(contract.costs())
            contract.lockCollateral({ from: yourAddress, value: ether });

            contract.isActiveEvent(function(error, result) {
                var _collateral = result.args._collateral;

                res.statusCode = 200;
                res.end(JSON.stringify({ "collateral": _collateral }));
            })


        } catch (error) {
            res.statusCode = 500;
            res.end(error.message);
        }
    },
    close: function(req, res) {
        try {
            var yourAddress = req.swagger.params.closeRequest.value.yourAddress;
            var eqcontract = req.swagger.params.closeRequest.value.eqcontract;

            if (eqcontract == "string") {
                eqcontract = web3.eqcontract.address;
            }

            if (yourAddress == "string") {
                yourAddress = web3.eth.accounts[0];
            }

            var contract = web3.eqcontract_contract.at(eqcontract);

            // console.log(contract.costs())
            contract.close({ from: yourAddress });

            contract.closeEvent(function(error, result) {
                var _collateral = result.args._collateral;

                res.statusCode = 200;
                res.end(JSON.stringify({ "collateral": _collateral }));
            })


        } catch (error) {
            res.statusCode = 500;
            res.end(error.message);
        }
    }, 
        trigger: function(req, res) {
        try {
            var yourAddress = req.swagger.params.triggerRequest.value.yourAddress;
            var eqcontract = req.swagger.params.triggerRequest.value.eqcontract;

            if (eqcontract == "string") {
                eqcontract = web3.eqcontract.address;
            }

            if (yourAddress == "string") {
                yourAddress = web3.eth.accounts[2];
            }

            var contract = web3.eqcontract_contract.at(eqcontract);

            // console.log(contract.costs())
            contract.trigger({ from: yourAddress });

            contract.triggeredEvent(function(error, result) {
                var _collateral = result.args._collateral;

                res.statusCode = 200;
                res.end(JSON.stringify({ "collateral": _collateral }));
            })


        } catch (error) {
            res.statusCode = 500;
            res.end(error.message);
        }
    }

}

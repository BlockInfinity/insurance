'use strict';
var web3 = require("./blockchain/connector.js");


module.exports = {

    getEQContract: function(req, res) {
        try {
            var id = req.swagger.params.getEQContractRequest.value.id;
            var addr = web3.factory.getEarthQuakeContract(id);
            res.statusCode = 200;
            res.end(JSON.stringify({ "address": addr }));
        } catch (error) {
            res.statusCode = 500;
            res.end(error.message);
        }
    },

    getCollateral: function(req, res) {
        try {
            var eqcontract = req.swagger.params.getCollateralRequest.value.eqcontract;

            // console.log(eqcontract,1)
            if (eqcontract == "string") {
                eqcontract = web3.eqcontract.address;
            }


            var eqcontract = web3.eqcontract.address;

            var contract = web3.eqcontract_contract.at(eqcontract);


            var collateral = contract.collateral();


            res.statusCode = 200;
            res.end(JSON.stringify({ "collateral": collateral }));



        } catch (error) {
            res.statusCode = 500;
            res.end(error.message);
        }
    },


    getCosts: function(req, res) {
        try {
            var eqcontract = req.swagger.params.getCostsRequest.value.eqcontract;

            // console.log(eqcontract,1)
            if (eqcontract == "string") {
                eqcontract = web3.eqcontract.address;
            }


            var eqcontract = web3.eqcontract.address;

            var contract = web3.eqcontract_contract.at(eqcontract);


            var costs = contract.costs();


            res.statusCode = 200;
            res.end(JSON.stringify({ "costs": costs }));



        } catch (error) {
            res.statusCode = 500;
            res.end(error.message);
        }
    },


    getAllAccounts: function(req, res) {
        try {
            var accounts = web3.eth.accounts;
            res.statusCode = 200;
            res.end(JSON.stringify(accounts));
        } catch (error) {
            res.statusCode = 500;
            res.end(error.message);
        }
        res.end();
    },


}

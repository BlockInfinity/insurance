'use strict';
var web3 = require("./blockchain/connector.js");
var db = require("./db/db_controller.js");

var eth = web3.eth;

module.exports = {


    create: function(req, res) {
        try {
            var address = req.swagger.params.createRequest.value.address;

            if (address == "string") {
                address = eth.accounts[0];
            }
            console.log(address);
            console.log(web3.factory.createEarthQuakeContract);
            console.log(web3.factory.address);

            web3.factory.createEarthQuakeContract({ from: address , gas: 8000000 });

            web3.factory.EQContractCreation(function(error, result) {
                var contractAddress = result.args._eqcontract;
                var id = result.args._id;

                
                db.saveEQcontract(contractAddress, address, "none", "open");


                res.statusCode = 200;
                res.end(JSON.stringify({ "address": contractAddress, "id": id }));
            })


        } catch (error) {
            res.statusCode = 500;
            res.end(error.message);
        }
    }

}

'use strict';
var web3 = require("./blockchain/connector.js");
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

            web3.factory.createEarthQuakeContract({from:eth.accounts[0], gas: 8000000});
            
            // web3.factory.createEarthQuakeContract({from:address, gas: 8000000});

            res.statusCode = 200;
            res.end(JSON.stringify({ "succeeded": true }));
        } catch (error) {
            res.statusCode = 500;
            res.end(error.message);
        }
    }

}

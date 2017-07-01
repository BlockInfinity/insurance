'use strict';
var web3 = require("./blockchain/connector.js");


module.exports = {

    getEQContract: function(req, res) {
        try {
            var id = req.swagger.params.getEQContractRequest.value.id;
            console.log(id);
            var addr = web3.factory.getEarthQuakeContract(id);
            res.statusCode = 200;
            res.end(JSON.stringify({ "address": addr }));
        } catch (error) {
            res.statusCode = 500;
            res.end(error.message);
        }
    }

}

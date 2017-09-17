var fs = require('fs');
var path = require('path');



var InsuranceContractFactory = artifacts.require("./InsuranceContractFactory.sol");
var FlightDelayContract = artifacts.require("./FlightDelayContract.sol");
var usingOraclize = artifacts.require("./usingOraclize.sol");
var Oracle = artifacts.require("./Oracle.sol");

module.exports = function(deployer) {


    deployer.deploy(usingOraclize);


    // todo: Oracle deployen und adresse von Oracle im json niederschreiben
    // todo: usingOraclize niederschreiben auch wenn die adresse die gleiche ist wie eacontract 

    var p1 = deployer.deploy(InsuranceContractFactory);
    var p2 = deployer.deploy(FlightDelayContract);
    var p3 = deployer.deploy(Oracle);
    
    Promise.all([p1, p2, p3]).then(function() {

        var p3 = FlightDelayContract.deployed();
        var p4 = InsuranceContractFactory.deployed();
        var p5 = Oracle.deployed();


        Promise.all([p3, p4, p5]).then(values => {
            console.log(values[0].address); // [3, 1337, "foo"]
            var obj = { "FlightDelayContract": values[0].address, "InsuranceContractFactory": values[1].address, "usingMGSOracle": values[0].address, "Oracle": values[2].address };
            console.log(obj);
            var jsonPath = path.join(__dirname, '..', '/contracts/addresses.json');
            fs.writeFile(jsonPath, JSON.stringify(obj), function(err) {
                if (err) {
                    return console.log(err);
                }
            });
        });
    });


};

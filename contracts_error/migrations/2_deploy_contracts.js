var fs = require('fs');
var path = require('path');

var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");

var InsuranceContractFactory = artifacts.require("./InsuranceContractFactory.sol");
var EarthQuakeContract = artifacts.require("./EarthQuakeContract.sol");

module.exports = function(deployer) {

    var p1 = deployer.deploy(InsuranceContractFactory);
    var p2 = deployer.deploy(EarthQuakeContract, web3.eth.accounts[0]);

    deployer.deploy(ConvertLib);
    deployer.link(ConvertLib, MetaCoin);
    deployer.deploy(MetaCoin);

    Promise.all([p1, p2]).then(function() {

        var p3 = EarthQuakeContract.deployed();
        var p4 = InsuranceContractFactory.deployed();

        Promise.all([p3, p4]).then(values => {
            console.log(values[0].address); // [3, 1337, "foo"]
            var obj = { "InsuranceContractFactory": values[0].address, "EarthQuakeContract": values[1].address };
            console.log(obj);
            var jsonPath = path.join(__dirname, '..', 'build/contracts/addresses.json');
            fs.writeFile(jsonPath, JSON.stringify(obj), function(err) {
                if (err) {
                    return console.log(err);
                }
            });
        });
    });


};

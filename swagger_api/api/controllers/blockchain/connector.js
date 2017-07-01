var web3;
var path = require('path');


try {
    var web3 = require("web3");
    var fs = require('fs')

    web3 = new web3();
    web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
    web3.eth.defaulAccount = web3.eth.accounts[0];

    var compiled;
    var abi;

    var addressesPath = path.join(__dirname, '..','..','..','..','/contracts/build/contracts/addresses.json');
    var addresses = fs.readFileSync(addressesPath).toString();
    addresses = JSON.parse(addresses);

    var jsonPath = path.join(__dirname, '..','..','..','..','/contracts/build/contracts/InsuranceContractFactory.json');
    var abi_ESToken_kwh = fs.readFileSync(jsonPath).toString();
    abi_ESToken_kwh = JSON.parse(abi_ESToken_kwh).abi;
    var contract_ESToken_kwh = web3.eth.contract(abi_ESToken_kwh);
    var contract_ESToken_kwh_instance = contract_ESToken_kwh.at(addresses.InsuranceContractFactory);
    web3.factory = contract_ESToken_kwh_instance;
    console.log(web3.factory,123123)
    web3.factory.createEarthQuakeContract({from:web3.eth.accounts[0],gas:8000000 });

    jsonPath = path.join(__dirname, '..','..','..','..','/contracts/build/contracts/EarthQuakeContract.json');
    var abi_KwhToken = fs.readFileSync(jsonPath).toString();
    abi_KwhToken = JSON.parse(abi_KwhToken).abi;
    var contract_KwhToken = web3.eth.contract(abi_KwhToken);
    var contract_KwhToken_instance = contract_KwhToken.at(addresses.EarthQuakeContract);
    web3.eqcontract = contract_KwhToken_instance;

    // console.log(web3);

} catch (err) {
    throw new Error(err);
}

module.exports = web3;

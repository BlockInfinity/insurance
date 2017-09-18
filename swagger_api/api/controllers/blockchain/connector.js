try {
    var path = require('path');


    var web3 = require("web3");
    var fs = require('fs')
        // var eth = web3.eth; 


    web3 = new web3();
    web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
    web3.eth.defaulAccount = web3.eth.accounts[0];
    var eth = web3.eth;

    // var compiled;
    // var abi;

    var addressesPath = path.join(__dirname, '..','..','..','..','/contracts/contracts/addresses.json');
    var addresses = fs.readFileSync(addressesPath).toString();
    addresses = JSON.parse(addresses);

    console.log(addresses);

    var jsonPath = path.join(__dirname, '..', '..', '..', '..', '/contracts/build/contracts/InsuranceContractFactory.json');
    var abi_eqfactory = fs.readFileSync(jsonPath).toString();
    abi_eqfactory = JSON.parse(abi_eqfactory).abi;


    // #############################
    var eqcontract_contract = web3.eth.contract(abi_eqfactory)
    // var factory = eqcontract_contract.at("0xe6847c7729be0fe24d34c57718c9ce6948e7cc4e")
    var factory = eqcontract_contract.at(addresses.InsuranceContractFactory)

    web3.factory =  factory;

    // var x =  web3.factory.createEarthQuakeContract({ from: eth.accounts[0], gas: 8000000 })
    // var y =  web3.factory.getEarthQuakeContract(0);
    // console.log(x, 1)
    // console.log(y, 2);


    jsonPatheqcontract = path.join(__dirname, '..', '..', '..', '..', '/contracts/build/contracts/EarthQuakeContract.json');
    var abi_eqcontract = fs.readFileSync(jsonPatheqcontract).toString();
    abi_eqcontract = JSON.parse(abi_eqcontract).abi;


    var eqcontract_contract = web3.eth.contract(abi_eqcontract)
    web3.eqcontract_contract = eqcontract_contract;
    var eqcontract = eqcontract_contract.at(addresses.EarthQuakeContract)
    web3.eqcontract =  eqcontract;

    console.log(web3.eqcontract.costs(),1231);
    console.log(web3.eqcontract.collateral(),1231);
    // web3.eqcontract.request(1,"1232",1,1,{from: eth.accounts[1], gas: 8000000});



} catch (err) {
    throw new Error(err);
}

module.exports = web3;

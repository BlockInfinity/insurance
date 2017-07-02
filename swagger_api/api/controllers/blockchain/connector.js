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
    // console.log(abi_eqfactory);
    // var abi_browser = [{ "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "contracts", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getEarthQuakeContract", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "createEarthQuakeContract", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "fuck", "type": "string" }], "name": "test", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "_eqcontract", "type": "address" }, { "indexed": false, "name": "_id", "type": "uint256" }], "name": "EQContractCreation", "type": "event" }];


    // if (String(abi_eqfactory) == String(abi_browser)) {
    //     console.log("equal")
    // } else {
    //     console.log(abi_eqfactory);
    //     console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    //     console.log(abi_browser);

    // }

    // var contract_eqfactory = web3.eth.contract(abi_eqfactory);
    // var contract_eqfactory_instance = contract_eqfactory.at(addresses.InsuranceContractFactory);
    // web3.factory = contract_eqfactory_instance;
    // console.log(web3.eth.accounts)
    // console.log(web3.factory.address,123123)

    // eth.getBalance(eth.accounts[0])
    // console.log(eth);
    // console.log(web3.fromWei(eth.getBalance(eth.accounts[0])));

    // #############################
    var browser_insurancecontractfactory_sol_insurancecontractfactoryContract = web3.eth.contract(abi_eqfactory)
    // var browser_insurancecontractfactory_sol_insurancecontractfactory = browser_insurancecontractfactory_sol_insurancecontractfactoryContract.at("0xe6847c7729be0fe24d34c57718c9ce6948e7cc4e")
    var browser_insurancecontractfactory_sol_insurancecontractfactory = browser_insurancecontractfactory_sol_insurancecontractfactoryContract.at(addresses.InsuranceContractFactory)

    web3.factory =  browser_insurancecontractfactory_sol_insurancecontractfactory;

    var x =  web3.factory.createEarthQuakeContract({ from: eth.accounts[0], gas: 8000000 })
    var y =  web3.factory.getEarthQuakeContract(0);
    console.log(x, 1)
    console.log(y, 2);


    // #############################


    // var browser_insurancecontractfactory_sol_insurancecontractfactoryContract = web3.eth.contract([{ "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "contracts", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "_id", "type": "uint256" }], "name": "getEarthQuakeContract", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "createEarthQuakeContract", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "fuck", "type": "string" }], "name": "test", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "_eqcontract", "type": "address" }, { "indexed": false, "name": "_id", "type": "uint256" }], "name": "EQContractCreation", "type": "event" }]);
    // var browser_insurancecontractfactory_sol_insurancecontractfactory = browser_insurancecontractfactory_sol_insurancecontractfactoryContract.at("0xe6847c7729be0fe24d34c57718c9ce6948e7cc4e")

    // var x = browser_insurancecontractfactory_sol_insurancecontractfactory.createEarthQuakeContract({ from: eth.accounts[0], gas: 8000000 })
    // var y = browser_insurancecontractfactory_sol_insurancecontractfactory.getEarthQuakeContract(0);
    // console.log(x, 1)
    // console.log(y, 2);
    // #############################

    jsonPatheqcontract = path.join(__dirname, '..', '..', '..', '..', '/contracts/build/contracts/EarthQuakeContract.json');
    var abi_eqcontract = fs.readFileSync(jsonPatheqcontract).toString();
    abi_eqcontract = JSON.parse(abi_eqcontract).abi;


    var eqcontract_contract = web3.eth.contract(abi_eqcontract)
    var eqcontract = eqcontract_contract.at(addresses.EarthQuakeContract)
    web3.eqcontract =  eqcontract;

    web3.eqcontract.request(1,"1232",1,1,{from: eth.accounts[0], gas: 8000000});



    // var x =  web3.factory.createEarthQuakeContract({ from: eth.accounts[0], gas: 8000000 })
    // var y =  web3.factory.getEarthQuakeContract(0);
    // console.log(x, 1)
    // console.log(y, 2);


    // jsonPath = path.join(__dirname, '..','..','..','..','/contracts/build/contracts/EarthQuakeContract.json');
    // var abi_KwhToken = fs.readFileSync(jsonPath).toString();
    // abi_KwhToken = JSON.parse(abi_KwhToken).abi;
    // var contract_KwhToken = web3.eth.contract(abi_KwhToken);
    // var contract_KwhToken_instance = contract_KwhToken.at(addresses.EarthQuakeContract);
    // web3.eqcontract = contract_KwhToken_instance;
    // console.log(web3.eqcontract.address,1234124);
    // console.log(web3.eqcontract.request(1,"asdad",1,1,{from: web3.eth.accounts[0]}));

} catch (err) {
    throw new Error(err);
}

module.exports = web3;

// ##################### Platzhalter für die app Logik 

const api = require("./api.js");
const web3 = require("./blockchain/connector.js");
const eth = web3.eth;

var _insurer = eth.accounts[0];

api.createFlightDelayContract(_insurer).then(res => {
    // console.log(res.args._contract + " created");
    _addr = res.args._contract;
    _from = res.args._from;
    console.log(`FlightDelayContract with address ${_addr} was created by ${_from} \n`)

    let _contractInfo = api.getContract(_addr)
    console.log(`The current FlightDelayContract info: \n ${JSON.stringify(_contractInfo)}`)
})
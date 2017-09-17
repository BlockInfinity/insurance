const web3 = require("./connector.js");
const request = require("request");

const instanceOracle = web3.Oracle;
const instanceFlightDelayContract = web3.FlightDelayContract;

console.log("instanceOracle",instanceOracle.address)
instanceOracle.Query(function(error, result) {
    if (!error) {
        console.log("in Query listener")
        requestApi(result);
    } else { throw error; }
})


function requestApi(result) {

    let _airlinecode = result.args._airlinecode
    let _flightnumber = result.args._flightnumber
    let _originflightdate = result.args._originflightdate
    let _accesstoken = result.args._accessToken
    let id = result.args.id

    let options = {
        url: 'https://developer.fraport.de/api/flights/1.0/flightDetails/' + _airlinecode + '/' + _flightnumber + '/' + _originflightdate,
        headers: {
            "Authorization": "Bearer " + _accesstoken
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            let info = JSON.parse(body);
            instanceFlightDelayContract.__callback(id, info[0].flight.flightStatus)
        }
    }

    request(options, callback);
}

module.exports = {
    requestApi: requestApi
}
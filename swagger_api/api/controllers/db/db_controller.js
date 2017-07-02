'use strict';
var web3 = require("../blockchain/connector.js");
var DB = require('nosql');
var eqcontracts = DB.load('./nosql_db/eqcontracts.nosql');

function filterObjects(array) {
    var flags = [], output = [], l = array.length, i;
    for( i=0; i<l; i++) {
        if( flags[array[i].eqcontract]) continue;
        flags[array[i].eqcontract] = true;
        output.push(array[i]);
    }
    return output;
}

module.exports = {

    deleteDataBase: function() {
        eqcontracts.drop();
        eqcontracts = DB.load('./nosql_db/eqcontracts.nosql');
    },
    saveEQcontract: function(_eqcontract, _insurer, _customer, _status, _duration, _strength, _value) {
        eqcontracts.insert({ eqcontract: _eqcontract, insurer: _insurer, customer: _customer, status: _status, duration: _duration, strength: _strength, value: _value })
    },

    getAllCustomerEQContracts: function(_address) {
        return new Promise(function(resolve, reject) {
            eqcontracts.find().make(function(builder) {
                builder.where('customer', _address);
                builder.callback(function(err, response) {
                    if (!err) {
                        resolve(filterObjects(response));
                    } else {
                        reject(err);
                    }
                });
            });
        });
    },

    getAllInsurerEQContracts: function(_address) {
        return new Promise(function(resolve, reject) {
            eqcontracts.find().make(function(builder) {
                builder.where('insurer', _address);
                builder.callback(function(err, response) {
                    if (!err) {
                        resolve(filterObjects(response));
                    } else {
                        reject(err);
                    }
                });
            });
        });
    },

    getEQContractInfo: function(_address) {
        return new Promise(function(resolve, reject) {
            eqcontracts.one().make(function(builder) {
                builder.where('eqcontract', _address);
                builder.callback(function(err, response) {
                    if (!err) {
                        resolve(response);
                    } else {
                        reject(err);
                    }
                });
            });
        });
    },

    eqcontracts: eqcontracts,

}

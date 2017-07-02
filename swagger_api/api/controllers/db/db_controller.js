'use strict';
var web3 = require("../blockchain/connector.js");
var DB = require('nosql');
var eqcontracts = DB.load('./nosql_db/eqcontracts.nosql');








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
                        resolve(response);
                    } else {
                        reject(err);
                    }
                });
            });
        });
    },
    getAllInsurerEQContracts: function(_address) {
        return new Promise(function(resolve, reject) {
            eqcontracts.one().make(function(builder) {
                builder.where('customer', _address);
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
    getAllInsurerEQContracts: function(_address) {
    	return new Promise(function(resolve, reject) {
            eqcontracts.one().make(function(builder) {
                builder.where('insurer', _address);
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

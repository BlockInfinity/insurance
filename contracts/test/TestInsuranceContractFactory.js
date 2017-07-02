"use strict";
require('babel-polyfill');
const co = require('co');
const chai = require('chai');


var InsuranceContractFactory = artifacts.require("./InsuranceContractFactory.sol");
var factory;
var owner;
var eth = web3.eth;

contract("factory", function(accounts) {

    before(function() {
        return co(function*() {
            owner = accounts[0];
            factory = yield InsuranceContractFactory.deployed();

        });
    });


    it('the contract should be deployed to the blockchain', function() {
        assert(factory != undefined, "factory not deployed");
    });


    it('createEarthQuakeContract', function() {
        return co(function*() {
            var id = yield factory.createEarthQuakeContract({from: eth.accounts[0]});
            var addr =  yield factory.getEarthQuakeContract(parseInt(id));
            assert(String(addr).startsWith("0x"), "addr not set");
        });
    });


});

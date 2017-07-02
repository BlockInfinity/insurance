"use strict";
require('babel-polyfill');
const co = require('co');
const chai = require('chai');
const expect = chai.expect;


var EarthQuakeContract = artifacts.require("./EarthQuakeContract.sol");
var eqcontract;
var owner;
var eth = web3.eth;

contract("eqcontract", function(accounts) {

    before(function() {
        return co(function*() {
            owner = accounts[0];
            eqcontract = yield EarthQuakeContract.deployed();
        });
    });


    it('the contract should be deployed to the blockchain', function() {
        assert(eqcontract != undefined, "factory not deployed");
    });

    it('request', function() {
        return co(function*() {
            eqcontract.request(6, "japan", web3.toWei(1000), 2628000, { from: eth.accounts[1] })
            var customer = yield eqcontract.customer();
            assert(customer == eth.accounts[1], "customer wrong")
        });
    });

    it('request should fail when called twice', function() {
        return co(function*() {
            try {
                yield eqcontract.request(6, "japan", web3.toWei(1000), 2628000, { from: eth.accounts[1] });
            } catch (error) {
                assert(String(error.message).endsWith("invalid opcode"));
            }
        });
    });

    it('accept call only by insurer', function() {
        return co(function*() {
            yield eqcontract.accept(web3.toWei(10000), { from: eth.accounts[0] });
            try {
                yield eqcontract.accept(web3.toWei(10000), { from: eth.accounts[1] });
            } catch (error) {
                assert(String(error.message).endsWith("invalid opcode"));
            }
        });
    });


    //  it('confirm', function() {
    //     return co(function*() {
    //         eth.getBalance(eth.accounts[0]);
    //         yield.confirm({from: eth.accounts[1], value: web3.toWei(10000)});
    //     });
    // });




});

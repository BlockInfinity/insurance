pragma solidity ^0.4.4;

import "./EarthQuakeContract.sol";

contract InsuranceContractFactory {

    address[] public contracts;

    event EQContractCreation(address _eqcontract, uint _id);

    function createEarthQuakeContract() returns(uint) {
        address eqcontract = new EarthQuakeContract(msg.sender);
        contracts.push(eqcontract);
        uint id = contracts.length - 1;
        EQContractCreation(eqcontract, id);
        return id;
    }
    
    function getEarthQuakeContract(uint _id) constant returns(address) {
        return contracts[_id];
    }

}
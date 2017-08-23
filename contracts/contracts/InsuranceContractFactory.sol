pragma solidity ^0.4.4;

import "./EarthQuakeContract.sol";

contract InsuranceContractFactory {

    address[] public contracts;

    event EQContractCreation(address _eqcontract);

    function createEarthQuakeContract() returns(address) {
        address eqcontract = new EarthQuakeContract(msg.sender);
        contracts.push(eqcontract);
        uint id = contracts.length - 1;
        EQContractCreation(eqcontract);
        return eqcontract;
    }
    


}
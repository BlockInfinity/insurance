pragma solidity ^0.4.4;

import "./EarthQuakeContract.sol";
import "./FlightDelayContract.sol"

contract InsuranceContractFactory {

    address[] public contracts;

    event EQContractCreation(address _eqcontract);
    event FlightDelayContractCreation(address _contract);

    function createEarthQuakeContract() returns(address) {
        address eqcontract = new EarthQuakeContract(msg.sender);
        contracts.push(eqcontract);
        uint id = contracts.length - 1;
        EQContractCreation(eqcontract);
        return eqcontract;
    }
    	
    function createFlightDelayContract() returns(address) {
        address addr = new FlightDelayContract(msg.sender);
        contracts.push(addr);
        uint id = contracts.length - 1;
        FlightDelayContractCreation(addr);
        return addr;
    }
    
}
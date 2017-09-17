pragma solidity ^0.4.4;

import "./FlightDelayContract.sol";

contract InsuranceContractFactory {

    address[] public contracts;

    event FlightDelayContractCreation(address _contract);

    function createFlightDelayContract() returns(address) {
        address addr = new FlightDelayContract();
        contracts.push(addr);
        uint id = contracts.length - 1;
        FlightDelayContractCreation(addr);
        return addr;
    }
    
}
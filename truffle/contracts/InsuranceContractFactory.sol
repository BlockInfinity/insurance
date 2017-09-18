pragma solidity ^0.4.10;

import "./FlightDelayContract.sol";

contract InsuranceContractFactory {

    address[] public contracts;

    event FlightDelayContractCreation(address _contract, address _from);

    function createFlightDelayContract() returns(address) {
        address addr = new FlightDelayContract();
        contracts.push(addr);
        uint id = contracts.length - 1;
        FlightDelayContractCreation(addr, msg.sender);
        return addr;
    }
    
}
pragma solidity ^0.4.4;

import "./Oracle.sol";

contract usingMGSOracle {
    Oracle public oracle; 

    function __callback(bytes32 myid, string result);

}
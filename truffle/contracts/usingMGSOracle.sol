pragma solidity ^0.4.4;

contract Oracle {

    event Query(string datasource, string arg, address cbaddress, bytes32 id)

    function query(string datasource, string arg, address cbaddress) oraclizeAPI returns (bytes32 id){
        id = sha256(msg.sender, block.number, datasource, arg, cbaddress);
        Query(datasource, arg, cbaddress, id);
        return id;
    }

}

contract usingMGSOracle {
    Oracle oracle; 

    function __callback(bytes32 myid, string result);

}
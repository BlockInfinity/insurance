pragma solidity ^0.4.4;

contract Oracle {

    event Query(string _airlinecode, uint256 _flightnumber, string _originflightdate, address cbaddress, bytes32 id, string _accessToken);

    function query(string _airlinecode, uint256 _flightnumber, string _originflightdate, address cbaddress, string _accessToken) returns (bytes32 id){
        id = sha256(msg.sender, block.number, _airlinecode, _flightnumber, _originflightdate, cbaddress);
        Query(_airlinecode, _flightnumber, _originflightdate, cbaddress, id, _accessToken);
        return id;
    }

}
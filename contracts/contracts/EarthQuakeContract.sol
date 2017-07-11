pragma solidity ^0.4.4;

import "./usingOraclize.sol";

contract EarthQuakeContract is usingOraclize {
    // customer
    uint public strength;
    string public geolocation;
    uint public value;
    uint public duration;
    // insurer
    uint public costs; 
    address public customer;
    address public insurer;
    uint256 public genesisBlock;

    uint public collateral;
    bool public initial = true;
    
    event insuranceRequest(uint _strength,string _geolocation,uint  _value,uint _duration);
    event confirmEvent(uint _paid, address _from);
    event triggerEvent(bool _success, uint _collateral);
    event acceptEvent(uint _costs);
    event isActiveEvent(uint _collateral);
    event closeEvent(uint _collateral);
    event triggeredEvent(uint _collateral);

    function EarthQuakeContract(address _insurer){
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
        insurer = _insurer;
        genesisBlock = block.number;
    }

    modifier onlyInsurer() { 
        if (msg.sender != insurer) throw; 
        _; 
    }

    modifier onlyInitial() { 
        if (initial == false) throw; 
        _; 
    }
    
    // customer
    function request(uint _strength, string _geolocation, uint  _value, uint _duration) /*onlyInitial()*/ {
        initial = false;
        customer = msg.sender;
        strength = _strength;
        geolocation = _geolocation;
        value = _value;
        duration = _duration;
        insuranceRequest( _strength, _geolocation,_value, _duration);    
    }

    function confirm() payable {
        if (msg.value < costs) {throw;}
        insurer.transfer(msg.value);
        confirmEvent(msg.value, msg.sender);
    }
    
    // eigt sendet __callback geld an customer
    function trigger() {
         triggeredEvent(collateral);
         customer.transfer(collateral);
    }

    // oraclize 
    // function __callback(bytes32 myid, string result) {
       
    // }

    //insurer
    function accept(uint _costs) onlyInsurer(){
        costs = _costs;
        acceptEvent(_costs);
    }

    function lockCollateral() onlyInsurer() payable {
        if (msg.value < value) { throw;}
        collateral = msg.value;
        isActiveEvent(msg.value); 
    }

    function close() onlyInsurer() {
        if ((block.number-genesisBlock) < duration) {throw;}
        closeEvent(collateral);
        insurer.transfer(collateral);
    }

    // test section 

    event oraclizeIzDa(string result);

    function sendTestQuery(){
        oraclize_query("URL", "https://api.kraken.com/0/public/Ticker?pair=ETHXBT"); 
    }

    function __callback(bytes32 myid, string result, bytes proof) {
        oraclizeIzDa(result);
    }
  
}
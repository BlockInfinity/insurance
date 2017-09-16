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
    
    event InsuranceRequest(uint _strength,string _geolocation,uint  _value,uint _duration);
    event confirmEvent(uint _paid, address _from);
    event triggerEvent(bool _success, uint _collateral);
    event acceptEvent(uint _costs);
    event isActiveEvent(uint _collateral);
    event closeEvent(uint _collateral);
    event triggeredEvent(uint _collateral);

    bool isAccepted;
    bool isConfirmed;

    function EarthQuakeContract(address _insurer){
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
        insurer = _insurer;
        genesisBlock = block.number;
    }

    modifier onlyInsurer() { 
        if (msg.sender != insurer) throw; 
        _; 
    }

    modifier onlyInitially() { 
        if (initial == false) throw; 
        _; 
    }
    
    // called by customer (step 1 of 3 from handshake)
    function request(uint _strength, string _geolocation, uint  _value, uint _duration) onlyInitially() {
        initial = false;
        customer = msg.sender;
        strength = _strength;
        geolocation = _geolocation;
        value = _value;
        duration = _duration;
        InsuranceRequest( _strength, _geolocation, _value, _duration);    
    }

    // // called by insurer (step 2 of 3 from handshake)
    // function accept(uint _costs) onlyInsurer(){
    //     costs = _costs;
    //     acceptEvent(_costs);
    // }

    // called by insurer (step 2 of 3 from handshake)
    // collateral gets locked away but is still retrievable via close() function 
    function accept() onlyInsurer() payable {
        if (msg.value < value) { throw;}
        collateral = msg.value;
        isAccepted = true;
        isActiveEvent(msg.value); 
    }


    // called by customer (step 3 of 3 from handshake)
    // customer pays for insurance and the insurer collateral is not retrievable anymore  
    function confirm() payable {
        if (msg.value < costs && isAccepted == false) {throw;}
        insurer.transfer(msg.value);
        isConfirmed = true;
        confirmEvent(msg.value, msg.sender);
    }
    
    // todo: oracle anbinden 
    function trigger() {
         triggeredEvent(collateral);
         // ask oracle
    }

    // todo: oracle anbinden  
    // function __callback(bytes32 myid, string result) {
    //     // if oracle confirms 
    //     customer.transfer(collateral);  
    // }

    function close() onlyInsurer() {
        if ((block.number-genesisBlock) < duration && isConfirmed == true) {throw;}
        isAccepted = false;
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
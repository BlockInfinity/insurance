pragma solidity ^0.4.4;

import "./usingOraclize.sol";
import "./usingMGSOracle.sol";

contract FlightDelayContract is usingMGSOracle {

    // customer's input 
    string public airlinecode; 
    uint  public flightnumber; 
    uint public originflightdate;
    uint public insuranceValue;
    uint public durationInBlocks;


    // insurer's input 
    uint public price; 
    address public customer;
    address public insurer;
    uint256 public genesisBlock;

    uint public collateral;
    bool public initial = true;
    
    event InsuranceRequest(string airlinecode,uint flightnumber,string originflightdate, address customer, uint _durationInBlocks);
    event confirmEvent(uint _paid, address _from);
    event triggerEvent(bool _success, uint _collateral);
    event Accepted(uint _price);
    event isActive(string _airlinecode, uint  _flightnumber, uint _originflightdate);
    event closeEvent(uint _collateral);
    event triggeredEvent(uint _collateral);

    bool public isAccepted;
    bool public isActive;
    bool public isClosed;

    function FlightDelayContract(address _insurer){
        oracle = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
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
    function request(string _airlinecode, uint  _flightnumber, uint _originflightdate, uint  _insuranceValue, uint _durationInBlocks) onlyInitially() {
        airlinecode = _airlinecode;
        flightnumber = _flightnumber;
        originflightdate = _originflightdate;
        customer = msg.sender;
        insuranceValue = _insuranceValue;
        durationInBlocks = _durationInBlocks;

        InsuranceRequest( airlinecode, flightnumber, originflightdate, customer, _durationInBlocks);    
    }

    // called by insurer (step 2 of 3 from handshake)
    // collateral gets locked away but is still retrievable via close() function 
    function accept(uint _price) onlyInsurer() payable {
        if (msg.value < insuranceValue) { throw;}
        collateral = msg.value;
        isAccepted = true;
        price = _price;
        Accepted(price); 
    }


    // called by customer (step 3 of 3 from handshake)
    // customer pays for insurance and the insurer collateral is not retrievable anymore  
    function confirm() payable {
        if (msg.value < price && isAccepted == false) {throw;}
        insurer.transfer(msg.value);
        isActive = true;
        isActive( _airlinecode,   _flightnumber,  _originflightdate);
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
        if ((block.number-genesisBlock) < durationInBlocks && isActive == true) {throw;}
        isClosed = true;
        insurer.transfer(collateral);
        closeEvent(collateral);
    }

    // test section 

    // event oraclizeIzDa(string result);

    // function sendTestQuery(){
    //     oraclize_query("URL", "https://api.kraken.com/0/public/Ticker?pair=ETHXBT"); 
    // }

    // function __callback(bytes32 myid, string result, bytes proof) {
    //     oraclizeIzDa(result);
    // }
  
}
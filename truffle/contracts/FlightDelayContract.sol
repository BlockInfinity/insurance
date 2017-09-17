pragma solidity ^0.4.10;

import "./usingOraclize.sol";
import "./usingMGSOracle.sol";

contract FlightDelayContract is usingMGSOracle {

    Oracle public oracle;

    // customer's input 
    string public airlinecode; 
    uint  public flightnumber; 
    string public originflightdate;
    uint public insuranceValue;
    uint public durationInBlocks;


    // insurer's input 
    uint public price; 
    address public customer;
    address public insurer;
    uint256 public genesisBlock;

    uint public collateral;
    bool public initial = true;
    
    event InsuranceRequest(string _airlinecode, uint _flightnumber,string _originflightdate, address _customer, uint _durationInBlocks);
    event confirmEvent(uint _paid, address _from);
    event triggerEvent(bool _success, uint _collateral);
    event Accepted(uint _price);
    event isActiveEvent(string _airlinecode, uint  _flightnumber, string _originflightdate);
    event closeEvent(uint _collateral);
    // event triggeredEvent(uint _collateral);
    event OracleSet(address _oracle);

    bool public isAccepted;
    bool public isActive;
    bool public isClosed;
    bool public isRequested;

    function FlightDelayContract(){
        insurer = msg.sender;
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


    function setOracle(address _oracle) onlyInsurer(){
        if (isRequested == true) {throw;}
        oracle = Oracle(_oracle);
        OracleSet(_oracle);
    }
    
    // called by customer (step 1 of 3 from handshake)
    function request(string _airlinecode, uint  _flightnumber, string _originflightdate, uint  _insuranceValue, uint _durationInBlocks) onlyInitially() {
        airlinecode = _airlinecode;
        flightnumber = _flightnumber;
        originflightdate = _originflightdate;
        customer = msg.sender;
        insuranceValue = _insuranceValue;
        durationInBlocks = _durationInBlocks;
        isRequested = true;
        InsuranceRequest( airlinecode, flightnumber, originflightdate, customer, durationInBlocks);    
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
        if (msg.value < price) {throw;}
        insurer.transfer(msg.value);
        isActive = true;
        isActiveEvent( airlinecode,   flightnumber,  originflightdate);
    }
    
    // // todo: oracle anbinden 
    // function trigger() {
    //      triggeredEvent(collateral);
    //      // ask oracle
    // }

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


    // ################################################################## test section 

    event flightStatusEvent(string _status);

    // function sendTestQuery(){
    //     oracle.query("https://api.kraken.com/0/public/Ticker?pair=ETHXBT", "Bearer 62f9b8edbd7636c3f9c5c65c4bccde82", this);
    // }

    function trigger(string accessToken){
        if (isActive == false ) {throw;}

        oracle.query(airlinecode, flightnumber, originflightdate, this, accessToken);
    }

    event InsuranceExecuted(uint256 _collateral, address _customer);

    function __callback(bytes32 myid, string result) {
        flightStatusEvent(result);
        if (sha3(result) == sha3("X") || sha3(result) == sha3("S") || sha3(result) == sha3("M") || sha3(result) == sha3("I")) {
            customer.transfer(collateral);
            InsuranceExecuted(collateral, customer);
        } 
    }
  
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * EXERCICE 8: PAYMENT MANAGEMENT CONTAINER
 * 
 * Demonstrates Ethereum transaction concepts:
 * - msg.sender (who called the function)
 * - msg.value (how much Ether was sent)
 * - payable functions (can receive Ether)
 * - Access control (only certain addresses can perform actions)
 * - Ether transfers and balance management
 * - Security patterns for financial contracts
 * 
 * BLOCKCHAIN CONCEPTS:
 * - Wei vs Ether conversions (1 Ether = 10^18 Wei)
 * - Transaction gas costs and optimization
 * - Smart contract as escrow/wallet
 * - Event logging for transaction tracking
 */

/**
 * CORE PAYMENT CONTRACT
 * Handles basic payment functionality with security features
 * 
 * SECURITY PATTERNS:
 * - Access control with owner/recipient verification
 * - Input validation with require statements
 * - Event logging for transparency
 * - Reentrancy protection considerations
 */
contract Payment {
    
    // STATE VARIABLES: Contract configuration and tracking
    // BLOCKCHAIN CONCEPT: These are permanently stored on the blockchain
    address public recipient;           // Address authorized to withdraw funds
    address public owner;              // Contract deployer (for admin functions)
    uint public totalReceived;         // Total Ether ever received
    uint public totalWithdrawn;        // Total Ether withdrawn
    
    // MAPPING: Track individual contributions
    // BLOCKCHAIN CONCEPT: Key-value storage, each address maps to amount
    mapping(address => uint) public deposits;
    
    // ARRAY: Keep track of all depositors for iteration
    address[] public depositors;
    
    // EVENTS: Blockchain logging for frontend monitoring
    // BLOCKCHAIN CONCEPT: Events are cheaper than storage for historical data
    // INDEXED PARAMETERS: Allow efficient filtering in queries
    event PaymentReceived(address indexed from, uint amount, uint timestamp);
    event PaymentWithdrawn(address indexed to, uint amount, uint timestamp);
    event RecipientChanged(address indexed oldRecipient, address indexed newRecipient);
    
    /**
     * CONSTRUCTOR: Initialize payment contract
     * 
     * ACCESS CONTROL: Sets initial recipient and owner
     * BLOCKCHAIN CONCEPT: Constructor runs once during deployment
     * PARAMETER VALIDATION: Ensures recipient is valid address
     */
    constructor(address _recipient) {
        require(_recipient != address(0), "Recipient cannot be zero address");
        require(_recipient != address(this), "Recipient cannot be contract address");
        
        recipient = _recipient;
        owner = msg.sender;  // Contract deployer becomes owner
    }
    
    /**
     * RECEIVE PAYMENT FUNCTION (RENAMED from receivePayment for clarity)
     * Can receive Ether transfers
     * 
     * PAYABLE MODIFIER: Allows function to receive Ether
     * SECURITY: Validates payment amount and updates tracking
     * BLOCKCHAIN CONCEPT: msg.value contains Wei sent with transaction
     */
    function deposit() public payable {
        require(msg.value > 0, "Payment amount must be greater than 0");
        
        // TRACK FIRST-TIME DEPOSITORS
        if (deposits[msg.sender] == 0) {
            depositors.push(msg.sender);
        }
        
        // UPDATE TRACKING VARIABLES
        deposits[msg.sender] += msg.value;
        totalReceived += msg.value;
        
        // EMIT EVENT FOR FRONTEND NOTIFICATION
        emit PaymentReceived(msg.sender, msg.value, block.timestamp);
    }
    
    /**
     * WITHDRAW FUNCTION
     * Allows recipient to withdraw accumulated funds
     * 
     * ACCESS CONTROL: Only recipient can withdraw
     * SECURITY: Validates caller and available balance
     * BLOCKCHAIN CONCEPT: address(this).balance is contract's Ether balance
     */
    function withdraw() public {
        require(msg.sender == recipient, "Only recipient can withdraw funds");
        require(address(this).balance > 0, "No funds available for withdrawal");
        
        uint contractBalance = address(this).balance;
        totalWithdrawn += contractBalance;
        
        // SECURITY PATTERN: Update state before external call
        // REENTRANCY PROTECTION: Prevents recursive calls
        
        // TRANSFER FUNDS: Built-in security (reverts on failure)
        // BLOCKCHAIN CONCEPT: payable(address) conversion needed for transfers
        payable(recipient).transfer(contractBalance);
        
        emit PaymentWithdrawn(recipient, contractBalance, block.timestamp);
    }
    
    /**
     * PARTIAL WITHDRAW FUNCTION
     * Allows recipient to withdraw specific amount
     * 
     * FLEXIBILITY: Better than all-or-nothing withdrawal
     * VALIDATION: Ensures sufficient funds available
     */
    function withdrawAmount(uint _amount) public {
        require(msg.sender == recipient, "Only recipient can withdraw funds");
        require(_amount > 0, "Withdrawal amount must be greater than 0");
        require(address(this).balance >= _amount, "Insufficient contract balance");
        
        totalWithdrawn += _amount;
        
        payable(recipient).transfer(_amount);
        
        emit PaymentWithdrawn(recipient, _amount, block.timestamp);
    }
    
    /**
     * CHANGE RECIPIENT
     * Allows owner to change who can withdraw funds
     * 
     * ADMIN FUNCTION: Only contract owner can call
     * SECURITY: Validates new recipient address
     */
    function changeRecipient(address _newRecipient) public {
        require(msg.sender == owner, "Only owner can change recipient");
        require(_newRecipient != address(0), "New recipient cannot be zero address");
        require(_newRecipient != address(this), "New recipient cannot be contract address");
        
        address oldRecipient = recipient;
        recipient = _newRecipient;
        
        emit RecipientChanged(oldRecipient, _newRecipient);
    }
    
    /**
     * GET CONTRACT BALANCE
     * Returns current Ether balance of contract
     * 
     * UTILITY FUNCTION: Helps frontend display available funds
     * VIEW FUNCTION: Read-only, no gas cost when called directly
     */
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
    
    /**
     * GET DEPOSITOR COUNT
     * Returns number of unique addresses that have deposited
     */
    function getDepositorCount() public view returns (uint) {
        return depositors.length;
    }
    
    /**
     * GET DEPOSITOR INFO
     * Returns address and deposit amount for specific depositor
     * 
     * BOUNDS CHECKING: Validates array index
     * TUPLE RETURN: Multiple related values
     */
    function getDepositorInfo(uint index) public view returns (address depositorAddress, uint depositAmount) {
        require(index < depositors.length, "Depositor index out of bounds");
        
        depositorAddress = depositors[index];
        depositAmount = deposits[depositorAddress];
    }
    
    /**
     * GET ALL DEPOSITORS
     * Returns arrays of all depositor addresses and their amounts
     * 
     * BULK QUERY: Efficient for frontend to get all data at once
     * GAS CONSIDERATION: May be expensive for large numbers of depositors
     */
    function getAllDepositors() public view returns (address[] memory addresses, uint[] memory amounts) {
        uint length = depositors.length;
        addresses = new address[](length);
        amounts = new uint[](length);
        
        for (uint i = 0; i < length; i++) {
            addresses[i] = depositors[i];
            amounts[i] = deposits[depositors[i]];
        }
    }
    
    /**
     * GET PAYMENT STATISTICS
     * Returns comprehensive contract statistics
     * 
     * DASHBOARD DATA: All key metrics in one function call
     * EFFICIENCY: Reduces number of blockchain queries needed
     */
    function getPaymentStats() public view returns (
        uint currentBalance,
        uint totalEverReceived,
        uint totalEverWithdrawn,
        uint uniqueDepositors,
        address currentRecipient,
        address contractOwner
    ) {
        return (
            address(this).balance,
            totalReceived,
            totalWithdrawn,
            depositors.length,
            recipient,
            owner
        );
    }
    
    /**
     * EMERGENCY FUNCTIONS
     * For contract management and security
     */
    
    /**
     * EMERGENCY STOP (if needed in future versions)
     * Placeholder for pausable functionality
     */
    bool public emergencyStop = false;
    
    modifier notInEmergency() {
        require(!emergencyStop, "Contract is in emergency stop mode");
        _;
    }
    
    /**
     * TOGGLE EMERGENCY STOP
     * Only owner can pause/unpause contract
     */
    function toggleEmergencyStop() public {
        require(msg.sender == owner, "Only owner can toggle emergency stop");
        emergencyStop = !emergencyStop;
    }
    
    /**
     * FALLBACK FUNCTION
     * Automatically called when Ether is sent directly to contract
     * 
     * BLOCKCHAIN CONCEPT: Handles direct Ether transfers
     * DELEGATION: Forwards to deposit function for consistent handling
     */
    receive() external payable {
        deposit();
    }
}

/**
 * MAIN EXERCICE 8 CONTRACT
 * 
 * CONTAINER PATTERN: Manages Payment contract instances
 * FACTORY PATTERN: Can create multiple payment contracts
 * REGISTRY PATTERN: Keeps track of created payment contracts
 */
contract Exercice8 {
    
    // ARRAY: Store multiple payment contract instances
    Payment[] public paymentContracts;
    
    // MAPPING: Link payment contracts to their creators
    mapping(address => uint[]) public creatorToContracts;
    
    // EVENTS: Track payment contract lifecycle
    event PaymentContractCreated(uint indexed contractId, address indexed creator, address contractAddress, address recipient);
    
    /**
     * CREATE PAYMENT CONTRACT
     * 
     * FACTORY FUNCTION: Creates new Payment contract instance
     * BLOCKCHAIN CONCEPT: Deploys new contract and stores reference
     * ACCESS TRACKING: Links contract to creator for management
     */
    function createPaymentContract(address _recipient) public returns (uint contractId) {
        // CREATE NEW PAYMENT CONTRACT
        Payment newPayment = new Payment(_recipient);
        
        // STORE REFERENCE
        paymentContracts.push(newPayment);
        contractId = paymentContracts.length - 1;
        
        // TRACK CREATOR
        creatorToContracts[msg.sender].push(contractId);
        
        // EMIT EVENT
        emit PaymentContractCreated(contractId, msg.sender, address(newPayment), _recipient);
        
        return contractId;
    }
    
    /**
     * DEFAULT PAYMENT CONTRACT
     * Single payment contract for simple use cases
     */
    Payment public defaultPayment;
    
    /**
     * CONSTRUCTOR: Create default payment contract
     * 
     * CONVENIENCE: Provides immediate functionality without factory pattern
     * DEFAULT RECIPIENT: Contract deployer initially
     */
    constructor() {
        defaultPayment = new Payment(msg.sender);
    }
    
    /**
     * PROXY FUNCTIONS: Direct access to default payment contract
     * CONVENIENCE: Allows interaction without specifying contract ID
     */
    
    function deposit() public payable {
        defaultPayment.deposit{value: msg.value}();
    }
    
    function withdraw() public {
        defaultPayment.withdraw();
    }
    
    function getBalance() public view returns (uint) {
        return defaultPayment.getBalance();
    }
    
    function getPaymentStats() public view returns (
        uint currentBalance,
        uint totalEverReceived,
        uint totalEverWithdrawn,
        uint uniqueDepositors,
        address currentRecipient,
        address contractOwner
    ) {
        return defaultPayment.getPaymentStats();
    }
    
    /**
     * FACTORY MANAGEMENT FUNCTIONS
     */
    
    function getPaymentContractCount() public view returns (uint) {
        return paymentContracts.length;
    }
    
    function getMyContractCount() public view returns (uint) {
        return creatorToContracts[msg.sender].length;
    }
    
    function getMyContracts() public view returns (uint[] memory) {
        return creatorToContracts[msg.sender];
    }
    
    /**
     * GET CONTRACT INFO
     * Debugging and transparency function
     */
    function getContractInfo() public view returns (string memory, address, address, uint) {
        return (
            "Exercice 8: Payment Management Container",
            address(this),
            address(defaultPayment),
            paymentContracts.length
        );
    }
    
    /**
     * RECEIVE FUNCTION: Forward to default payment contract
     */
    receive() external payable {
        defaultPayment.deposit{value: msg.value}();
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title Payment - Ether Payment Management Contract
 * @dev This contract demonstrates:
 * - Payable functions (can receive Ether)
 * - msg.sender and msg.value global variables
 * - Ether transfer mechanisms
 * - Access control (only recipient can withdraw)
 * - Contract balance management
 * 
 * ETHEREUM PAYMENT CONCEPTS:
 * - msg.sender: address of account that called the function
 * - msg.value: amount of Ether sent with the transaction (in Wei)
 * - payable: keyword allowing function to receive Ether
 * - address.balance: current Ether balance of an address
 * - transfer(): secure way to send Ether (throws on failure)
 */
contract Payment {
    
    // STATE VARIABLES
    address public recipient;  // Address authorized to withdraw funds
    
    // EVENTS - logged on blockchain for external monitoring
    // Events are cheaper than storage and can be monitored by frontends
    event PaymentReceived(address indexed from, uint amount, uint timestamp);
    event WithdrawalMade(address indexed to, uint amount, uint timestamp);
    
    /**
     * @dev Constructor sets the authorized recipient
     * @param _recipient Address that can withdraw funds from this contract
     * 
     * ACCESS CONTROL SETUP:
     * - Only this address can call withdraw()
     * - Typically set to contract deployer or specific business address
     * - Cannot be changed after deployment (immutable)
     * - Critical security parameter
     */
    constructor(address _recipient) {
        // Input validation - ensure recipient is not zero address
        require(_recipient != address(0), "Recipient ne peut pas etre l'adresse zero");
        
        recipient = _recipient;  // Store authorized withdrawal address
        
        // ZERO ADDRESS CHECK:
        // - address(0) = 0x0000...0000 (null address)
        // - Cannot receive Ether or execute transactions
        // - Common mistake in contract setup
        // - Always validate address parameters
    }
    
    /**
     * @dev Receives Ether payments with validation
     * 
     * PAYABLE FUNCTION:
     * - 'payable' keyword allows function to receive Ether
     * - msg.value contains Ether amount sent (in Wei)
     * - msg.sender contains address of sender
     * - Contract balance automatically increases
     */
    function receivePayment() public payable {
        // Validate that actual Ether was sent
        require(msg.value > 0, "Aucun Ether envoye avec la transaction");
        
        // Emit event for external monitoring
        emit PaymentReceived(msg.sender, msg.value, block.timestamp);
        
        // CONTRACT BALANCE UPDATE:
        // - Contract balance increases automatically
        // - No explicit storage needed for balance
        // - address(this).balance gives current contract balance
        // - Ether stored securely in contract until withdrawn
        
        // GLOBAL VARIABLES EXPLAINED:
        // - msg.sender: address calling this function
        // - msg.value: Wei amount sent with transaction
        // - block.timestamp: Unix timestamp of current block
        // - address(this): address of this contract
    }
    
    /**
     * @dev Withdraws all contract funds to recipient
     * 
     * WITHDRAWAL FUNCTION:
     * - Only authorized recipient can call
     * - Transfers entire contract balance
     * - Uses secure transfer method
     * - Validates recipient authorization
     */
    function withdraw() public {
        // ACCESS CONTROL: Only recipient can withdraw
        require(msg.sender == recipient, "Seul le destinataire peut retirer les fonds");
        
        // Get current contract balance
        uint contractBalance = address(this).balance;
        
        // Ensure there are funds to withdraw
        require(contractBalance > 0, "Aucun fonds disponible pour le retrait");
        
        // SECURE TRANSFER PATTERN:
        // - Get balance before transfer (avoid reentrancy)
        // - Use transfer() which limits gas and reverts on failure
        // - payable() cast required for recipient address
        payable(recipient).transfer(contractBalance);
        
        // Emit withdrawal event
        emit WithdrawalMade(recipient, contractBalance, block.timestamp);
        
        // TRANSFER() SECURITY FEATURES:
        // - Automatically limits gas to 2300 (prevents reentrancy)
        // - Reverts transaction if transfer fails
        // - No return value to check (failure = revert)
        // - Recommended for simple Ether transfers
    }
    
    /**
     * @dev Gets current contract balance
     * @return Current Ether balance of the contract (in Wei)
     * 
     * BALANCE QUERY:
     * - View function: doesn't modify state
     * - Returns balance in Wei (smallest Ether unit)
     * - Useful for frontend display
     * - Updates automatically as payments received
     */
    function getContractBalance() public view returns (uint) {
        return address(this).balance;
        
        // BALANCE EXPLANATION:
        // - Every address has a balance property
        // - address(this) refers to this contract's address
        // - Balance includes all Ether sent to contract
        // - Measured in Wei (1 Ether = 10^18 Wei)
    }
    
    /**
     * @dev Gets recipient address
     * @return Address authorized to withdraw funds
     * 
     * RECIPIENT QUERY:
     * - Useful for verification and display
     * - Transparent access control
     * - Cannot be modified after deployment
     */
    function getRecipient() public view returns (address) {
        return recipient;
    }
    
    /**
     * @dev Emergency function to change recipient (if needed)
     * @param newRecipient New address authorized to withdraw
     * 
     * NOTE: This function is commented out for security
     * Uncomment only if you need ability to change recipient
     * Consider multi-signature or timelock for such changes
     */
    /*
    function changeRecipient(address newRecipient) public {
        require(msg.sender == recipient, "Only current recipient can change");
        require(newRecipient != address(0), "New recipient cannot be zero");
        
        address oldRecipient = recipient;
        recipient = newRecipient;
        
        emit RecipientChanged(oldRecipient, newRecipient, block.timestamp);
    }
    */
    
    /**
     * @dev Fallback function to receive Ether
     * 
     * FALLBACK MECHANISM:
     * - Called when Ether sent without function call
     * - receive() is called for plain Ether transfers
     * - Automatically accepts payments
     * - More gas-efficient than receivePayment()
     */
    receive() external payable {
        // Automatically accept Ether transfers
        emit PaymentReceived(msg.sender, msg.value, block.timestamp);
        
        // RECEIVE() FUNCTION:
        // - Special function for receiving Ether
        // - Called when no function specified in transaction
        // - Must be external payable
        // - Should be simple (gas limit considerations)
    }
    
    /**
     * @dev Check if address is the authorized recipient
     * @param addr Address to check
     * @return true if address is authorized recipient
     * 
     * AUTHORIZATION CHECK:
     * - Utility function for access control
     * - Useful for frontend permission display
     * - Pure comparison logic
     */
    function isRecipient(address addr) public view returns (bool) {
        return addr == recipient;
    }
    
    /**
     * @dev Get payment history count (if events are tracked)
     * @return Number of payments received
     * 
     * NOTE: This is a simplified example
     * Real implementation would need event counting mechanism
     * Or maintain counter in storage (costs more gas)
     */
    uint public paymentCount;
    
    /**
     * @dev Modified receivePayment with counter
     * Demonstrates state tracking alongside payments
     */
    function receivePaymentWithCounter() public payable {
        require(msg.value > 0, "Aucun Ether envoye");
        
        paymentCount++;  // Increment payment counter
        
        emit PaymentReceived(msg.sender, msg.value, block.timestamp);
        
        // COUNTER PATTERN:
        // - Tracks number of transactions
        // - Stored permanently on blockchain
        // - Costs additional gas for storage write
        // - Useful for analytics and limits
    }
    
    /**
     * @dev Partial withdrawal function
     * @param amount Amount to withdraw (in Wei)
     * 
     * PARTIAL WITHDRAWAL:
     * - Withdraw specific amount instead of all funds
     * - Useful for controlled fund management
     * - Maintains remaining balance in contract
     */
    function withdrawPartial(uint amount) public {
        require(msg.sender == recipient, "Seul le destinataire peut retirer");
        require(amount > 0, "Montant doit etre superieur a zero");
        require(address(this).balance >= amount, "Fonds insuffisants");
        
        payable(recipient).transfer(amount);
        
        emit WithdrawalMade(recipient, amount, block.timestamp);
        
        // PARTIAL WITHDRAWAL BENEFITS:
        // - Allows gradual fund release
        // - Maintains contract operation with remaining funds
        // - Better cash flow management
        // - Reduces single-point-of-failure risk
    }
}

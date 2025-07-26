// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * EXERCICE 3: STRING MANAGEMENT CONTAINER
 * 
 * This contract demonstrates string operations and contract composition.
 * Contains the GestionChaines contract for better modularity and readability.
 * 
 * SOLIDITY CONCEPTS DEMONSTRATED:
 * - String manipulation and storage
 * - Pure vs View functions
 * - String concatenation and comparison
 * - Contract composition pattern
 * 
 * BLOCKCHAIN CONCEPTS:
 * - State variables stored permanently on blockchain
 * - Gas costs for storage vs computation operations
 * - String encoding in Ethereum (UTF-8 byte arrays)
 */

/**
 * INTERNAL CONTRACT: GestionChaines
 * Handles all string manipulation operations
 * DESIGN PATTERN: Encapsulation - groups related functionality
 */
contract GestionChaines {
    
    // STATE VARIABLE: Stores the main message
    // BLOCKCHAIN CONCEPT: This data is permanently stored on the blockchain
    // VISIBILITY: 'public' automatically creates a getter function
    string public message;
    
    /**
     * CONSTRUCTOR: Initializes the contract with a default message
     * BLOCKCHAIN CONCEPT: Runs only once when contract is deployed
     * GAS COST: High (permanent storage write)
     */
    constructor(string memory _initialMessage) {
        message = _initialMessage;
    }
    
    /**
     * SET MESSAGE FUNCTION
     * Modifies the stored message (state-changing operation)
     * 
     * SOLIDITY CONCEPT: No 'view' or 'pure' modifier - can modify blockchain state
     * GAS COST: High (writes to blockchain storage)
     * TRANSACTION: Requires mining and confirmation
     */
    function setMessage(string memory _message) public {
        message = _message;
    }
    
    /**
     * GET MESSAGE FUNCTION
     * Returns the current message (read-only operation)
     * 
     * SOLIDITY CONCEPT: 'view' means reads state but doesn't modify it
     * GAS COST: Free when called directly (no transaction needed)
     * BLOCKCHAIN: Data read from current blockchain state
     */
    function getMessage() public view returns (string memory) {
        return message;
    }
    
    /**
     * CONCATENATE TWO STRINGS
     * Pure function - doesn't access any state variables
     * 
     * SOLIDITY CONCEPT: 'pure' means no blockchain state interaction
     * GAS COST: Execution cost only (no storage operations)
     * UTILITY: Can be used without deploying contract (stateless)
     */
    function concatener(string memory a, string memory b) public pure returns (string memory) {
        // SOLIDITY STRING OPERATION: string.concat() for joining strings
        // ALTERNATIVE: abi.encodePacked(a, b) but concat is cleaner
        return string.concat(a, b);
    }
    
    /**
     * CONCATENATE WITH STORED MESSAGE
     * Combines the contract's message with a provided string
     * 
     * SOLIDITY CONCEPT: 'view' because it reads 'message' state variable
     * USE CASE: Building dynamic responses with stored context
     */
    function concatenerAvec(string memory autre) public view returns (string memory) {
        return string.concat(message, autre);
    }
    
    /**
     * STRING LENGTH CALCULATION
     * Returns the length of a string in bytes
     * 
     * SOLIDITY CONCEPT: Strings are UTF-8 encoded byte arrays
     * NOTE: Length in bytes may differ from character count for special characters
     * IMPORTANT: Emoji and accented characters count as multiple bytes
     */
    function longueur(string memory s) public pure returns (uint) {
        // SOLIDITY BYTES CONVERSION: Convert string to bytes to get length
        return bytes(s).length;
    }
    
    /**
     * STRING COMPARISON
     * Compares two strings for equality
     * 
     * SOLIDITY LIMITATION: No built-in string comparison operator
     * WORKAROUND: Compare hash values since direct comparison isn't available
     * BLOCKCHAIN CONCEPT: keccak256 is the same hash function used for blockchain
     */
    function comparer(string memory a, string memory b) public pure returns (bool) {
        // SOLIDITY STRING COMPARISON: Compare hash values
        // WHY HASH: Strings are variable-length, hashes are fixed-length (32 bytes)
        // SECURITY: keccak256 is cryptographically secure
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}

/**
 * MAIN EXERCICE 3 CONTRACT
 * Serves as a container and interface for the GestionChaines functionality
 * 
 * DESIGN PATTERN: Facade - provides simplified interface to complex subsystem
 * BLOCKCHAIN BENEFIT: Single contract address for all string operations
 */
contract Exercice3 {
    
    // COMPOSITION PATTERN: Contains an instance of GestionChaines
    // BLOCKCHAIN CONCEPT: This creates a separate contract and stores its address
    GestionChaines public gestionChaines;
    
    // EVENT: Emitted when a new message is set
    // BLOCKCHAIN CONCEPT: Events are logged on blockchain for frontend monitoring
    event MessageChanged(string oldMessage, string newMessage, address changedBy);
    
    /**
     * CONSTRUCTOR: Creates and initializes the internal GestionChaines contract
     * 
     * SOLIDITY CONCEPT: Can instantiate other contracts in constructor
     * BLOCKCHAIN CONCEPT: Two contracts deployed, main contract stores reference
     * GAS COST: Higher (deploys two contracts instead of one)
     */
    constructor(string memory _initialMessage) {
        gestionChaines = new GestionChaines(_initialMessage);
    }
    
    /**
     * PROXY FUNCTIONS: Delegate calls to the internal contract
     * DESIGN PATTERN: Delegation - forwards requests to contained object
     */
    
    /**
     * Set message with event logging
     * ENHANCEMENT: Adds event emission for better frontend integration
     */
    function setMessage(string memory _message) public {
        string memory oldMessage = gestionChaines.getMessage();
        gestionChaines.setMessage(_message);
        
        // BLOCKCHAIN FEATURE: Event for transaction monitoring
        emit MessageChanged(oldMessage, _message, msg.sender);
    }
    
    /**
     * Simple delegation to get message
     */
    function getMessage() public view returns (string memory) {
        return gestionChaines.getMessage();
    }
    
    /**
     * Pure function delegation (or direct implementation)
     * OPTIMIZATION: Pure functions can be implemented directly without delegation
     */
    function concatener(string memory a, string memory b) public pure returns (string memory) {
        return string.concat(a, b);
    }
    
    /**
     * View function delegation
     */
    function concatenerAvec(string memory autre) public view returns (string memory) {
        return gestionChaines.concatenerAvec(autre);
    }
    
    /**
     * Pure function - direct implementation for efficiency
     */
    function longueur(string memory s) public pure returns (uint) {
        return bytes(s).length;
    }
    
    /**
     * Pure function - direct implementation
     */
    function comparer(string memory a, string memory b) public pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
    
    /**
     * UTILITY FUNCTIONS: Additional functionality for better contract management
     */
    
    /**
     * Get the address of the internal GestionChaines contract
     * UTILITY: Useful for debugging and verification
     * TRANSPARENCY: Allows frontend to interact with internal contract directly if needed
     */
    function getGestionChainesAddress() public view returns (address) {
        return address(gestionChaines);
    }
    
    /**
     * Get contract info for debugging
     * DEVELOPMENT HELPER: Provides contract metadata
     */
    function getContractInfo() public view returns (string memory, address, address) {
        return (
            "Exercice 3: String Management Container",
            address(this),           // This contract's address
            address(gestionChaines)  // Internal contract's address
        );
    }
}

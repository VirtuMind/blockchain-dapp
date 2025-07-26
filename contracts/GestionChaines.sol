// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title GestionChaines - String Management Contract
 * @dev This contract demonstrates:
 * - String storage on blockchain
 * - String manipulation in Solidity
 * - State modification vs view functions
 * - Gas costs of string operations
 * 
 * STRINGS IN BLOCKCHAIN:
 * - Strings are expensive to store (each character costs gas)
 * - String operations are computationally expensive
 * - Solidity strings are UTF-8 encoded bytes
 * - Length calculation requires conversion to bytes
 */
contract GestionChaines {
    
    // STATE VARIABLE - stored permanently on blockchain
    // Storing strings is expensive! Each character costs gas
    string public message;
    
    /**
     * @dev Constructor initializes the message state
     * @param _initialMessage Initial message to store on blockchain
     * 
     * STORAGE COST:
     * - Each character in the string costs gas to store
     * - Longer strings = higher deployment cost
     * - This cost is paid once during contract deployment
     */
    constructor(string memory _initialMessage) {
        message = _initialMessage; // Stores string on blockchain permanently
    }
    
    /**
     * @dev Sets a new message (modifies blockchain state)
     * @param _newMessage New message to store
     * 
     * STATE MODIFICATION:
     * - This function changes data stored on blockchain
     * - Costs gas to execute (paid by transaction sender)
     * - Creates a transaction that gets mined into a block
     * - The change is permanent and irreversible
     */
    function setMessage(string memory _newMessage) public {
        message = _newMessage; // Expensive operation! Writes to blockchain storage
        
        // GAS COST FACTORS:
        // - Clearing old data (if new string is shorter)
        // - Writing new data (each 32-byte word costs ~20,000 gas)
        // - Longer strings cost more gas
    }
    
    /**
     * @dev Gets the stored message (reads from blockchain)
     * @return The current message stored in state
     * 
     * VIEW FUNCTION:
     * - Reads from blockchain state without changing it
     * - Free to call from outside blockchain (web3.js calls)
     * - Only costs gas when called from other contracts
     */
    function getMessage() public view returns (string memory) {
        return message; // Reads from blockchain storage
    }
    
    /**
     * @dev Concatenates two strings (pure function)
     * @param a First string
     * @param b Second string  
     * @return Concatenated result
     * 
     * PURE STRING OPERATION:
     * - Doesn't access blockchain state
     * - Works only with function parameters
     * - Uses Solidity's built-in string.concat function
     * - More efficient than state-accessing operations
     */
    function concatener(string memory a, string memory b) public pure returns (string memory) {
        // string.concat is a built-in Solidity function for combining strings
        return string.concat(a, b);
        
        // ALTERNATIVE (older Solidity versions):
        // return string(abi.encodePacked(a, b));
    }
    
    /**
     * @dev Concatenates stored message with input string
     * @param autre String to concatenate with stored message
     * @return Concatenated result
     * 
     * MIXED OPERATION:
     * - Reads from state (message variable)
     * - Performs computation with parameter
     * - Doesn't modify state (view function)
     */
    function concatenerAvec(string memory autre) public view returns (string memory) {
        // Combines blockchain-stored message with function parameter
        return string.concat(message, autre);
    }
    
    /**
     * @dev Calculates length of a string
     * @param s String to measure
     * @return Length in bytes (not characters!)
     * 
     * IMPORTANT: 
     * - Returns byte length, not character count
     * - UTF-8 characters may be multiple bytes
     * - Example: "café" = 5 bytes (é is 2 bytes)
     */
    function longueur(string memory s) public pure returns (uint) {
        // Convert string to bytes to get length
        // bytes(s) converts string to bytes array
        return bytes(s).length;
        
        // WHY BYTES?
        // - Solidity strings are actually bytes arrays
        // - Length operation works on bytes, not characters
        // - This is why special characters may count as multiple units
    }
    
    /**
     * @dev Compares two strings for equality
     * @param a First string
     * @param b Second string
     * @return true if strings are identical, false otherwise
     * 
     * STRING COMPARISON IN SOLIDITY:
     * - No direct == operator for strings
     * - Must compare hash values (keccak256)
     * - Hash comparison is efficient and secure
     */
    function comparer(string memory a, string memory b) public pure returns (bool) {
        // Compare keccak256 hashes of the strings
        // abi.encodePacked converts strings to bytes for hashing
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
        
        // WHY HASH COMPARISON?
        // - Direct string comparison is not supported in Solidity
        // - Hash comparison is computationally efficient
        // - keccak256 is the same hash function used by Ethereum
        // - Very unlikely for different strings to have same hash (collision-resistant)
    }
    
    /**
     * @dev Gets length of stored message
     * @return Length of the stored message in bytes
     * 
     * CONVENIENCE FUNCTION:
     * - Combines state reading with computation
     * - Useful for frontend validation
     * - Shows how to combine multiple concepts
     */
    function longueurMessage() public view returns (uint) {
        return bytes(message).length; // Read state + compute length
    }
    
    /**
     * @dev Checks if stored message is empty
     * @return true if message is empty, false otherwise
     * 
     * UTILITY FUNCTION:
     * - Demonstrates practical use of string operations
     * - Useful for contract logic and frontend validation
     */
    function messageEstVide() public view returns (bool) {
        return bytes(message).length == 0;
    }
}

// SPDX-License-Identifier: MIT
// This tells the compiler this code is under MIT license (required in Solidity)
pragma solidity ^0.8.21; // Specifies Solidity version to use

/**
 * @title Exercice1 - Basic Addition Contract
 * @dev This contract demonstrates:
 * - State variables (stored permanently on blockchain)
 * - View functions (read data without changing state)
 * - Pure functions (don't access state, just compute)
 * 
 * KEY BLOCKCHAIN CONCEPTS:
 * - State variables cost gas to store and modify
 * - View functions are free to call from outside
 * - Pure functions are cheaper than state-accessing functions
 */
contract Exercice1 {
    // STATE VARIABLES - These are stored permanently on the blockchain
    // Every time you deploy this contract, these values are stored forever
    // until the contract is destroyed. Reading them costs gas when done in transactions.
    uint public nombre1; // First number - 'public' automatically creates a getter function
    uint public nombre2; // Second number - uint means unsigned integer (no negative numbers)
    
    /**
     * @dev Constructor - runs only once when contract is deployed to blockchain
     * @param _nombre1 First number to initialize
     * @param _nombre2 Second number to initialize
     * 
     * IMPORTANT: Constructor parameters become part of the deployment transaction
     * The deployer pays gas to store these initial values on blockchain
     */
    constructor(uint _nombre1, uint _nombre2) {
        nombre1 = _nombre1; // Store first number in blockchain state
        nombre2 = _nombre2; // Store second number in blockchain state
        // These assignments cost gas because they write to blockchain storage
    }
    
    /**
     * @dev View function - reads from blockchain state but doesn't modify it
     * @return Sum of the two state variables
     * 
     * VIEW FUNCTIONS:
     * - Can read state variables (nombre1, nombre2)
     * - Cannot modify state variables
     * - Free to call from outside the blockchain (web3.js)
     * - Cost gas only when called from other contracts
     */
    function addition1() public view returns (uint) {
        return nombre1 + nombre2; // Reads from blockchain storage
    }
    
    /**
     * @dev Pure function - doesn't access blockchain state at all
     * @param a First number parameter
     * @param b Second number parameter
     * @return Sum of the two parameters
     * 
     * PURE FUNCTIONS:
     * - Cannot read or write state variables
     * - Only work with parameters and local variables
     * - Most efficient type of function
     * - Completely deterministic (same input = same output)
     */
    function addition2(uint a, uint b) public pure returns (uint) {
        return a + b; // Pure computation, no blockchain access
    }
    
    /**
     * @dev Function to update state variables (costs gas!)
     * @param _nombre1 New value for first number
     * @param _nombre2 New value for second number
     * 
     * This function demonstrates state modification:
     * - Changes stored data on blockchain
     * - Costs gas to execute
     * - Creates a transaction that gets mined into a block
     */
    function updateNumbers(uint _nombre1, uint _nombre2) public {
        nombre1 = _nombre1; // Writes to blockchain storage (expensive!)
        nombre2 = _nombre2; // Writes to blockchain storage (expensive!)
        // Each storage write costs ~20,000 gas
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title Exercice6 - Array Operations and Sum Calculation
 * @dev This contract demonstrates:
 * - Dynamic arrays in blockchain storage
 * - Array manipulation functions  
 * - Error handling with require()
 * - Gas implications of array operations
 * - State persistence across function calls
 * 
 * ARRAYS IN SOLIDITY:
 * - Storage arrays persist between function calls
 * - Each element modification costs gas  
 * - Dynamic arrays can grow/shrink
 * - Array access can fail (out of bounds)
 */
contract Exercice6 {
    
    // STORAGE ARRAY - persisted on blockchain
    // Each number stored here costs gas and remains forever
    // Dynamic array: size can change during contract execution
    uint[] public nombres;
    
    /**
     * @dev Constructor initializes the array with starting values
     * @param _initialNumbers Array of numbers to initialize with
     * 
     * CONSTRUCTOR STORAGE:
     * - Runs once during contract deployment
     * - Initial array storage costs are paid by deployer
     * - These values become permanent part of blockchain state
     */
    constructor(uint[] memory _initialNumbers) {
        // Copy all initial numbers to storage array
        for (uint i = 0; i < _initialNumbers.length; i++) {
            nombres.push(_initialNumbers[i]);  // Each push costs ~20,000+ gas
        }
        
        // ALTERNATIVE (more gas efficient):
        // nombres = _initialNumbers; 
        // But this would copy entire array at once
    }
    
    /**
     * @dev Adds a number to the array (modifies blockchain state)
     * @param nombre The number to add to the array
     * 
     * STATE MODIFICATION:
     * - Increases array size by 1
     * - Stores new number permanently on blockchain
     * - Costs gas: ~20,000 for storage + computation costs
     * - Creates transaction that gets mined into block
     */
    function ajouterNombre(uint nombre) public {
        nombres.push(nombre);  // Add to end of array
        
        // WHAT HAPPENS:
        // 1. Array length increases by 1
        // 2. New storage slot allocated for the number  
        // 3. Number stored in blockchain permanently
        // 4. Gas consumed from caller's account
        // 5. Transaction recorded in blockchain
    }
    
    /**
     * @dev Gets element at specific index with bounds checking
     * @param index The index to retrieve (0-based)
     * @return The number at the specified index
     * 
     * BOUNDS CHECKING:
     * - require() validates input before execution
     * - Prevents array access errors
     * - Returns descriptive error message if validation fails
     * - Transaction reverts (no gas consumed) if require fails
     */
    function getElement(uint index) public view returns (uint) {
        // Input validation - critical for array access!
        require(index < nombres.length, "Index n'existe pas dans le tableau");
        
        return nombres[index];  // Safe array access
        
        // REQUIRE FUNCTION:
        // - First parameter: condition that must be true
        // - Second parameter: error message if condition fails
        // - If condition is false, transaction reverts immediately
        // - Used for input validation and security checks
    }
    
    /**
     * @dev Returns the complete array
     * @return The entire array of numbers
     * 
     * ARRAY RETURN:
     * - Returns copy of storage array to caller
     * - Useful for frontend display
     * - Gas cost increases with array size
     * - Consider pagination for very large arrays
     */
    function afficheTableau() public view returns (uint[] memory) {
        return nombres;  // Returns copy of storage array
        
        // MEMORY vs STORAGE:
        // - This returns memory copy (temporary)
        // - Original storage array unchanged
        // - Caller receives snapshot of current state
    }
    
    /**
     * @dev Calculates sum of all numbers in array
     * @return sum Total of all numbers in the array
     * 
     * COMPUTATIONAL FUNCTION:
     * - Loops through entire array
     * - Gas cost increases with array size
     * - View function: doesn't modify state
     * - Demonstrates mathematical operations on arrays
     */
    function calculerSomme() public view returns (uint sum) {
        sum = 0;  // Initialize accumulator
        
        // Loop through all elements and add them
        for (uint i = 0; i < nombres.length; i++) {
            sum += nombres[i];  // Add each element to sum
            
            // OVERFLOW PROTECTION:
            // Solidity 0.8+ has automatic overflow protection
            // If sum exceeds uint256 max, transaction will revert
            // This prevents integer overflow vulnerabilities
        }
        
        // ALGORITHM COMPLEXITY:
        // - Time: O(n) where n is array length  
        // - Gas: O(n) - each array read costs gas
        // - Space: O(1) - only uses sum variable
    }
    
    /**
     * @dev Gets current array length
     * @return Length of the numbers array
     * 
     * ARRAY PROPERTIES:
     * - .length gives current number of elements
     * - Useful for bounds checking in frontend
     * - Changes when elements are added/removed
     */
    function getTailleTableau() public view returns (uint) {
        return nombres.length;
    }
    
    /**
     * @dev Removes last element from array (if exists)
     * 
     * ARRAY MODIFICATION:
     * - Reduces array size by 1
     * - Frees storage (gas refund possible)
     * - Fails safely if array is empty
     * - Modifies blockchain state
     */
    function supprimerDernier() public {
        require(nombres.length > 0, "Tableau vide, impossible de supprimer");
        
        nombres.pop();  // Remove last element
        
        // GAS REFUND:
        // - Freeing storage can provide gas refund
        // - Refund is partial, not full storage cost
        // - Makes array shrinking somewhat cheaper
    }
    
    /**
     * @dev Clears entire array
     * 
     * BULK MODIFICATION:
     * - Removes all elements at once
     * - Resets array length to 0
     * - May provide gas refunds for freed storage
     * - More efficient than removing elements one by one
     */
    function viderTableau() public {
        delete nombres;  // Clear entire array
        
        // DELETE KEYWORD:
        // - Resets variable to default value
        // - For arrays: sets length to 0
        // - For numbers: sets to 0
        // - For strings: sets to empty string
        // - Can provide gas refunds
    }
    
    /**
     * @dev Finds maximum value in array
     * @return max Largest number in the array
     * 
     * SEARCH ALGORITHM:
     * - Linear search through array
     * - Keeps track of largest value seen
     * - Handles empty array case
     * - Demonstrates comparison operations
     */
    function trouverMaximum() public view returns (uint max) {
        require(nombres.length > 0, "Tableau vide");
        
        max = nombres[0];  // Start with first element
        
        // Compare with all other elements
        for (uint i = 1; i < nombres.length; i++) {
            if (nombres[i] > max) {
                max = nombres[i];  // Update max if larger found
            }
        }
        
        // ALGORITHM PROPERTIES:
        // - Single pass through array
        // - O(n) time complexity
        // - O(1) space complexity
        // - Works for any array size > 0
    }
    
    /**
     * @dev Calculates average of all numbers
     * @return Average value (rounded down due to integer division)
     * 
     * MATHEMATICAL COMPUTATION:
     * - Sum all elements then divide by count
     * - Integer division truncates decimals
     * - Example: [1,2,2] average = 5/3 = 1 (not 1.67)
     * - For precise decimals, consider fixed-point arithmetic
     */
    function calculerMoyenne() public view returns (uint) {
        require(nombres.length > 0, "Tableau vide");
        
        uint sum = calculerSomme();  // Reuse existing function
        return sum / nombres.length;  // Integer division
        
        // INTEGER DIVISION LIMITATION:
        // - 5 / 3 = 1 (not 1.666...)
        // - Lost precision with fractional results
        // - Consider returning scaled integers for precision
        // - Example: return (sum * 100) / length for 2 decimal places
    }
    
    /**
     * @dev Checks if array contains specific number
     * @param nombre Number to search for
     * @return true if number found, false otherwise
     * 
     * SEARCH FUNCTION:
     * - Linear search through array
     * - Returns as soon as match found (early termination)
     * - Efficient for finding common elements
     * - Less efficient for rare/missing elements
     */
    function contient(uint nombre) public view returns (bool) {
        for (uint i = 0; i < nombres.length; i++) {
            if (nombres[i] == nombre) {
                return true;  // Found it! Early return
            }
        }
        return false;  // Not found after checking all elements
        
        // EARLY TERMINATION:
        // - Saves gas when element found early
        // - Best case: O(1) if first element matches
        // - Worst case: O(n) if element not present
        // - Average case: O(n/2) for uniformly distributed data
    }
}

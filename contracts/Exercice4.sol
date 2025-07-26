// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title Exercice4 - Positive Number Verification
 * @dev This contract demonstrates:
 * - Signed vs unsigned integers in Solidity
 * - Boolean logic in smart contracts
 * - Pure functions for mathematical checks
 * - Integer types and their ranges
 * 
 * INTEGER TYPES IN SOLIDITY:
 * - uint: Unsigned integer (0 to 2^256-1) - cannot be negative
 * - int: Signed integer (-2^255 to 2^255-1) - can be negative
 * - For checking "positive", we need signed integers (int)
 */
contract Exercice4 {
    
    /**
     * @dev Checks if a signed integer is positive
     * @param nombre The number to check (can be negative, zero, or positive)
     * @return true if number > 0, false otherwise
     * 
     * MATHEMATICAL LOGIC:
     * - Positive: number > 0
     * - Zero: number == 0 (not positive)
     * - Negative: number < 0 (not positive)
     * 
     * PURE FUNCTION:
     * - No blockchain state access needed
     * - Deterministic: same input always gives same output
     * - Efficient: no storage reads/writes
     */
    function estPositif(int nombre) public pure returns (bool) {
        return nombre > 0;
        
        // SOLIDITY COMPARISON:
        // > : greater than
        // >= : greater than or equal
        // < : less than  
        // <= : less than or equal
        // == : equal to
        // != : not equal to
    }
    
    /**
     * @dev Checks if a number is negative
     * @param nombre The number to check
     * @return true if number < 0, false otherwise
     * 
     * COMPLEMENTARY FUNCTION:
     * - Opposite logic of estPositif
     * - Useful for complete number classification
     */
    function estNegatif(int nombre) public pure returns (bool) {
        return nombre < 0;
    }
    
    /**
     * @dev Checks if a number is zero
     * @param nombre The number to check
     * @return true if number == 0, false otherwise
     * 
     * ZERO CHECK:
     * - Important edge case in many algorithms
     * - Neither positive nor negative
     */
    function estZero(int nombre) public pure returns (bool) {
        return nombre == 0;
    }
    
    /**
     * @dev Comprehensive number classification
     * @param nombre The number to classify
     * @return positive True if > 0
     * @return zero True if == 0  
     * @return negative True if < 0
     * 
     * MULTIPLE RETURN VALUES:
     * - Solidity functions can return multiple values
     * - Useful for comprehensive analysis
     * - Frontend can destructure the results
     */
    function classifierNombre(int nombre) public pure returns (
        bool positive, 
        bool zero, 
        bool negative
    ) {
        positive = nombre > 0;
        zero = nombre == 0;
        negative = nombre < 0;
        
        // NOTE: Exactly one of these will be true for any input
        // This is a mutually exclusive classification
    }
    
    /**
     * @dev Gets the absolute value of a number
     * @param nombre The number to get absolute value of
     * @return The absolute value (always non-negative)
     * 
     * ABSOLUTE VALUE:
     * - Converts negative numbers to positive
     * - Keeps positive numbers unchanged
     * - Zero remains zero
     * - Useful for distance calculations, magnitude comparisons
     */
    function valeurAbsolue(int nombre) public pure returns (int) {
        if (nombre < 0) {
            return -nombre; // Convert negative to positive
        }
        return nombre; // Keep positive/zero unchanged
        
        // ALTERNATIVE SYNTAX:
        // return nombre >= 0 ? nombre : -nombre;
        // This is a ternary operator (condition ? valueIfTrue : valueIfFalse)
    }
    
    /**
     * @dev Checks if number is within a positive range
     * @param nombre The number to check
     * @param min Minimum value (must be positive)
     * @param max Maximum value (must be positive)
     * @return true if min <= nombre <= max and all values are positive
     * 
     * RANGE VALIDATION:
     * - Common pattern in smart contracts
     * - Useful for input validation
     * - Demonstrates compound boolean logic
     */
    function estDansIntervalePositif(int nombre, int min, int max) public pure returns (bool) {
        // All three conditions must be true:
        // 1. Number is positive
        // 2. Number is >= minimum
        // 3. Number is <= maximum
        return estPositif(nombre) && estPositif(min) && estPositif(max) && 
               nombre >= min && nombre <= max;
        
        // BOOLEAN OPERATORS:
        // && : logical AND (all conditions must be true)
        // || : logical OR (at least one condition must be true)  
        // ! : logical NOT (negates the boolean value)
    }
    
    /**
     * @dev Counts positive numbers in an array
     * @param nombres Array of numbers to analyze
     * @return count Number of positive values in the array
     * 
     * ARRAY PROCESSING:
     * - Demonstrates loops in Solidity
     * - Shows how to process multiple values
     * - Memory arrays are used for function parameters
     */
    function compterPositifs(int[] memory nombres) public pure returns (uint count) {
        // Initialize counter to 0 (default value)
        count = 0;
        
        // Loop through all numbers in the array
        for (uint i = 0; i < nombres.length; i++) {
            if (estPositif(nombres[i])) {
                count++; // Increment counter for each positive number
            }
        }
        
        // SOLIDITY LOOPS:
        // for: traditional for loop (most common)
        // while: condition-based loop  
        // do-while: execute at least once, then check condition
        
        // GAS CONSIDERATION:
        // Loops cost gas for each iteration
        // Large arrays can make transactions expensive
        // Consider gas limits when processing arrays
    }
}

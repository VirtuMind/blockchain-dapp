// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title Exercice5 - Number Parity Verification  
 * @dev This contract demonstrates:
 * - Modulo operation in Solidity
 * - Even/odd number detection
 * - Mathematical operations in smart contracts
 * - Pure functions for number analysis
 * 
 * PARITY CONCEPT:
 * - Even numbers: divisible by 2 (remainder 0 when divided by 2)
 * - Odd numbers: not divisible by 2 (remainder 1 when divided by 2)
 * - Modulo operator (%) gives remainder of division
 * - Examples: 4 % 2 = 0 (even), 5 % 2 = 1 (odd)
 */
contract Exercice5 {
    
    /**
     * @dev Checks if a number is even
     * @param nombre The number to check for parity
     * @return true if number is even, false if odd
     * 
     * EVEN NUMBER LOGIC:
     * - A number is even if it's divisible by 2
     * - Mathematically: nombre % 2 == 0
     * - Works for positive, negative, and zero
     * 
     * EXAMPLES:
     * - estPair(4) returns true (4 % 2 = 0)
     * - estPair(5) returns false (5 % 2 = 1)
     * - estPair(0) returns true (0 % 2 = 0)
     * - estPair(-2) returns true (-2 % 2 = 0)
     */
    function estPair(int nombre) public pure returns (bool) {
        return nombre % 2 == 0;
        
        // MODULO OPERATOR (%):
        // - Returns remainder after division
        // - nombre % 2 gives 0 for even, 1 for odd
        // - Works with negative numbers too
        // - Essential for parity checking
    }
    
    /**
     * @dev Checks if a number is odd
     * @param nombre The number to check for parity
     * @return true if number is odd, false if even
     * 
     * ODD NUMBER LOGIC:
     * - A number is odd if it's NOT divisible by 2
     * - Mathematically: nombre % 2 != 0
     * - Complement of even number check
     */
    function estImpair(int nombre) public pure returns (bool) {
        return nombre % 2 != 0;
        
        // ALTERNATIVE IMPLEMENTATION:
        // return !estPair(nombre);
        // This would use the NOT operator on estPair result
    }
    
    /**
     * @dev Gets the parity of a number as a string
     * @param nombre The number to analyze
     * @return "pair" if even, "impair" if odd
     * 
     * STRING RETURN:
     * - Useful for user interfaces
     * - Demonstrates conditional string returns
     * - Uses Solidity's ternary operator
     */
    function obtenirParite(int nombre) public pure returns (string memory) {
        // Ternary operator: condition ? valueIfTrue : valueIfFalse
        return estPair(nombre) ? "pair" : "impair";
        
        // EQUIVALENT IF-ELSE:
        // if (estPair(nombre)) {
        //     return "pair";
        // } else {
        //     return "impair";
        // }
    }
    
    /**
     * @dev Counts even and odd numbers in an array
     * @param nombres Array of numbers to analyze
     * @return nombresPairs Count of even numbers
     * @return nombresImpairs Count of odd numbers
     * 
     * ARRAY ANALYSIS:
     * - Processes multiple numbers at once
     * - Returns structured data (multiple values)
     * - Demonstrates loop usage in smart contracts
     */
    function compterParite(int[] memory nombres) public pure returns (
        uint nombresPairs,
        uint nombresImpairs
    ) {
        // Initialize counters
        nombresPairs = 0;
        nombresImpairs = 0;
        
        // Loop through array and count each type
        for (uint i = 0; i < nombres.length; i++) {
            if (estPair(nombres[i])) {
                nombresPairs++;
            } else {
                nombresImpairs++;
            }
        }
        
        // VERIFICATION: nombresPairs + nombresImpairs should equal nombres.length
    }
    
    /**
     * @dev Filters array to return only even numbers
     * @param nombres Input array of numbers
     * @return evenNumbers Array containing only even numbers from input
     * 
     * DYNAMIC ARRAY CREATION:
     * - Creates new array in memory
     * - Filters based on condition
     * - Demonstrates dynamic memory allocation
     * 
     * GAS WARNING: 
     * - This function can be expensive for large arrays
     * - Consider gas limits when calling with big datasets
     */
    function filtrerPairs(int[] memory nombres) public pure returns (int[] memory evenNumbers) {
        // First, count how many even numbers we have
        uint count = 0;
        for (uint i = 0; i < nombres.length; i++) {
            if (estPair(nombres[i])) {
                count++;
            }
        }
        
        // Create new array with exact size needed
        evenNumbers = new int[](count);
        
        // Fill the new array with even numbers
        uint index = 0;
        for (uint i = 0; i < nombres.length; i++) {
            if (estPair(nombres[i])) {
                evenNumbers[index] = nombres[i];
                index++;
            }
        }
        
        // SOLIDITY MEMORY ARRAYS:
        // - new int[](size) creates dynamic array in memory
        // - Memory arrays have fixed size once created
        // - More efficient than storage arrays for temporary data
    }
    
    /**
     * @dev Filters array to return only odd numbers
     * @param nombres Input array of numbers
     * @return oddNumbers Array containing only odd numbers from input
     * 
     * COMPLEMENTARY FILTER:
     * - Opposite of filtrerPairs
     * - Same logic but different condition
     * - Together they can split an array by parity
     */
    function filtrerImpairs(int[] memory nombres) public pure returns (int[] memory oddNumbers) {
        // Count odd numbers
        uint count = 0;
        for (uint i = 0; i < nombres.length; i++) {
            if (estImpair(nombres[i])) {
                count++;
            }
        }
        
        // Create and fill array with odd numbers
        oddNumbers = new int[](count);
        uint index = 0;
        for (uint i = 0; i < nombres.length; i++) {
            if (estImpair(nombres[i])) {
                oddNumbers[index] = nombres[i];
                index++;
            }
        }
    }
    
    /**
     * @dev Checks if all numbers in array have same parity
     * @param nombres Array to check
     * @return true if all even or all odd, false if mixed
     * 
     * UNIFORMITY CHECK:
     * - Useful for data validation
     * - Demonstrates early return optimization
     * - Shows efficient array processing
     */
    function tousMemeParite(int[] memory nombres) public pure returns (bool) {
        if (nombres.length == 0) {
            return true; // Empty array is considered uniform
        }
        
        // Check parity of first element
        bool firstParity = estPair(nombres[0]);
        
        // Compare all other elements to first
        for (uint i = 1; i < nombres.length; i++) {
            if (estPair(nombres[i]) != firstParity) {
                return false; // Found different parity, not uniform
            }
        }
        
        return true; // All elements have same parity
        
        // OPTIMIZATION:
        // - Early return saves gas when arrays are not uniform
        // - Only checks as many elements as needed
        // - Efficient for large arrays with mixed parity
    }
}

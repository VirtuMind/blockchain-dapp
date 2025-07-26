// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title Exercice2 - Cryptocurrency Converter
 * @dev This contract demonstrates:
 * - Pure functions (no state needed)
 * - Ethereum units (ether, wei)
 * - Mathematical operations in blockchain
 * 
 * ETHEREUM UNITS EXPLAINED:
 * - Wei: Smallest unit of Ether (like cents to dollars)
 * - 1 Ether = 1,000,000,000,000,000,000 Wei (10^18)
 * - Gas prices are measured in Wei
 * - All blockchain calculations use Wei internally
 */
contract Exercice2 {
    
    /**
     * @dev Converts Ether to Wei
     * @param montantEther Amount in Ether to convert
     * @return Amount in Wei
     * 
     * WHY THIS MATTERS:
     * - Smart contracts store values in Wei (smallest unit)
     * - User interfaces show Ether (human-readable)
     * - This conversion is essential for any payment functionality
     * 
     * EXAMPLE: 1 ETH input returns 1000000000000000000 Wei
     */
    function etherEnWei(uint montantEther) public pure returns (uint) {
        // '1 ether' is a Solidity keyword = 10^18 wei
        // This multiplication converts ether amount to wei
        return montantEther * 1 ether;
        
        // TECHNICAL NOTE: 
        // Solidity has built-in units: wei, gwei, ether
        // 1 ether = 1e18 wei = 1000000000000000000 wei
    }
    
    /**
     * @dev Converts Wei to Ether  
     * @param montantWei Amount in Wei to convert
     * @return Amount in Ether
     * 
     * INVERSE OPERATION:
     * - Takes Wei (blockchain internal format)
     * - Returns Ether (human-readable format)
     * - Essential for displaying balances to users
     */
    function weiEnEther(uint montantWei) public pure returns (uint) {
        // Division by 1 ether (10^18) converts wei back to ether
        return montantWei / 1 ether;
        
        // WARNING: Integer division in Solidity truncates decimals
        // Example: 1.5 ETH becomes 1 ETH after this conversion
        // For precise decimals, you'd need to use different approaches
    }
    
    /**
     * @dev Get conversion rate information
     * @return weiPerEther The number of Wei in one Ether
     * 
     * UTILITY FUNCTION:
     * - Helps frontend understand the conversion rate
     * - Useful for validation and display purposes
     */
    function getConversionRate() public pure returns (uint weiPerEther) {
        return 1 ether; // Returns 1000000000000000000
    }
    
    /**
     * @dev Convert with precision handling (advanced example)
     * @param montantWei Amount in Wei
     * @param decimals Number of decimal places to preserve
     * @return Ether amount with specified decimal precision
     * 
     * ADVANCED CONCEPT:
     * - Shows how to handle decimal precision in Solidity
     * - Important for financial applications
     * - Demonstrates mathematical operations in smart contracts
     */
    function weiEnEtherAvecPrecision(uint montantWei, uint decimals) public pure returns (uint) {
        require(decimals <= 18, "Maximum 18 decimal places supported");
        
        uint divisor = 10 ** (18 - decimals); // Calculate precision divisor
        return montantWei / divisor; // Return with specified precision
        
        // EXAMPLE: For 2 decimal places (like dollars.cents)
        // divisor = 10^16, so Wei gets converted to centi-Ether
    }
}

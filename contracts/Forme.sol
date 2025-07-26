// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title Forme - Abstract Geometric Shape Contract
 * @dev This abstract contract demonstrates:
 * - Abstract contracts (cannot be deployed directly)
 * - Virtual functions (can be overridden)
 * - Pure virtual functions (must be implemented by child)
 * - Inheritance concepts in Solidity
 * - Coordinate system management
 * 
 * ABSTRACT CONTRACTS:
 * - Cannot be instantiated/deployed directly
 * - Serve as base class for other contracts
 * - Can contain implemented and unimplemented functions
 * - Used for defining common interface/behavior
 * - Similar to abstract classes in OOP languages
 */
abstract contract Forme {
    
    // STATE VARIABLES - inherited by all child contracts
    // Public variables automatically get getter functions
    uint public x;  // X coordinate of the shape
    uint public y;  // Y coordinate of the shape
    
    /**
     * @dev Constructor for abstract contract
     * @param _x Initial X coordinate
     * @param _y Initial Y coordinate
     * 
     * ABSTRACT CONSTRUCTOR:
     * - Called when child contracts are deployed
     * - Initializes common state variables
     * - Cannot be called directly (contract is abstract)
     * - Child constructors must call this via super or direct initialization
     */
    constructor(uint _x, uint _y) {
        x = _x;  // Store X coordinate on blockchain
        y = _y;  // Store Y coordinate on blockchain
        
        // COORDINATE SYSTEM:
        // - (0,0) represents origin point
        // - X increases rightward
        // - Y increases upward (mathematical convention)
        // - Using uint means coordinates cannot be negative
    }
    
    /**
     * @dev Moves the shape to new coordinates
     * @param dx Change in X coordinate
     * @param dy Change in Y coordinate
     * 
     * MOVEMENT FUNCTION:
     * - Modifies shape position on blockchain
     * - Costs gas to execute (state modification)
     * - Available to all child contracts
     * - Can be overridden if custom movement logic needed
     */
    function deplacerForme(uint dx, uint dy) public virtual {
        x = dx;  // Set new X position
        y = dy;  // Set new Y position
        
        // VIRTUAL KEYWORD:
        // - Allows child contracts to override this function
        // - Child can provide custom movement behavior
        // - If not overridden, this implementation is used
        // - Enables polymorphism in smart contracts
    }
    
    /**
     * @dev Returns current coordinates of the shape
     * @return currentX Current X coordinate
     * @return currentY Current Y coordinate
     * 
     * COORDINATE GETTER:
     * - View function: doesn't modify state
     * - Returns multiple values
     * - Useful for position tracking
     * - Can be overridden for custom coordinate systems
     */
    function afficheXY() public view virtual returns (uint currentX, uint currentY) {
        currentX = x;
        currentY = y;
        
        // MULTIPLE RETURN VALUES:
        // - Solidity supports returning multiple values
        // - Can be destructured in calling code
        // - Useful for related data that belongs together
        // - More efficient than separate function calls
    }
    
    /**
     * @dev Pure virtual function - must be implemented by children
     * @return Information message about the shape
     * 
     * PURE VIRTUAL FUNCTION:
     * - No implementation in abstract contract
     * - Must be implemented by every child contract
     * - Enforces consistent interface across all shapes
     * - Enables polymorphic behavior
     */
    function afficheInfos() public pure virtual returns (string memory);
    
    /**
     * @dev Virtual function to calculate shape's surface area
     * @return Surface area of the shape
     * 
     * AREA CALCULATION:
     * - Abstract definition: no implementation here
     * - Each shape type implements its own area formula
     * - Virtual allows optional override
     * - Returns 0 by default if not overridden
     */
    function surface() public view virtual returns (uint) {
        return 0;  // Default implementation returns 0
        
        // WHY DEFAULT IMPLEMENTATION?
        // - Some shapes might not have meaningful area
        // - Provides fallback behavior
        // - Child contracts can override with proper calculation
    }
    
    /**
     * @dev Calculates distance from origin (0,0)
     * @return Distance from origin to shape's position
     * 
     * DISTANCE CALCULATION:
     * - Uses Pythagorean theorem: sqrt(x² + y²)
     * - Solidity doesn't have built-in sqrt, so we approximate
     * - Useful for positioning and collision detection
     * - Available to all child contracts
     */
    function distanceOrigine() public view returns (uint) {
        // Simplified distance calculation (x² + y²)
        // Real distance would need square root, which is expensive in Solidity
        return x * x + y * y;
        
        // MATHEMATICAL LIMITATION:
        // - No native square root in Solidity
        // - Real distance = sqrt(x² + y²)
        // - Returning squared distance for efficiency
        // - Still useful for distance comparisons
    }
    
    /**
     * @dev Checks if shape is at origin
     * @return true if shape is at coordinates (0,0)
     * 
     * POSITION CHECK:
     * - Simple boolean logic
     * - Useful for game logic, collision detection
     * - Demonstrates coordinate comparison
     */
    function estAOrigine() public view returns (bool) {
        return x == 0 && y == 0;
        
        // BOOLEAN LOGIC:
        // - Both conditions must be true (AND operator)
        // - Returns false if either coordinate is non-zero
        // - Efficient comparison operation
    }
}

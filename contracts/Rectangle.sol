// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

// Import the abstract Forme contract
import "./Forme.sol";

/**
 * @title Rectangle - Concrete Rectangle Implementation
 * @dev This contract demonstrates:
 * - Contract inheritance in Solidity
 * - Implementation of abstract functions
 * - Function overriding with 'override' keyword
 * - Additional state variables in child contracts
 * - Geometric calculations in smart contracts
 * 
 * INHERITANCE CONCEPTS:
 * - Rectangle inherits all functions and variables from Forme
 * - Must implement all pure virtual functions from parent
 * - Can override virtual functions to provide custom behavior
 * - Adds its own specific functionality (length, width)
 */
contract Rectangle is Forme {
    
    // ADDITIONAL STATE VARIABLES - specific to Rectangle
    // These are added to the inherited x, y coordinates
    uint public lo;  // Longueur (length) of the rectangle
    uint public la;  // Largeur (width) of the rectangle
    
    /**
     * @dev Constructor for Rectangle contract
     * @param _x X coordinate of rectangle position
     * @param _y Y coordinate of rectangle position  
     * @param _longueur Length of the rectangle
     * @param _largeur Width of the rectangle
     * 
     * CONSTRUCTOR INHERITANCE:
     * - Must call parent constructor using Forme(_x, _y)
     * - Initializes both parent and child state variables
     * - All initialization happens in single deployment transaction
     */
    constructor(uint _x, uint _y, uint _longueur, uint _largeur) 
        Forme(_x, _y)  // Call parent constructor first
    {
        lo = _longueur;  // Store rectangle length
        la = _largeur;   // Store rectangle width
        
        // INITIALIZATION ORDER:
        // 1. Parent constructor (Forme) sets x, y
        // 2. Child constructor (Rectangle) sets lo, la
        // 3. Contract is ready for use with all state initialized
    }
    
    /**
     * @dev Implements the pure virtual function from Forme
     * @return Information string identifying this as a Rectangle
     * 
     * PURE VIRTUAL IMPLEMENTATION:
     * - Required: parent declared this as pure virtual
     * - Must use 'override' keyword to indicate overriding
     * - Provides Rectangle-specific implementation
     * - No state access needed (pure function)
     */
    function afficheInfos() public pure override returns (string memory) {
        return "Je suis Rectangle";
        
        // OVERRIDE KEYWORD:
        // - Required when overriding virtual functions
        // - Tells compiler this replaces parent implementation
        // - Compile error if parent function isn't virtual
        // - Ensures intentional overriding (prevents accidents)
    }
    
    /**
     * @dev Implements surface area calculation for rectangle
     * @return Area of rectangle (length × width)
     * 
     * GEOMETRIC CALCULATION:
     * - Overrides parent's default implementation (returned 0)
     * - Uses rectangle-specific formula: length × width
     * - Accesses child contract's state variables (lo, la)
     * - View function: reads state but doesn't modify
     */
    function surface() public view override returns (uint) {
        return lo * la;  // Rectangle area formula
        
        // MATHEMATICAL PROPERTIES:
        // - Area is always non-negative (uint values)
        // - Zero area possible if either dimension is 0
        // - Multiplication in Solidity is safe from overflow in 0.8+
        // - Result represents area in square units
    }
    
    /**
     * @dev Returns rectangle dimensions
     * @return longueur The length of the rectangle
     * @return largeur The width of the rectangle
     * 
     * DIMENSION GETTER:
     * - Rectangle-specific function (not in parent)
     * - Returns both dimensions in one call
     * - Useful for displaying shape properties
     * - View function: no state modification
     */
    function afficheLoLa() public view returns (uint longueur, uint largeur) {
        longueur = lo;
        largeur = la;
        
        // RECTANGLE-SPECIFIC FUNCTIONALITY:
        // - This function doesn't exist in parent Forme
        // - Shows how child contracts can add new capabilities
        // - Provides access to rectangle-specific properties
    }
    
    /**
     * @dev Calculates rectangle perimeter
     * @return Perimeter of rectangle (2 × length + 2 × width)
     * 
     * ADDITIONAL GEOMETRIC FUNCTION:
     * - Not required by parent contract
     * - Demonstrates extending functionality in child
     * - Uses standard perimeter formula for rectangles
     */
    function perimetre() public view returns (uint) {
        return 2 * (lo + la);  // Perimeter formula: 2(l + w)
        
        // PERIMETER CALCULATION:
        // - Sum of all four sides
        // - 2 sides of length 'lo', 2 sides of length 'la'
        // - Formula: 2 × (length + width)
        // - Useful for material estimation, boundary calculations
    }
    
    /**
     * @dev Checks if rectangle is a square
     * @return true if length equals width, false otherwise
     * 
     * SHAPE CLASSIFICATION:
     * - Square is special case of rectangle
     * - Length equals width for squares
     * - Useful for geometric categorization
     * - Boolean logic for classification
     */
    function estCarre() public view returns (bool) {
        return lo == la;  // Square when length == width
        
        // SPECIAL CASE DETECTION:
        // - Square: all sides equal (lo == la)
        // - Rectangle: opposite sides equal (lo ≠ la)
        // - Useful for applying different rules/calculations
    }
    
    /**
     * @dev Resizes the rectangle
     * @param nouvelleLongueur New length for the rectangle
     * @param nouvelleLargeur New width for the rectangle
     * 
     * SHAPE MODIFICATION:
     * - Changes rectangle dimensions
     * - Modifies blockchain state (costs gas)
     * - Demonstrates mutable geometry
     * - Could add validation (minimum sizes, etc.)
     */
    function redimensionner(uint nouvelleLongueur, uint nouvelleLargeur) public {
        lo = nouvelleLongueur;  // Update length
        la = nouvelleLargeur;   // Update width
        
        // STATE MODIFICATION:
        // - Both assignments cost gas
        // - New dimensions stored permanently
        // - Shape properties (area, perimeter) automatically change
        // - No validation here - could add minimum size requirements
    }
    
    /**
     * @dev Scales rectangle by a factor
     * @param facteur Scaling factor (1 = same size, 2 = double, etc.)
     * 
     * PROPORTIONAL SCALING:
     * - Multiplies both dimensions by same factor
     * - Maintains rectangle proportions
     * - Factor of 1 = no change, 2 = double size, etc.
     * - Could add bounds checking for reasonable factors
     */
    function mettreAEchelle(uint facteur) public {
        lo = lo * facteur;  // Scale length
        la = la * facteur;  // Scale width
        
        // SCALING CONSIDERATIONS:
        // - Factor 0 creates degenerate rectangle (area = 0)
        // - Large factors could cause overflow (but Solidity 0.8+ protects)
        // - Maintains aspect ratio (length/width ratio unchanged)
        // - Useful for zoom, resize operations
    }
    
    /**
     * @dev Calculates diagonal length (squared for efficiency)
     * @return Squared length of rectangle diagonal
     * 
     * DIAGONAL CALCULATION:
     * - Uses Pythagorean theorem: diagonal² = length² + width²
     * - Returns squared value (no expensive square root)
     * - Still useful for diagonal comparisons
     * - Demonstrates geometric calculations in smart contracts
     */
    function diagonaleCarree() public view returns (uint) {
        return lo * lo + la * la;  // d² = l² + w²
        
        // PYTHAGOREAN THEOREM:
        // - For rectangle with sides l and w
        // - Diagonal d satisfies: d² = l² + w²
        // - Real diagonal = sqrt(l² + w²)
        // - Returning squared value avoids expensive sqrt operation
    }
    
    /**
     * @dev Checks if point is inside rectangle bounds
     * @param pointX X coordinate of point to check
     * @param pointY Y coordinate of point to check
     * @return true if point is inside rectangle, false otherwise
     * 
     * COLLISION DETECTION:
     * - Assumes rectangle positioned at (x,y) extends to (x+lo, y+la)
     * - Point inside if: x ≤ pointX ≤ x+lo AND y ≤ pointY ≤ y+la
     * - Useful for game development, UI interactions
     */
    function contientPoint(uint pointX, uint pointY) public view returns (bool) {
        // Check if point is within rectangle bounds
        return (pointX >= x && pointX <= x + lo) && 
               (pointY >= y && pointY <= y + la);
               
        // BOUNDS CHECKING:
        // - Point must be within rectangle boundaries
        // - x ≤ pointX ≤ x+length (horizontal bounds)
        // - y ≤ pointY ≤ y+width (vertical bounds)  
        // - Both conditions must be true (AND logic)
    }
}

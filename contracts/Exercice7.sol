// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * EXERCICE 7: GEOMETRIC SHAPES CONTAINER
 * 
 * Demonstrates object-oriented programming concepts in Solidity:
 * - Abstract contracts (like interfaces but can have implementation)
 * - Inheritance (contract extends another contract)
 * - Virtual functions (can be overridden by child contracts)
 * - Pure virtual functions (must be implemented by child contracts)
 * - Contract composition and factory patterns
 * 
 * BLOCKCHAIN CONCEPTS:
 * - Contract inheritance gas optimization
 * - Multiple contract instances management
 * - State variable inheritance and visibility
 */

/**
 * ABSTRACT BASE CONTRACT: Forme (Shape)
 * 
 * SOLIDITY CONCEPT: Abstract contracts cannot be deployed directly
 * DESIGN PATTERN: Template Method - defines structure, derived classes fill details
 * OOP PRINCIPLE: Defines common interface and behavior for all shapes
 */
abstract contract Forme {
    
    // STATE VARIABLES: Position coordinates
    // VISIBILITY: 'public' automatically creates getter functions
    // INHERITANCE: These variables are inherited by child contracts
    uint public x;
    uint public y;
    
    /**
     * CONSTRUCTOR: Initializes position coordinates
     * 
     * INHERITANCE CONCEPT: Child contracts must call parent constructor
     * BLOCKCHAIN: Constructor runs once during contract deployment
     * PARAMETER VALIDATION: Basic validation for coordinates
     */
    constructor(uint _x, uint _y) {
        x = _x;
        y = _y;
    }
    
    /**
     * MOVE SHAPE FUNCTION
     * Modifies the shape's position by adding delta values
     * 
     * SOLIDITY CONCEPT: Regular function that can be inherited as-is
     * INHERITANCE: Child contracts inherit this function without override
     * GAS COST: Moderate (updates two state variables)
     */
    function deplacerForme(uint dx, uint dy) public {
        x += dx;
        y += dy;
    }
    
    /**
     * DISPLAY COORDINATES
     * Returns current position as a tuple
     * 
     * SOLIDITY CONCEPT: Multiple return values using named returns
     * INHERITANCE: Can be overridden if child needs different behavior
     * VIEW FUNCTION: Reads state but doesn't modify it
     */
    function afficheXY() public view returns (uint currentX, uint currentY) {
        return (x, y);
    }
    
    /**
     * VIRTUAL FUNCTION: Can be overridden by child contracts
     * 
     * POLYMORPHISM CONCEPT: Same function name, different implementations
     * DEFAULT IMPLEMENTATION: Provides base behavior that can be extended
     * VIRTUAL KEYWORD: Signals that this function can be overridden
     */
    function afficheInfos() public pure virtual returns (string memory) {
        return "Je suis une forme";
    }
    
    /**
     * PURE VIRTUAL FUNCTION: Must be implemented by child contracts
     * 
     * ABSTRACT CONCEPT: Parent defines signature, child provides implementation
     * NO IMPLEMENTATION: Function body is empty, forcing child to implement
     * CONTRACT DESIGN: Ensures all shapes can calculate their surface
     */
    function surface() public view virtual returns (uint);
}

/**
 * CONCRETE CONTRACT: Rectangle
 * 
 * INHERITANCE: Extends Forme abstract contract
 * SOLIDITY CONCEPT: 'is' keyword indicates inheritance relationship
 * IMPLEMENTATION: Provides concrete implementation of all abstract functions
 */
contract Rectangle is Forme {
    
    // ADDITIONAL STATE VARIABLES: Rectangle-specific properties
    // ENCAPSULATION: These are specific to rectangles, not all shapes
    uint public longueur;  // Length
    uint public largeur;   // Width
    
    /**
     * CONSTRUCTOR: Rectangle-specific initialization
     * 
     * INHERITANCE CONCEPT: Must call parent constructor using specific syntax
     * PARAMETER ORDER: x, y (position), longueur, largeur (dimensions)
     * VALIDATION: Ensures dimensions are positive
     */
    constructor(uint _x, uint _y, uint _longueur, uint _largeur) 
        Forme(_x, _y)  // CALL PARENT CONSTRUCTOR - REQUIRED IN SOLIDITY
    {
        require(_longueur > 0, "Longueur must be positive");
        require(_largeur > 0, "Largeur must be positive");
        
        longueur = _longueur;
        largeur = _largeur;
    }
    
    /**
     * IMPLEMENTATION OF PURE VIRTUAL FUNCTION
     * 
     * POLYMORPHISM: Provides concrete implementation of abstract function
     * OVERRIDE KEYWORD: Required when replacing parent function
     * CALCULATION: Area = length × width
     * MATH: Basic geometry calculation
     */
    function surface() public view override returns (uint) {
        return longueur * largeur;
    }
    
    /**
     * FUNCTION OVERRIDE: Provides Rectangle-specific information
     * 
     * INHERITANCE CONCEPT: 'override' keyword required when replacing parent function
     * POLYMORPHISM: Same function name, different behavior than parent
     * SPECIALIZATION: More specific information than generic shape
     */
    function afficheInfos() public pure override returns (string memory) {
        return "Je suis Rectangle";
    }
    
    /**
     * RECTANGLE-SPECIFIC FUNCTION
     * Returns dimensions as a tuple
     * 
     * ENCAPSULATION: Provides controlled access to internal state
     * SPECIFIC BEHAVIOR: Only rectangles have length and width
     * NAMED RETURNS: Clearer interface for multiple return values
     */
    function afficheLoLa() public view returns (uint currentLongueur, uint currentLargeur) {
        return (longueur, largeur);
    }
    
    /**
     * UTILITY FUNCTION: Calculate perimeter
     * 
     * ADDITIONAL FUNCTIONALITY: Not required but useful for complete implementation
     * GEOMETRY: Perimeter = 2 × (length + width)
     * PURE CALCULATION: Could be pure but uses state for convenience
     */
    function perimetre() public view returns (uint) {
        return 2 * (longueur + largeur);
    }
    
    /**
     * MODIFY DIMENSIONS
     * Allows changing rectangle size after creation
     * 
     * MUTABILITY: State-changing function with validation
     * BUSINESS LOGIC: Ensures rectangles remain valid
     */
    function redimensionner(uint nouvelleLongueur, uint nouvelleLargeur) public {
        require(nouvelleLongueur > 0, "Nouvelle longueur must be positive");
        require(nouvelleLargeur > 0, "Nouvelle largeur must be positive");
        
        longueur = nouvelleLongueur;
        largeur = nouvelleLargeur;
    }
}

/**
 * MAIN EXERCICE 7 CONTRACT
 * 
 * COMPOSITION PATTERN: Contains and manages geometric shapes
 * FACTORY PATTERN: Creates new shape instances
 * MANAGER PATTERN: Provides operations on collections of shapes
 */
contract Exercice7 {
    
    // CONTRACT INSTANCES: Array to hold multiple rectangles
    // DYNAMIC ARRAY: Can grow as needed
    // PUBLIC VISIBILITY: Automatic getter for array access
    Rectangle[] public rectangles;
    
    // EVENTS: For frontend monitoring and logging
    // BLOCKCHAIN FEATURE: Events are cheaper than storage for historical data
    event RectangleCreated(uint indexed id, uint x, uint y, uint longueur, uint largeur, address rectangleAddress);
    event RectangleMoved(uint indexed id, uint newX, uint newY);
    
    /**
     * CREATE NEW RECTANGLE
     * 
     * FACTORY PATTERN: Creates and stores new Rectangle instances
     * BLOCKCHAIN CONCEPT: Each rectangle is a separate contract instance
     * GAS CONSIDERATION: Creating contracts is expensive
     */
    function createRectangle(uint x, uint y, uint longueur, uint largeur) public returns (uint rectangleId) {
        // CREATE NEW CONTRACT INSTANCE
        Rectangle newRectangle = new Rectangle(x, y, longueur, largeur);
        
        // STORE REFERENCE
        rectangles.push(newRectangle);
        
        // CALCULATE ID (array index)
        rectangleId = rectangles.length - 1;
        
        // EMIT EVENT FOR FRONTEND NOTIFICATION
        emit RectangleCreated(rectangleId, x, y, longueur, largeur, address(newRectangle));
        
        return rectangleId;
    }
    
    /**
     * GET RECTANGLE COUNT
     * UTILITY FUNCTION: Returns number of created rectangles
     * ARRAY MANAGEMENT: Safe way to get collection size
     */
    function getRectangleCount() public view returns (uint) {
        return rectangles.length;
    }
    
    /**
     * GET RECTANGLE DETAILS
     * 
     * PROXY FUNCTION: Accesses specific rectangle's properties
     * ERROR HANDLING: Includes bounds checking with require
     * TUPLE RETURN: Multiple values for complete rectangle info
     */
    function getRectangleDetails(uint index) public view returns (
        uint x, uint y, uint longueur, uint largeur, uint surface, uint perimetre, string memory info, address rectangleAddress
    ) {
        require(index < rectangles.length, "Rectangle index out of bounds");
        
        Rectangle rect = rectangles[index];
        
        // GATHER ALL RECTANGLE DATA
        (x, y) = rect.afficheXY();
        (longueur, largeur) = rect.afficheLoLa();
        surface = rect.surface();
        perimetre = rect.perimetre();
        info = rect.afficheInfos();
        rectangleAddress = address(rect);
    }
    
    /**
     * MOVE RECTANGLE
     * Delegates movement to specific rectangle
     * 
     * DELEGATION PATTERN: Forwards operation to managed object
     * VALIDATION: Ensures rectangle exists before operation
     */
    function moveRectangle(uint index, uint dx, uint dy) public {
        require(index < rectangles.length, "Rectangle index out of bounds");
        
        rectangles[index].deplacerForme(dx, dy);
        
        // GET NEW POSITION FOR EVENT
        (uint newX, uint newY) = rectangles[index].afficheXY();
        emit RectangleMoved(index, newX, newY);
    }
    
    /**
     * RESIZE RECTANGLE
     * Changes dimensions of existing rectangle
     */
    function resizeRectangle(uint index, uint nouvelleLongueur, uint nouvelleLargeur) public {
        require(index < rectangles.length, "Rectangle index out of bounds");
        
        rectangles[index].redimensionner(nouvelleLongueur, nouvelleLargeur);
    }
    
    /**
     * CALCULATE TOTAL SURFACE
     * Sums the surface area of all rectangles
     * 
     * AGGREGATION: Operates on collection of objects
     * LOOP: Iterates through all managed rectangles
     */
    function getTotalSurface() public view returns (uint totalSurface) {
        for (uint i = 0; i < rectangles.length; i++) {
            totalSurface += rectangles[i].surface();
        }
    }
    
    /**
     * GET ALL RECTANGLES SUMMARY
     * Returns basic info about all rectangles
     * 
     * BULK OPERATION: Efficient way to get collection overview
     * OPTIMIZATION: Single call instead of multiple individual queries
     */
    function getAllRectanglesSummary() public view returns (
        uint count,
        uint totalSurface,
        address[] memory addresses
    ) {
        count = rectangles.length;
        totalSurface = getTotalSurface();
        
        addresses = new address[](count);
        for (uint i = 0; i < count; i++) {
            addresses[i] = address(rectangles[i]);
        }
    }
    
    /**
     * GET CONTRACT INFO
     * Provides metadata about this contract
     * 
     * DEBUGGING HELPER: Useful for development and testing
     * TRANSPARENCY: Shows contract structure and relationships
     */
    function getContractInfo() public view returns (string memory, address, uint) {
        return (
            "Exercice 7: Geometric Shapes Container",
            address(this),
            rectangles.length
        );
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Exercice6 {
    

    uint[] public nombres;

    constructor(uint[] memory _initialNumbers) {
        for (uint i = 0; i < _initialNumbers.length; i++) {
            nombres.push(_initialNumbers[i]);  // Each push costs ~20,000+ gas
        }
    }

    function ajouterNombre(uint nombre) public {
        nombres.push(nombre);  
    }
    
    function getElement(uint index) public view returns (uint) {
        require(index < nombres.length, "Index n'existe pas dans le tableau");
        
        return nombres[index]; 

    }
    
    function afficheTableau() public view returns (uint[] memory) {
        return nombres;
    }
    

    function calculerSomme() public view returns (uint sum) {
        sum = 0; 
        for (uint i = 0; i < nombres.length; i++) {
            sum += nombres[i];  
        }

        return sum;  
    }
}

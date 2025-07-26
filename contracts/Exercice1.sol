// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21; 


contract Exercice1 {
    uint public nombre1; 
    uint public nombre2; 

    constructor(uint _nombre1, uint _nombre2) {
        nombre1 = _nombre1; 
        nombre2 = _nombre2; 
    }
    

    function addition1() public view returns (uint) {
        return nombre1 + nombre2;
    }
    
    function addition2(uint a, uint b) public pure returns (uint) {
        return a + b; 
    }
    
}

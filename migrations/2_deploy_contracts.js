const Exercice1 = artifacts.require("Exercice1");
const Exercice2 = artifacts.require("Exercice2");
const Exercice3 = artifacts.require("Exercice3"); 
const Exercice4 = artifacts.require("Exercice4");
const Exercice5 = artifacts.require("Exercice5");
const Exercice6 = artifacts.require("Exercice6");
const Exercice7 = artifacts.require("Exercice7"); 
const Exercice8 = artifacts.require("Exercice8"); 

module.exports = async function (deployer, network, accounts) {

  try {
    // Deploy Exercise 1: Addition Contract
    // Constructor needs two initial numbers
    await deployer.deploy(Exercice1, 10, 20);
    const exercice1 = await Exercice1.deployed();
    console.log("Exercice1 deployed at:", exercice1.address);
    
    // Deploy Exercise 2: Currency Converter  
    // No constructor parameters needed (all functions are pure)
    await deployer.deploy(Exercice2);
    const exercice2 = await Exercice2.deployed();
    console.log("Exercice2 deployed at:", exercice2.address);
    
    // Deploy Exercise 3: String Management Container
    // Constructor needs initial message for internal GestionChaines contract
    await deployer.deploy(Exercice3, "Message initial pour demonstration");
    const exercice3 = await Exercice3.deployed();
    console.log("Exercice3 (with GestionChaines) deployed at:", exercice3.address);
    
    // Deploy Exercise 4: Positive Number Check
    // No constructor parameters (all functions are pure)
    await deployer.deploy(Exercice4);
    const exercice4 = await Exercice4.deployed();
    console.log("Exercice4 deployed at:", exercice4.address);

    // Deploy Exercise 5: Parity Check
    // No constructor parameters (all functions are pure)
    await deployer.deploy(Exercice5);
    const exercice5 = await Exercice5.deployed();
    console.log("Exercice5 deployed at:", exercice5.address);

    // Deploy Exercise 6: Array Operations
    // Constructor needs initial array of numbers
    const initialNumbers = [1, 2, 3, 4, 5]; // Starting numbers for demonstration
    await deployer.deploy(Exercice6, initialNumbers);
    const exercice6 = await Exercice6.deployed();
    console.log("Exercice6 deployed at:", exercice6.address);

    // Deploy Exercise 7: Geometric Shapes Container
    // No constructor parameters needed (creates rectangles dynamically)
    await deployer.deploy(Exercice7);
    const exercice7 = await Exercice7.deployed();
    console.log("Exercice7 (with Forme and Rectangle) deployed at:", exercice7.address);

    // Deploy Exercise 8: Payment Management Container
    // No constructor parameters needed (creates default payment contract)
    await deployer.deploy(Exercice8);
    const exercice8 = await Exercice8.deployed();
    console.log("Exercice8 (with Payment) deployed at:", exercice8.address);

  
    
    
  } catch (error) {
    console.error("Deployment failed:", error);
    throw error;
  }
};


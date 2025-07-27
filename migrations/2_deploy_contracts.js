const Exercice1 = artifacts.require("Exercice1");
const Exercice2 = artifacts.require("Exercice2");
const Exercice3 = artifacts.require("Exercice3"); 
const Exercice4 = artifacts.require("Exercice4");
const Exercice5 = artifacts.require("Exercice5");
const Exercice6 = artifacts.require("Exercice6");
const Rectangle = artifacts.require("Rectangle");
const Payment = artifacts.require("Payment");

module.exports = async function (deployer, network, accounts) {

  try {
    // Constructor needs two initial numbers
    await deployer.deploy(Exercice1, 10, 20);
    await Exercice1.deployed();
    
    // No constructor parameters needed (all functions are pure)
    await deployer.deploy(Exercice2);
    await Exercice2.deployed();

    // Constructor needs initial message for internal GestionChaines contract
    await deployer.deploy(Exercice3, "Message initial pour demonstration");
    await Exercice3.deployed();

    // No constructor parameters (all functions are pure)
    await deployer.deploy(Exercice4);
    await Exercice4.deployed();

    // No constructor parameters (all functions are pure)
    await deployer.deploy(Exercice5);
    await Exercice5.deployed();

    // Constructor needs initial array of numbers
    const initialNumbers = [1, 2, 3, 4, 5]; // Starting numbers for demonstration
    await deployer.deploy(Exercice6, initialNumbers);
    await Exercice6.deployed();

    // needs initial rectangle position and dimensions
    await deployer.deploy(Rectangle, 1, 2 , 5, 8);
    await Rectangle.deployed();

    // needs initial recipient address
    await deployer.deploy(Payment, accounts[0]);
    await Payment.deployed();

  } catch (error) {
    console.error("Deployment failed:", error);
    throw error;
  }
};


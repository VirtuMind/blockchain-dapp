/**
 * TRUFFLE MIGRATION SCRIPT - UPDATED FOR STREAMLINED CONTRACTS
 * 
 * This script deploys all 8 smart contracts to the blockchain
 * RESTRUCTURED: Contracts are now organized by exercise for better readability
 * 
 * MIGRATION PROCESS:
 * 1. Truffle compiles all contracts in contracts/ folder
 * 2. Migration script deploys them to specified network (Ganache)
 * 3. Each contract gets a permanent address on blockchain
 * 4. Address and ABI saved to build/contracts/ for frontend use
 * 
 * NEW STRUCTURE:
 * - Exercise3 contains GestionChaines
 * - Exercise7 contains Forme and Rectangle
 * - Exercise8 contains Payment
 * - Individual contracts for Exercises 1, 2, 4, 5, 6
 */

// Import all contract artifacts (compiled contracts)
const Exercice1 = artifacts.require("Exercice1");
const Exercice2 = artifacts.require("Exercice2");
const Exercice3 = artifacts.require("Exercice3");  // Contains GestionChaines
const Exercice4 = artifacts.require("Exercice4");
const Exercice5 = artifacts.require("Exercice5");
const Exercice6 = artifacts.require("Exercice6");
const Exercice7 = artifacts.require("Exercice7");  // Contains Forme and Rectangle
const Exercice8 = artifacts.require("Exercice8");  // Contains Payment

export default async function (deployer, network, accounts) {
  
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

    
    // NEXT STEPS INFORMATION
    console.log("\n🎉 All contracts deployed successfully!");
    console.log("\n📋 Next Steps:");
    console.log("1. Run 'node scripts/copy-contracts.js' to copy ABIs to frontend");
    console.log("2. Start React frontend with 'cd frontend && npm run preview'");
    console.log("3. Connect MetaMask to Ganache network (localhost:7545)");
    console.log("4. Import Ganache accounts into MetaMask for testing");
    
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
};

/**
 * MIGRATION EXPLANATION:
 * 
 * 1. ARTIFACTS: artifacts.require() loads compiled contract
 * 2. DEPLOYER: deployer.deploy() deploys contract to blockchain
 * 3. CONSTRUCTOR PARAMS: Second+ parameters are constructor arguments
 * 4. NETWORK: Specified in truffle-config.js (development = Ganache)
 * 5. ACCOUNTS: Ganache provides test accounts with Ether
 * 6. GAS: Each deployment costs gas (paid by deployer account)
 * 
 * WHAT HAPPENS DURING DEPLOYMENT:
 * - Contract bytecode is sent to blockchain
 * - Constructor executes with provided parameters
 * - Contract gets permanent address
 * - ABI and address saved to build/contracts/
 * - Contract is ready for interaction
 * 
 * TRUFFLE COMMANDS:
 * - truffle compile: Compiles contracts
 * - truffle migrate: Runs migration scripts
 * - truffle migrate --reset: Redeploys all contracts
 * - truffle console: Interactive blockchain console
 */

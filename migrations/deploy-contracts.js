/**
 * TRUFFLE MIGRATION SCRIPT
 * 
 * This script deploys all 8 smart contracts to the blockchain
 * 
 * MIGRATION PROCESS:
 * 1. Truffle compiles all contracts in contracts/ folder
 * 2. Migration script deploys them to specified network (Ganache)
 * 3. Each contract gets a permanent address on blockchain
 * 4. Address and ABI saved to build/contracts/ for frontend use
 * 
 * DEPLOYMENT ORDER MATTERS:
 * - Abstract contract (Forme) must be deployed before Rectangle
 * - Some contracts need constructor parameters
 * - Gas costs are paid by the deploying account
 */

// Import all contract artifacts (compiled contracts)
const Exercice1 = artifacts.require("Exercice1");
const Exercice2 = artifacts.require("Exercice2");
const GestionChaines = artifacts.require("GestionChaines");
const Exercice4 = artifacts.require("Exercice4");
const Exercice5 = artifacts.require("Exercice5");
const Exercice6 = artifacts.require("Exercice6");
const Forme = artifacts.require("Forme");
const Rectangle = artifacts.require("Rectangle");
const Payment = artifacts.require("Payment");

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
    
    // Deploy Exercise 3: String Management
    // Constructor needs initial message
    await deployer.deploy(GestionChaines, "Message initial pour demonstration");
    const gestionChaines = await GestionChaines.deployed();
    console.log("GestionChaines deployed at:", gestionChaines.address);
    
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

    // Deploy Exercise 7: Abstract Shape and Rectangle
    // Note: We don't deploy Forme (abstract contract)
    // Only deploy Rectangle which inherits from Forme
    // Rectangle constructor: (x, y, length, width)
    await deployer.deploy(Rectangle, 0, 0, 10, 5);
    const rectangle = await Rectangle.deployed();
    console.log("Rectangle deployed at:", rectangle.address);

    // Deploy Exercise 8: Payment Contract
    // Constructor needs recipient address (use deployer's address)
    await deployer.deploy(Payment, accounts[0]); // Deployer is recipient
    const payment = await Payment.deployed();
    console.log("Payment deployed at:", payment.address);

    
    // NEXT STEPS INFORMATION
    console.log("\n Next Steps:");
    console.log("1. Run 'truffle console' to interact with contracts");
    console.log("2. Use 'npm run copy-contracts' to copy ABIs to frontend");
    console.log("3. Start React frontend with 'npm start' in frontend folder");
    console.log("4. Connect MetaMask to Ganache network");
    
    
  } catch (error) {
    console.error("Deployment failed:", error);
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

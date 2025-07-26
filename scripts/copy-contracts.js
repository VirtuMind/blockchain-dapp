/**
 * CONTRACT ABI COPY SCRIPT
 * 
 * This script copies compiled contract ABIs from Truffle's build directory
 * to the React frontend so the web application can interact with contracts.
 * 
 * WHAT ARE ABIs?
 * - ABI = Application Binary Interface
 * - JSON description of contract functions and events
 * - Tells frontend how to interact with smart contract
 * - Contains function names, parameters, return types
 * - Generated during contract compilation
 * 
 * WHY COPY ABIS?
 * - Frontend needs to know contract interface
 * - Build directory changes with each compilation
 * - Frontend needs stable location for contract data
 * - Separates blockchain development from frontend development
 */

const fs = require('fs');
const path = require('path');

// Define source and destination directories
const buildDir = path.join(__dirname, '../build/contracts');
const frontendContractsDir = path.join(__dirname, '../frontend/src/contracts');

console.log('📋 Starting contract ABI copy process...');
console.log('📁 Source directory:', buildDir);
console.log('📁 Destination directory:', frontendContractsDir);

/**
 * Main function to copy contract ABIs
 */
function copyContractABIs() {
  try {
    // Check if build directory exists
    if (!fs.existsSync(buildDir)) {
      console.error('❌ Build directory not found!');
      console.log('💡 Run "truffle compile" first to generate contract artifacts');
      process.exit(1);
    }

    // Create frontend contracts directory if it doesn't exist
    if (!fs.existsSync(frontendContractsDir)) {
      console.log('📁 Creating frontend contracts directory...');
      fs.mkdirSync(frontendContractsDir, { recursive: true });
    }

    // Get list of contract files
    const contractFiles = fs.readdirSync(buildDir).filter(file => file.endsWith('.json'));
    
    if (contractFiles.length === 0) {
      console.error('❌ No contract files found in build directory!');
      console.log('💡 Run "truffle compile" to generate contract artifacts');
      process.exit(1);
    }

    console.log(`📋 Found ${contractFiles.length} contract files to copy:`);
    
    // Copy each contract file
    let copiedCount = 0;
    let skippedCount = 0;

    contractFiles.forEach(file => {
      try {
        const sourcePath = path.join(buildDir, file);
        const destPath = path.join(frontendContractsDir, file);
        
        // Read the contract artifact
        const contractData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
        
        // Skip if no networks (not deployed)
        if (!contractData.networks || Object.keys(contractData.networks).length === 0) {
          console.log(`⚠️  Skipping ${file} (not deployed)`);
          skippedCount++;
          return;
        }
        
        // Copy the file
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ Copied ${file}`);
        
        // Show deployment info
        const networks = Object.keys(contractData.networks);
        networks.forEach(networkId => {
          const network = contractData.networks[networkId];
          console.log(`   📍 Network ${networkId}: ${network.address}`);
        });
        
        copiedCount++;
        
      } catch (error) {
        console.error(`❌ Error copying ${file}:`, error.message);
      }
    });

    // Summary
    console.log('\n📊 Copy Summary:');
    console.log('='.repeat(40));
    console.log(`✅ Successfully copied: ${copiedCount} files`);
    console.log(`⚠️  Skipped (not deployed): ${skippedCount} files`);
    console.log(`📁 Total files processed: ${contractFiles.length}`);
    console.log('='.repeat(40));

    if (copiedCount > 0) {
      console.log('\n🎉 Contract ABIs successfully copied to frontend!');
      console.log('💡 You can now start your React app and interact with contracts');
    } else {
      console.log('\n⚠️  No contracts were copied. Make sure to:');
      console.log('1. Run "truffle compile" to compile contracts');
      console.log('2. Run "truffle migrate" to deploy contracts');
      console.log('3. Then run this script again');
    }

  } catch (error) {
    console.error('❌ Fatal error during copy process:', error);
    process.exit(1);
  }
}

/**
 * Function to create a summary file with contract information
 */
function createContractSummary() {
  try {
    const contractFiles = fs.readdirSync(frontendContractsDir).filter(file => file.endsWith('.json'));
    
    const summary = {
      timestamp: new Date().toISOString(),
      totalContracts: contractFiles.length,
      contracts: {}
    };

    contractFiles.forEach(file => {
      try {
        const contractPath = path.join(frontendContractsDir, file);
        const contractData = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
        
        const contractName = contractData.contractName;
        summary.contracts[contractName] = {
          fileName: file,
          abi: contractData.abi,
          networks: contractData.networks || {},
          compiler: contractData.compiler || {},
          updatedAt: contractData.updatedAt || null
        };
        
      } catch (error) {
        console.warn(`⚠️  Warning: Could not process ${file}:`, error.message);
      }
    });

    // Write summary file
    const summaryPath = path.join(frontendContractsDir, 'contracts-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    
    console.log(`📋 Created contract summary at: ${summaryPath}`);
    
  } catch (error) {
    console.warn('⚠️  Warning: Could not create contract summary:', error.message);
  }
}

/**
 * Function to validate copied contracts
 */
function validateCopiedContracts() {
  console.log('\n🔍 Validating copied contracts...');
  
  const requiredContracts = [
    'Exercice1.json',
    'Exercice2.json', 
    'GestionChaines.json',
    'Exercice4.json',
    'Exercice5.json',
    'Exercice6.json',
    'Rectangle.json',
    'Payment.json'
  ];

  let allValid = true;
  
  requiredContracts.forEach(contractFile => {
    const contractPath = path.join(frontendContractsDir, contractFile);
    
    if (fs.existsSync(contractPath)) {
      try {
        const contractData = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
        
        // Check if ABI exists
        if (!contractData.abi || contractData.abi.length === 0) {
          console.error(`❌ ${contractFile}: No ABI found`);
          allValid = false;
        }
        
        // Check if deployed to any network
        if (!contractData.networks || Object.keys(contractData.networks).length === 0) {
          console.warn(`⚠️  ${contractFile}: Not deployed to any network`);
        } else {
          console.log(`✅ ${contractFile}: Valid ABI and deployment info`);
        }
        
      } catch (error) {
        console.error(`❌ ${contractFile}: Invalid JSON -`, error.message);
        allValid = false;
      }
    } else {
      console.error(`❌ ${contractFile}: File not found`);
      allValid = false;
    }
  });

  if (allValid) {
    console.log('✅ All required contracts validated successfully!');
  } else {
    console.log('⚠️  Some contracts have issues. Check deployment status.');
  }
}

// Execute the script
console.log('🚀 Contract ABI Copy Script Started');
console.log('='.repeat(50));

copyContractABIs();
createContractSummary();
validateCopiedContracts();

console.log('\n✨ Script completed!');

/**
 * USAGE INSTRUCTIONS:
 * 
 * 1. Compile contracts: truffle compile
 * 2. Deploy contracts: truffle migrate
 * 3. Copy ABIs: node scripts/copy-contracts.js
 * 4. Start frontend: cd frontend && npm start
 * 
 * WHAT THIS SCRIPT CREATES:
 * - frontend/src/contracts/*.json: Individual contract files
 * - frontend/src/contracts/contracts-summary.json: Summary of all contracts
 * 
 * FRONTEND USAGE:
 * ```javascript
 * import Exercice1 from './contracts/Exercice1.json';
 * 
 * const web3 = new Web3('http://localhost:7545');
 * const networkId = await web3.eth.net.getId();
 * const deployedNetwork = Exercice1.networks[networkId];
 * const contract = new web3.eth.Contract(
 *   Exercice1.abi,
 *   deployedNetwork && deployedNetwork.address
 * );
 * ```
 */

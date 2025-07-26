/**
 * WEB3 UTILITIES
 *
 * This file contains utility functions for connecting React frontend
 * to Ethereum blockchain via Web3.js
 */

import Web3 from "web3";

// Ganache local blockchain configuration
const GANACHE_URL = "http://127.0.0.1:7545";

// Types for better TypeScript support
interface ContractArtifact {
  abi: any[];
  networks: {
    [key: string]: {
      address: string;
    };
  };
}

interface TransactionResult {
  receipt: any;
  transactionHash: string;
  gasUsed: number;
  blockNumber: number;
}

interface BalanceInfo {
  wei: string;
  ether: string;
  formatted: string;
}

// Extend Window type for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}

/**
 * Initialize Web3 connection
 */
export const initWeb3 = async (): Promise<Web3> => {
  let web3: Web3;

  // Check if MetaMask is available
  if (window.ethereum) {
    console.log("🦊 MetaMask detected");

    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
      web3 = new Web3(window.ethereum);

      console.log("✅ Connected to MetaMask");
      return web3;
    } catch {
      console.warn("❌ MetaMask connection rejected, falling back to Ganache");
      // Fall through to Ganache connection
    }
  }

  // Fallback to Ganache local network
  try {
    web3 = new Web3(new Web3.providers.HttpProvider(GANACHE_URL));

    // Test connection
    await web3.eth.net.isListening();
    console.log("✅ Connected to Ganache local network");

    return web3;
  } catch (error) {
    console.error("❌ Failed to connect to Ganache:", error);
    throw new Error(
      "Cannot connect to blockchain. Make sure Ganache is running on port 7545"
    );
  }
};

/**
 * Get contract instance from ABI and network info
 */
export const getContract = async (
  web3: Web3,
  contractArtifact: ContractArtifact
) => {
  try {
    // Get current network ID
    const networkId = await web3.eth.net.getId();
    console.log(`🌐 Connected to network ID: ${networkId}`);

    // Get contract deployment info for this network
    const deployedNetwork = contractArtifact.networks[networkId.toString()];

    if (!deployedNetwork) {
      throw new Error(`Contract not deployed on network ${networkId}`);
    }

    // Create contract instance
    const contract = new web3.eth.Contract(
      contractArtifact.abi,
      deployedNetwork.address
    );

    console.log(`📄 Contract loaded at address: ${deployedNetwork.address}`);

    return {
      contract,
      address: deployedNetwork.address,
      networkId: networkId.toString(),
    };
  } catch (error) {
    console.error("❌ Error loading contract:", error);
    throw error;
  }
};

/**
 * Get user accounts from blockchain
 */
export const getAccounts = async (web3: Web3): Promise<string[]> => {
  try {
    const accounts = await web3.eth.getAccounts();

    if (accounts.length === 0) {
      throw new Error("No accounts found. Make sure wallet is connected.");
    }

    console.log(`👥 Found ${accounts.length} accounts`);
    console.log(`🏠 Primary account: ${accounts[0]}`);

    return accounts;
  } catch (error) {
    console.error("❌ Error getting accounts:", error);
    throw error;
  }
};

/**
 * Get account balance in Ether
 */
export const getBalance = async (
  web3: Web3,
  address: string
): Promise<BalanceInfo> => {
  try {
    // Get balance in Wei
    const balanceWei = await web3.eth.getBalance(address);

    // Convert Wei to Ether for display
    const balanceEther = web3.utils.fromWei(balanceWei, "ether");

    return {
      wei: balanceWei.toString(),
      ether: balanceEther,
      formatted: `${parseFloat(balanceEther).toFixed(4)} ETH`,
    };
  } catch (error) {
    console.error("❌ Error getting balance:", error);
    throw error;
  }
};

/**
 * Get blockchain information
 */
export const getBlockchainInfo = async (web3: Web3) => {
  try {
    // Get network information
    const networkId = await web3.eth.net.getId();

    // Get latest block information
    const latestBlock = await web3.eth.getBlock("latest");

    return {
      networkId: networkId.toString(),
      latestBlock: {
        number: latestBlock?.number || 0,
        hash: latestBlock?.hash || "",
        timestamp: latestBlock?.timestamp || 0,
        gasUsed: latestBlock?.gasUsed || 0,
        gasLimit: latestBlock?.gasLimit || 0,
        transactionCount: latestBlock?.transactions?.length || 0,
      },
    };
  } catch (error) {
    console.error("❌ Error getting blockchain info:", error);
    throw error;
  }
};

/**
 * Call contract function (read-only, no gas cost)
 */
export const callContractFunction = async (
  contract: any,
  functionName: string,
  params: any[] = [],
  fromAccount: string | null = null
) => {
  try {
    console.log(`📞 Calling function: ${functionName}`);

    const result = await contract.methods[functionName](...params).call({
      from: fromAccount,
    });

    console.log(`✅ Function result:`, result);
    return result;
  } catch (error) {
    console.error(`❌ Error calling ${functionName}:`, error);
    throw error;
  }
};

/**
 * Send transaction to contract (modifies state, costs gas)
 */
export const sendContractTransaction = async (
  contract: any,
  functionName: string,
  params: any[] = [],
  fromAccount: string,
  value: number = 0
): Promise<TransactionResult> => {
  try {
    console.log(`📤 Sending transaction: ${functionName}`);

    // Prepare transaction
    const transaction = contract.methods[functionName](...params);

    // Estimate gas needed
    const gasEstimate = await transaction.estimateGas({
      from: fromAccount,
      value: value,
    });

    console.log(`⛽ Estimated gas: ${gasEstimate}`);

    // Send transaction
    const receipt = await transaction.send({
      from: fromAccount,
      gas: Math.floor(Number(gasEstimate) * 1.1),
      value: value,
    });

    console.log(`✅ Transaction successful:`, receipt);

    return {
      receipt,
      transactionHash: receipt.transactionHash,
      gasUsed: receipt.gasUsed,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    console.error(`❌ Transaction failed for ${functionName}:`, error);
    throw error;
  }
};

/**
 * Format transaction for display
 */
export const formatTransaction = (transactionData: any) => {
  if (!transactionData || !transactionData.receipt) {
    return null;
  }

  const { receipt } = transactionData;

  return {
    hash: receipt.transactionHash,
    block: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString(),
    status: receipt.status ? "Success ✅" : "Failed ❌",
    timestamp: new Date().toLocaleString(),
  };
};

/**
 * Convert Wei to Ether for display
 */
export const weiToEther = (wei: string | number): string => {
  return Web3.utils.fromWei(wei.toString(), "ether");
};

/**
 * Convert Ether to Wei for transactions
 */
export const etherToWei = (ether: string | number): string => {
  return Web3.utils.toWei(ether.toString(), "ether");
};

/**
 * Validate Ethereum address
 */
export const isValidAddress = (address: string): boolean => {
  return Web3.utils.isAddress(address);
};

/**
 * Shorten address for display
 */
export const shortenAddress = (address: string): string => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};

/**
 * Format number for display
 */
export const formatNumber = (
  number: number | string,
  decimals: number = 2
): string => {
  if (number === null || number === undefined) return "0";
  return parseFloat(number.toString()).toFixed(decimals);
};

/**
 * Handle common Web3 errors
 */
export const handleWeb3Error = (error: any): string => {
  if (error.code === 4001) {
    return "Transaction cancelled by user";
  }

  if (error.message && error.message.includes("insufficient funds")) {
    return "Insufficient funds for transaction";
  }

  if (
    error.message &&
    error.message.includes("gas required exceeds allowance")
  ) {
    return "Transaction requires more gas than allowed";
  }

  if (error.message && error.message.includes("revert")) {
    return "Transaction reverted - check contract conditions";
  }

  return error.message || "Unknown blockchain error";
};

export default {
  initWeb3,
  getContract,
  getAccounts,
  getBalance,
  getBlockchainInfo,
  callContractFunction,
  sendContractTransaction,
  formatTransaction,
  weiToEther,
  etherToWei,
  isValidAddress,
  shortenAddress,
  formatNumber,
  handleWeb3Error,
};

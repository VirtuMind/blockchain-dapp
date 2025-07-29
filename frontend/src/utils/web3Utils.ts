import Web3 from "web3";

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

interface CompleteTransactionData {
  transactionHash: string;
  blockNumber: number;
  gasUsed: number;
  gasPrice: string;
  status: boolean;
  from: string;
  to: string;
  value: string;
  nonce?: number;
  transactionIndex?: number;
  cumulativeGasUsed?: number;
  logs?: object[];
  timestamp?: number;
  receipt: any; // Keep original receipt for backward compatibility
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
    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
      web3 = new Web3(window.ethereum);

      return web3;
    } catch {
      console.log("MetaMask connection rejected, falling back to Ganache");
      // Fall through to Ganache connection
    }
  }

  // Fallback to Ganache local network
  try {
    web3 = new Web3(new Web3.providers.HttpProvider(GANACHE_URL));

    // Test connection
    await web3.eth.net.isListening();

    return web3;
  } catch (error) {
    console.log("Failed to connect to Ganache:", error);
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

    return {
      contract,
      address: deployedNetwork.address,
      networkId: networkId.toString(),
    };
  } catch (error) {
    console.log("Error loading contract:", error);
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
    console.log("Error getting balance:", error);
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

    // Determine network URL based on current provider
    let networkUrl = "Unknown";
    if (
      web3.currentProvider &&
      typeof web3.currentProvider === "object" &&
      "host" in web3.currentProvider
    ) {
      networkUrl = (web3.currentProvider as any).host || "Unknown";
    } else if (
      web3.currentProvider &&
      typeof web3.currentProvider === "string"
    ) {
      networkUrl = web3.currentProvider;
    } else {
      // Default for common networks
      if (networkId.toString() === "1337" || networkId.toString() === "5777") {
        networkUrl = "http://127.0.0.1:7545"; // Ganache
      }
    }

    // Get latest block information with all details
    const latestBlock = await web3.eth.getBlock("latest", true); // true to get full transaction objects

    return {
      networkId: networkId.toString(),
      networkUrl,
      latestBlock: {
        number: latestBlock?.number || 0,
        hash: latestBlock?.hash || "",
        timestamp: latestBlock?.timestamp || 0,
        parentHash: latestBlock?.parentHash || "",
        nonce: latestBlock?.nonce?.toString() || "",
        transactionCount: latestBlock?.transactions?.length || 0,
        miner: latestBlock?.miner || "",
        difficulty: latestBlock?.difficulty || 0,
        gasLimit: latestBlock?.gasLimit || 0,
        gasUsed: latestBlock?.gasUsed || 0,
        size: Number(latestBlock?.size || 0),
      },
    };
  } catch (error) {
    console.log("Error getting blockchain info:", error);
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
    const result = await contract.methods[functionName](...params).call({
      from: fromAccount,
    });

    return result;
  } catch (error) {
    console.log(`Error calling contract function ${functionName}:`, error);
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
): Promise<CompleteTransactionData> => {
  try {
    // Prepare transaction
    const transaction = contract.methods[functionName](...params);

    // Estimate gas needed
    const gasEstimate = await transaction.estimateGas({
      from: fromAccount,
      value: value,
    });

    // Send transaction
    const receipt = await transaction.send({
      from: fromAccount,
      gas: Math.floor(Number(gasEstimate) * 1.1),
      value: value,
    });

    // Get full transaction details for display
    const web3 = new Web3(
      window.ethereum || new Web3.providers.HttpProvider(GANACHE_URL)
    );
    const fullTransaction = await web3.eth.getTransaction(
      receipt.transactionHash
    );

    // Return formatted transaction data that matches TransactionDetails component expectations
    return {
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed,
      gasPrice: fullTransaction?.gasPrice?.toString() || "0",
      status: receipt.status,
      from: receipt.from,
      to: receipt.to,
      value: fullTransaction?.value?.toString() || "0",
      nonce: fullTransaction?.nonce ? Number(fullTransaction.nonce) : undefined,
      transactionIndex: receipt.transactionIndex,
      cumulativeGasUsed: receipt.cumulativeGasUsed,
      logs: receipt.logs || [],
      timestamp: Math.floor(Date.now() / 1000), // Current timestamp as fallback
      // Keep the original receipt for backward compatibility
      receipt,
    };
  } catch (error) {
    console.log("Error sending transaction:", error);
    throw error;
  }
};

export default {
  initWeb3,
  getContract,
  getBalance,
  getBlockchainInfo,
  callContractFunction,
  sendContractTransaction,
};

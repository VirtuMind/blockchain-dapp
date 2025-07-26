/**
 * CUSTOM REACT HOOK FOR WEB3 INTEGRATION
 *
 * This hook provides a React-friendly way to interact with blockchain
 * It manages the Web3 connection state and provides contract instances
 *
 * BLOCKCHAIN CONCEPTS EXPLAINED:
 * - Hook: Reusable React logic that manages state and side effects
 * - Web3 Instance: Connection to blockchain (Ganache or MetaMask)
 * - Accounts: Ethereum addresses that can send transactions
 * - Network ID: Identifies which blockchain network we're connected to
 * - Contract Instances: JavaScript objects representing deployed smart contracts
 */

import { useState, useEffect } from "react";
import Web3 from "web3";
import { initWeb3, getContract } from "../utils/web3Utils";

// TypeScript interfaces for better type safety
interface Web3State {
  web3: Web3 | null;
  accounts: string[];
  networkId: number | null;
  currentAccount: string | null;
  isConnected: boolean;
}

interface ContractInstances {
  [key: string]: {
    contract: unknown;
    address: string;
    networkId: string;
  };
}

export const useWeb3 = () => {
  // React state to track Web3 connection status
  const [web3State, setWeb3State] = useState<Web3State>({
    web3: null,
    accounts: [],
    networkId: null,
    currentAccount: null,
    isConnected: false,
  });

  // State to store contract instances for each exercise
  const [contracts, setContracts] = useState<ContractInstances>({});

  // Loading state to show when connecting to blockchain
  const [loading, setLoading] = useState(true);

  // Error state to display connection problems
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize Web3 connection when component mounts
   * This runs once when the hook is first used
   */
  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        setLoading(true);
        setError(null);

        // Connect to blockchain (Ganache or MetaMask)
        console.log("Connecting to blockchain...");
        const web3Instance = await initWeb3();

        // Get list of available accounts (Ethereum addresses)
        const accounts = await web3Instance.eth.getAccounts();
        console.log("Found accounts:", accounts);

        // Get network ID to verify we're on correct blockchain
        const networkId = await web3Instance.eth.net.getId();
        console.log("Connected to network:", networkId);

        // Update React state with connection info
        setWeb3State({
          web3: web3Instance,
          accounts,
          networkId: Number(networkId),
          currentAccount: accounts[0] || null,
          isConnected: accounts.length > 0,
        });

        // Load all contract instances for the 8 exercises
        await loadContracts(web3Instance);
      } catch (err) {
        console.error("❌ Failed to initialize Web3:", err);
        setError(
          err instanceof Error ? err.message : "Failed to connect to blockchain"
        );
      } finally {
        setLoading(false);
      }
    };

    initializeWeb3();
  }, []); // Empty dependency array = run once on mount

  /**
   * Load contract instances for all 8 exercises
   * This creates JavaScript objects that can call smart contract functions
   */
  const loadContracts = async (web3: Web3) => {
    try {
      console.log("Loading contract instances...");

      // List of all contract names from our exercises (UPDATED FOR NEW STRUCTURE)
      const contractNames = [
        "Exercice1", // Addition operations
        "Exercice2", // Ether/Wei conversion
        "Exercice3", // String management container (contains GestionChaines)
        "Exercice4", // Positive number check
        "Exercice5", // Parity check
        "Exercice6", // Array operations
        "Exercice7", // Geometry container (contains Forme and Rectangle)
        "Exercice8", // Payment container (contains Payment)
      ];

      // Create contract instances for each exercise
      const contractInstances: ContractInstances = {};

      for (const contractName of contractNames) {
        try {
          // Import contract ABI artifact
          const contractArtifact = await import(
            `../contracts/${contractName}.json`
          );

          // Load contract ABI and create instance
          const contractInstance = await getContract(web3, contractArtifact);
          contractInstances[contractName] = contractInstance;
          console.log(`Loaded ${contractName} contract`);
        } catch (err) {
          console.warn(`⚠️ Failed to load ${contractName}:`, err);
          // Continue loading other contracts even if one fails
        }
      }

      setContracts(contractInstances);
      console.log("All contracts loaded successfully");
    } catch (err) {
      console.error("❌ Failed to load contracts:", err);
      setError("Failed to load smart contracts");
    }
  };

  /**
   * Switch to a different account
   * Useful when user wants to test with different Ethereum addresses
   */
  const switchAccount = (accountIndex: number) => {
    if (web3State.accounts[accountIndex]) {
      setWeb3State((prev) => ({
        ...prev,
        currentAccount: prev.accounts[accountIndex],
      }));
      console.log("Switched to account:", web3State.accounts[accountIndex]);
    }
  };

  /**
   * Refresh account information
   * Useful when user adds new accounts in MetaMask
   */
  const refreshAccounts = async () => {
    if (web3State.web3) {
      try {
        const accounts = await web3State.web3.eth.getAccounts();
        setWeb3State((prev) => ({
          ...prev,
          accounts,
          currentAccount: accounts[0] || null,
          isConnected: accounts.length > 0,
        }));
      } catch (err) {
        console.error("Failed to refresh accounts:", err);
      }
    }
  };

  // Return all the state and functions that components can use
  return {
    // Connection state
    ...web3State,
    contracts,
    loading,
    error,

    // Helper functions
    switchAccount,
    refreshAccounts,

    // Convenience properties
    hasContracts: Object.keys(contracts).length > 0,
    isReady: web3State.isConnected && Object.keys(contracts).length > 0,
  };
};

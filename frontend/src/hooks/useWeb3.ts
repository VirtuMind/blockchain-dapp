import { useState, useEffect } from "react";
import Web3 from "web3";
import { initWeb3, getContract } from "../utils/web3Utils";
interface Web3State {
  web3: Web3 | null;
  accounts: string[];
  networkId: number | null;
  currentAccount: string;
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
    currentAccount: "",
    isConnected: false,
  });

  // State to store contract instances for each exercise
  const [contracts, setContracts] = useState<ContractInstances>({});

  // Loading state to show when connecting to blockchain
  const [loading, setLoading] = useState(true);

  // Error state to display connection problems
  const [error, setError] = useState<string | null>(null);

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
          currentAccount: accounts[0],
          isConnected: accounts.length > 0,
        });

        // Load all contract instances for the 8 exercises
        await loadContracts(web3Instance);
      } catch (err) {
        console.error("Failed to initialize Web3:", err);
        setError(
          err instanceof Error ? err.message : "Failed to connect to blockchain"
        );
      } finally {
        setLoading(false);
      }
    };

    initializeWeb3();
  }, []);

  /**
   * Load contract instances for all 8 exercises
   * This creates JavaScript objects that can call smart contract functions
   */
  const loadContracts = async (web3: Web3) => {
    try {
      console.log("Loading contract instances...");

      // List of all contract names from our exercises (UPDATED FOR NEW STRUCTURE)
      const contractNames = [
        "Exercice1",
        "Exercice2",
        "Exercice3",
        "Exercice4",
        "Exercice5",
        "Exercice6",
        "Rectangle",
        "Payment",
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
          console.warn(`Failed to load ${contractName}:`, err);
          // Continue loading other contracts even if one fails
        }
      }

      setContracts(contractInstances);
      console.log("All contracts loaded successfully");
    } catch (err) {
      console.error(" Failed to load contracts:", err);
      setError("Failed to load smart contracts");
    }
  };

  return {
    ...web3State,
    contracts,
    loading,
    error,

    hasContracts: Object.keys(contracts).length > 0,
    isReady: web3State.isConnected && Object.keys(contracts).length > 0,
  };
};

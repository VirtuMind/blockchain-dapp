/**
 * BLOCKCHAIN INFO COMPONENT
 *
 * This component displays current blockchain information including:
 * - Connected account address and balance
 * - Current block number and timestamp
 * - Network details
 * - Connection status
 *
 * This helps users understand their current blockchain state
 */

import React, { useState, useEffect } from "react";
import { useWeb3 } from "../hooks/useWeb3";
import {
  getBalance,
  getBlockchainInfo,
  shortenAddress,
} from "../utils/web3Utils";

// CSS styles for the component
const styles = {
  container: {
    background: "#1a1a2e",
    border: "1px solid #16213e",
    borderRadius: "8px",
    padding: "16px",
    margin: "16px 0",
    color: "#fff",
  },
  info_container: {
    background: "#16213e",
    border: "1px solid #495057",
    borderRadius: "6px",
    padding: "16px",
    flex: "1",
    minWidth: "300px",
  },
  subBlockTitle: {
    color: "#4dabf7",
    marginBottom: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    borderBottom: "1px solid #495057",
    paddingBottom: "8px",
  },
  title: {
    color: "#f7b34d",
    marginBottom: "12px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  note_title: {
    color: "#9c9c9c",
    marginBottom: "12px",
    fontSize: "12px",
    fontWeight: "bold",
    fontStyle: "italic",
  },

  infoGrid: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  subBlockWrapper: {
    display: "flex",
    flexDirection: "row" as const,
    width: "100%",
  },
  subBlockContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    alignItems: "start",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  },
  label: {
    color: "#8cc2ff",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase" as const,
  },
  value: {
    color: "#fff",
    fontSize: "14px",
    fontFamily: "monospace",
    wordWrap: "break-word" as const,
    overflowWrap: "break-word" as const,
    whiteSpace: "normal" as const,
    maxWidth: "100%",
  },
  status: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "600",
  },
  connected: {
    background: "#51cf66",
    color: "#000",
  },
  disconnected: {
    background: "#ff6b6b",
    color: "#fff",
  },
  error: {
    background: "#ff8787",
    color: "#000",
    padding: "8px",
    borderRadius: "4px",
    fontSize: "14px",
  },
};

interface BlockchainData {
  networkId: string;
  networkUrl: string;
  latestBlock: {
    number: number | bigint;
    hash: string;
    parentHash: string;
    timestamp: number | bigint;
    gasUsed: number | bigint;
    gasLimit: number | bigint;
    transactionCount: number;
    miner: string;
    difficulty: string | number | bigint;
    nonce: string | bigint;
    size: number | bigint;
  };
}

interface BalanceData {
  wei: string;
  ether: string;
  formatted: string;
}

export const BlockchainInfo: React.FC<{ contractAddress: string }> = ({
  contractAddress,
}) => {
  // Get Web3 context from our custom hook
  const { web3, currentAccount, networkId, isConnected, error, contracts } =
    useWeb3();

  // Component state for blockchain data
  const [blockchainData, setBlockchainData] = useState<BlockchainData | null>(
    null
  );
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Refresh data every 10 seconds and when connection changes
   */
  useEffect(() => {
    const fetchData = async () => {
      if (!web3 || !currentAccount) return;

      try {
        setLoading(true);

        // Get current blockchain state (block number, timestamp, etc.)
        const blockInfo = await getBlockchainInfo(web3);
        setBlockchainData(blockInfo);

        // Get current account balance
        const balanceInfo = await getBalance(web3, currentAccount);
        setBalance(balanceInfo);
      } catch (err) {
        console.error("Failed to fetch blockchain info:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isConnected) {
      fetchData();

      // Set up auto-refresh interval
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    }
  }, [web3, currentAccount, isConnected]);

  // Show error state if connection failed
  if (error) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>Blockchain Connection</h3>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  // Show loading state while connecting
  if (!web3 || loading) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>Loading Blockchain Info...</h3>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Blockchain Information</h3>
      <h6 style={styles.note_title}>
        *Actualisé automatiquement chaque 10 secondes
      </h6>

      <div style={styles.infoGrid}>
        {/* First Sub-block: Network Information */}
        <div style={styles.subBlockWrapper}>
          <div style={styles.info_container}>
            <div style={styles.subBlockTitle}>Informations sur le réseau</div>
            <div style={styles.subBlockContainer}>
              {/* Connection Status */}
              <div style={styles.infoItem}>
                <span style={styles.label}>État de la connexion</span>
                <span
                  style={{
                    ...styles.status,
                    ...(isConnected ? styles.connected : styles.disconnected),
                  }}
                >
                  {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
                </span>
              </div>

              {/* Network ID */}
              <div style={styles.infoItem}>
                <span style={styles.label}>Network ID</span>
                <span style={styles.value}>
                  {networkId || "Unknown"}
                  {networkId === 1337 && " (Ganache)"}
                  {networkId === 5777 && " (Ganache)"}
                </span>
              </div>

              {/* Network URL */}
              <div style={styles.infoItem}>
                <span style={styles.label}>Network URL</span>
                <span style={styles.value}>
                  {blockchainData?.networkUrl || "Unknown"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Second Sub-block: Contract & Account Information */}
        <div style={styles.subBlockWrapper}>
          <div style={styles.info_container}>
            <div style={styles.subBlockTitle}>Contract & Compte</div>
            <div style={styles.subBlockContainer}>
              {/* Current Account */}
              <div style={styles.infoItem}>
                <span style={styles.label}>COMPTE</span>
                <span style={styles.value}>
                  {currentAccount ? currentAccount : "Not connected"}
                </span>
              </div>

              {/* Account Balance */}
              <div style={styles.infoItem}>
                <span style={styles.label}>SOLDE DU COMPTE</span>
                <span style={styles.value}>
                  {balance
                    ? `${parseFloat(balance.ether).toFixed(4)} ETH`
                    : "0 ETH"}
                </span>
              </div>

              {/* Contract Information */}

              <div style={styles.infoItem}>
                <span style={styles.label}>Adresse de contrat</span>
                <span style={styles.value}>{contractAddress || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Third Sub-block: Latest Block Information */}
        {blockchainData && (
          <div style={styles.subBlockWrapper}>
            <div style={styles.info_container}>
              <div style={styles.subBlockTitle}>Dernier block</div>
              <div style={styles.subBlockContainer}>
                {/* Block Number */}
                <div style={styles.infoItem}>
                  <span style={styles.label}>Block Number</span>
                  <span style={styles.value}>
                    #{blockchainData.latestBlock.number.toString()}
                  </span>
                </div>

                {/* Block Hash */}
                <div style={styles.infoItem}>
                  <span style={styles.label}>Block Hash</span>
                  <span style={styles.value}>
                    {blockchainData.latestBlock.hash}
                  </span>
                </div>

                {/* Parent Hash */}
                <div style={styles.infoItem}>
                  <span style={styles.label}>Parent Hash</span>
                  <span style={styles.value}>
                    {blockchainData.latestBlock.parentHash}
                  </span>
                </div>

                {/* Block Timestamp */}
                <div style={styles.infoItem}>
                  <span style={styles.label}>Block Timestamp</span>
                  <span style={styles.value}>
                    {new Date(
                      Number(blockchainData.latestBlock.timestamp) * 1000
                    ).toLocaleString()}
                  </span>
                </div>

                {/* Transactions Count */}
                <div style={styles.infoItem}>
                  <span style={styles.label}>Transactions</span>
                  <span style={styles.value}>
                    {blockchainData.latestBlock.transactionCount}
                  </span>
                </div>

                {/* Miner */}
                <div style={styles.infoItem}>
                  <span style={styles.label}>Miner</span>
                  <span style={styles.value}>
                    {blockchainData.latestBlock.miner}
                  </span>
                </div>

                {/* Gas Information */}
                <div style={styles.infoItem}>
                  <span style={styles.label}>Gas Used / Limit</span>
                  <span style={styles.value}>
                    {Number(
                      blockchainData.latestBlock.gasUsed
                    ).toLocaleString()}{" "}
                    /{" "}
                    {Number(
                      blockchainData.latestBlock.gasLimit
                    ).toLocaleString()}
                  </span>
                </div>

                {/* Block Size */}
                <div style={styles.infoItem}>
                  <span style={styles.label}>Block Size</span>
                  <span style={styles.value}>
                    {Number(blockchainData.latestBlock.size).toLocaleString()}{" "}
                    bytes
                  </span>
                </div>

                {/* Difficulty */}
                <div style={styles.infoItem}>
                  <span style={styles.label}>Difficulty</span>
                  <span style={styles.value}>
                    {Number(
                      blockchainData.latestBlock.difficulty
                    ).toLocaleString()}
                  </span>
                </div>

                {/* Nonce */}
                <div style={styles.infoItem}>
                  <span style={styles.label}>Nonce</span>
                  <span style={styles.value}>
                    {blockchainData.latestBlock.nonce.toString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

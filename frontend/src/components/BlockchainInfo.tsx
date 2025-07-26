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
  title: {
    color: "#4dabf7",
    marginBottom: "12px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
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
  latestBlock: {
    number: number | bigint;
    hash: string;
    timestamp: number | bigint;
    gasUsed: number | bigint;
    gasLimit: number | bigint;
    transactionCount: number;
  };
}

interface BalanceData {
  wei: string;
  ether: string;
  formatted: string;
}

export const BlockchainInfo: React.FC = () => {
  // Get Web3 context from our custom hook
  const { web3, currentAccount, networkId, isConnected, error } = useWeb3();

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

  // Manual refresh function for the button
  const handleRefresh = async () => {
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

  // Show error state if connection failed
  if (error) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>⚠️ Blockchain Connection</h3>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  // Show loading state while connecting
  if (!web3 || loading) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>🔄 Loading Blockchain Info...</h3>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🔗 Blockchain Information</h3>

      <div style={styles.infoGrid}>
        {/* Connection Status */}
        <div style={styles.infoItem}>
          <span style={styles.label}>Connection Status</span>
          <span
            style={{
              ...styles.status,
              ...(isConnected ? styles.connected : styles.disconnected),
            }}
          >
            {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
          </span>
        </div>

        {/* Network Information */}
        <div style={styles.infoItem}>
          <span style={styles.label}>Network ID</span>
          <span style={styles.value}>
            {networkId || "Unknown"}
            {networkId === 1337 && " (Ganache)"}
            {networkId === 5777 && " (Ganache)"}
          </span>
        </div>

        {/* Current Account */}
        <div style={styles.infoItem}>
          <span style={styles.label}>Current Account</span>
          <span style={styles.value}>
            {currentAccount ? shortenAddress(currentAccount) : "Not connected"}
          </span>
        </div>

        {/* Account Balance */}
        <div style={styles.infoItem}>
          <span style={styles.label}>Balance</span>
          <span style={styles.value}>
            {balance ? `${parseFloat(balance.ether).toFixed(4)} ETH` : "0 ETH"}
          </span>
        </div>

        {/* Latest Block */}
        {blockchainData && (
          <>
            <div style={styles.infoItem}>
              <span style={styles.label}>Latest Block</span>
              <span style={styles.value}>
                #{blockchainData.latestBlock.number.toString()}
              </span>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.label}>Block Timestamp</span>
              <span style={styles.value}>
                {new Date(
                  Number(blockchainData.latestBlock.timestamp) * 1000
                ).toLocaleTimeString()}
              </span>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.label}>Transactions in Block</span>
              <span style={styles.value}>
                {blockchainData.latestBlock.transactionCount}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Manual Refresh Button */}
      <button
        onClick={handleRefresh}
        style={{
          marginTop: "12px",
          padding: "8px 16px",
          background: "#4dabf7",
          color: "#000",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600",
        }}
        disabled={loading}
      >
        {loading ? "Refreshing..." : "🔄 Refresh Info"}
      </button>
    </div>
  );
};

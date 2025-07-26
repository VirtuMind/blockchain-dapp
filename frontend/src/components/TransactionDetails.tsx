/**
 * TRANSACTION DETAILS COMPONENT
 *
 * This component displays information about the last blockchain transaction:
 * - Transaction hash (unique identifier)
 * - Gas used and gas price
 * - Block number where transaction was included
 * - Transaction status (success/failure)
 * - Transaction timestamp
 *
 * This helps users understand what happened with their blockchain interactions
 */

import React from "react";
import { shortenAddress, weiToEther } from "../utils/web3Utils";

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
    color: "#51cf66",
    marginBottom: "12px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  noTransaction: {
    color: "#868e96",
    fontStyle: "italic",
    textAlign: "center" as const,
    padding: "20px",
  },
  transactionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
  },
  transactionItem: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  },
  label: {
    color: "#74c0fc",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase" as const,
  },
  value: {
    color: "#fff",
    fontSize: "14px",
    fontFamily: "monospace",
    wordBreak: "break-all" as const,
  },
  status: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "600",
  },
  success: {
    background: "#51cf66",
    color: "#000",
  },
  failure: {
    background: "#ff6b6b",
    color: "#fff",
  },
  pending: {
    background: "#ffd43b",
    color: "#000",
  },
  hash: {
    color: "#74c0fc",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

// Interface for transaction data
interface TransactionData {
  transactionHash: string;
  blockNumber: number;
  gasUsed: number;
  gasPrice: string;
  status: boolean;
  timestamp?: number;
  from: string;
  to: string;
  value: string;
}

interface TransactionDetailsProps {
  transaction: TransactionData | null;
  networkId?: number;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  transaction,
  networkId,
}) => {
  /**
   * Generate block explorer URL based on network
   * This allows users to view their transaction on external block explorers
   */
  const getBlockExplorerUrl = (txHash: string): string => {
    // For Ganache (local development), no block explorer available
    if (networkId === 1337 || networkId === 5777) {
      return "#"; // No external explorer for local networks
    }

    // For other networks, you could add Etherscan URLs:
    // if (networkId === 1) return `https://etherscan.io/tx/${txHash}`; // Mainnet
    // if (networkId === 3) return `https://ropsten.etherscan.io/tx/${txHash}`; // Ropsten

    return `https://etherscan.io/tx/${txHash}`; // Default to mainnet
  };

  /**
   * Open transaction in block explorer
   */
  const openInExplorer = (txHash: string) => {
    const url = getBlockExplorerUrl(txHash);
    if (url !== "#") {
      window.open(url, "_blank");
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📄 Last Transaction Details</h3>

      {!transaction ? (
        <div style={styles.noTransaction}>
          No recent transaction data available.
          <br />
          Execute a contract function to see transaction details here.
        </div>
      ) : (
        <div style={styles.transactionGrid}>
          {/* Transaction Hash */}
          <div style={styles.transactionItem}>
            <span style={styles.label}>Transaction Hash</span>
            <span
              style={{ ...styles.value, ...styles.hash }}
              onClick={() => openInExplorer(transaction.transactionHash)}
              title="Click to view in block explorer"
            >
              {shortenAddress(transaction.transactionHash)}
            </span>
          </div>

          {/* Transaction Status */}
          <div style={styles.transactionItem}>
            <span style={styles.label}>Status</span>
            <span
              style={{
                ...styles.status,
                ...(transaction.status ? styles.success : styles.failure),
              }}
            >
              {transaction.status ? "✅ Success" : "❌ Failed"}
            </span>
          </div>

          {/* Block Number */}
          <div style={styles.transactionItem}>
            <span style={styles.label}>Block Number</span>
            <span style={styles.value}>#{transaction.blockNumber}</span>
          </div>

          {/* Gas Information */}
          <div style={styles.transactionItem}>
            <span style={styles.label}>Gas Used</span>
            <span style={styles.value}>
              {transaction.gasUsed.toLocaleString()} gas
            </span>
          </div>

          <div style={styles.transactionItem}>
            <span style={styles.label}>Gas Price</span>
            <span style={styles.value}>
              {weiToEther(transaction.gasPrice)} ETH
            </span>
          </div>

          {/* Transaction Cost */}
          <div style={styles.transactionItem}>
            <span style={styles.label}>Transaction Cost</span>
            <span style={styles.value}>
              {weiToEther(
                (
                  BigInt(transaction.gasUsed) * BigInt(transaction.gasPrice)
                ).toString()
              )}{" "}
              ETH
            </span>
          </div>

          {/* From Address */}
          <div style={styles.transactionItem}>
            <span style={styles.label}>From</span>
            <span style={styles.value}>{shortenAddress(transaction.from)}</span>
          </div>

          {/* To Address */}
          <div style={styles.transactionItem}>
            <span style={styles.label}>To (Contract)</span>
            <span style={styles.value}>{shortenAddress(transaction.to)}</span>
          </div>

          {/* Value Transferred */}
          <div style={styles.transactionItem}>
            <span style={styles.label}>Value</span>
            <span style={styles.value}>
              {weiToEther(transaction.value)} ETH
            </span>
          </div>

          {/* Timestamp (if available) */}
          {transaction.timestamp && (
            <div style={styles.transactionItem}>
              <span style={styles.label}>Timestamp</span>
              <span style={styles.value}>
                {new Date(transaction.timestamp * 1000).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

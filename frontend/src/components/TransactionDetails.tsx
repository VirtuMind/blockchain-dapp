/**
 * TRANSACTION DETAILS COMPONENT
 *
 * This component displays information about the latest blockchain transaction:
 * - Automatically fetches the most recent transaction from the blockchain
 * - Refreshes every 10 seconds to show new transactions
 * - Shows comprehensive transaction details including gas, addresses, and status
 *
 * This helps users understand recent blockchain activity
 */

import React, { useState, useEffect } from "react";
import { useWeb3 } from "../hooks/useWeb3";
import { weiToEther } from "../utils/web3Utils";

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
    color: "#f7b34d",
    fontSize: "18px",
    fontWeight: "bold",
  },
  note_title: {
    color: "#9c9c9c",
    fontSize: "12px",
    fontWeight: "bold",
    fontStyle: "italic",
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
  nonce?: number;
  transactionIndex?: number;
  cumulativeGasUsed?: number;
  logs?: object[];
  transactionType: "contract_creation" | "contract_call" | "ether_transfer";
}

interface TransactionDetailsProps {
  transactionCount?: number; // Total transaction count to display
  networkId?: number;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = () => {
  const { web3 } = useWeb3();
  const [latestTransaction, setLatestTransaction] =
    useState<TransactionData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch the latest transaction from the blockchain
   */
  const fetchLatestTransaction = async () => {
    if (!web3) return;

    try {
      setLoading(true);
      setError(null);

      // Get the latest block with full transaction objects
      const latestBlock = await web3.eth.getBlock("latest", true);

      if (
        !latestBlock ||
        !latestBlock.transactions ||
        latestBlock.transactions.length === 0
      ) {
        setLatestTransaction(null);
        return;
      }

      // Get the most recent transaction from the latest block
      const transactions = latestBlock.transactions as any[];
      const latestTx = transactions[transactions.length - 1];

      // Get full transaction details
      const fullTransaction = await web3.eth.getTransaction(
        latestTx.hash || latestTx
      );
      const receipt = await web3.eth.getTransactionReceipt(
        latestTx.hash || latestTx
      );

      if (!fullTransaction || !receipt) {
        setLatestTransaction(null);
        return;
      }

      let transactionType:
        | "contract_creation"
        | "contract_call"
        | "ether_transfer";
      if (!fullTransaction.to) {
        transactionType = "contract_creation";
      } else if (fullTransaction.input && fullTransaction.input !== "0x") {
        transactionType = "contract_call";
      } else {
        transactionType = "ether_transfer";
      }

      const transactionData: TransactionData = {
        transactionHash: fullTransaction.hash,
        blockNumber: Number(fullTransaction.blockNumber) || 0,
        gasUsed: Number(receipt.gasUsed),
        gasPrice: fullTransaction.gasPrice?.toString() || "0",
        status: Boolean(receipt.status),
        from: fullTransaction.from,
        to: fullTransaction.to || "",
        value: fullTransaction.value?.toString() || "0",
        nonce: Number(fullTransaction.nonce),
        transactionIndex: Number(fullTransaction.transactionIndex),
        cumulativeGasUsed: Number(receipt.cumulativeGasUsed),
        logs: receipt.logs || [],
        timestamp: Number(latestBlock.timestamp),
        transactionType: transactionType,
      };

      setLatestTransaction(transactionData);
    } catch (err) {
      console.error("Error fetching latest transaction:", err);
      setError("Failed to fetch latest transaction");
      setLatestTransaction(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Set up auto-refresh every 10 seconds
   */
  useEffect(() => {
    if (!web3) return;

    // Initial fetch
    fetchLatestTransaction();

    // Set up interval for auto-refresh
    const interval = setInterval(fetchLatestTransaction, 10000); // 10 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [web3]);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Dernière transaction</h3>
      <h6 style={styles.note_title}>
        *Actualisé automatiquement chaque 10 secondes
      </h6>

      {error && (
        <div style={{ ...styles.noTransaction, color: "#ff8787" }}>{error}</div>
      )}

      {!latestTransaction && !loading && !error ? (
        <div style={styles.noTransaction}>
          No recent transaction data available.
          <br />
          Waiting for blockchain transactions...
        </div>
      ) : latestTransaction ? (
        <div style={styles.transactionGrid}>
          {/* Transaction Hash */}
          <div style={styles.transactionItem}>
            <span style={styles.label}>Transaction Hash</span>
            <span style={styles.value}>
              {latestTransaction.transactionHash}
            </span>
          </div>
          {/* Transaction Status */}
          <div style={styles.transactionItem}>
            <span style={styles.label}>Status</span>
            <span
              style={{
                ...styles.status,
                ...(latestTransaction.status ? styles.success : styles.failure),
              }}
            >
              {latestTransaction.status ? "Success" : "Failed"}
            </span>
          </div>
          {/* Block Number */}
          <div style={styles.transactionItem}>
            <span style={styles.label}>Block Number</span>
            <span style={styles.value}>#{latestTransaction.blockNumber}</span>
          </div>
          {/* Transaction Index */}
          {/* {latestTransaction.transactionIndex !== undefined && (
            <div style={styles.transactionItem}>
              <span style={styles.label}>Transaction Index</span>
              <span style={styles.value}>
                {latestTransaction.transactionIndex}
              </span>
            </div>
          )} */}
          {/* Transaction Type */}
          <div style={styles.transactionItem}>
            <span style={styles.label}>Transaction Type</span>
            <span style={styles.value}>
              {latestTransaction.transactionType === "contract_creation"
                ? "Contract Creation"
                : latestTransaction.transactionType === "contract_call"
                ? "Contract Call"
                : latestTransaction.transactionType === "ether_transfer"
                ? "Ether Transfer"
                : "Unknown"}
            </span>
          </div>
          {/* Nonce */}
          {latestTransaction.nonce !== undefined && (
            <div style={styles.transactionItem}>
              <span style={styles.label}>Nonce</span>
              <span style={styles.value}>{latestTransaction.nonce}</span>
            </div>
          )}
          {/* Gas Information */}
          <div style={styles.transactionItem}>
            <span style={styles.label}>Gas Used</span>
            <span style={styles.value}>
              {latestTransaction.gasUsed.toLocaleString()} gas
            </span>
          </div>
          <div style={styles.transactionItem}>
            <span style={styles.label}>Gas Price</span>
            <span style={styles.value}>
              {weiToEther(latestTransaction.gasPrice)} ETH
            </span>
          </div>
          {/* Transaction Cost */}
          <div style={styles.transactionItem}>
            <span style={styles.label}>Transaction Cost</span>
            <span style={styles.value}>
              {weiToEther(
                (
                  BigInt(latestTransaction.gasUsed) *
                  BigInt(latestTransaction.gasPrice)
                ).toString()
              )}{" "}
              ETH
            </span>
          </div>
          {/* From Address */}
          <div style={styles.transactionItem}>
            <span style={styles.label}>From</span>
            <span style={styles.value}>{latestTransaction.from}</span>
          </div>
          {/* To Address */}
          <div style={styles.transactionItem}>
            <span style={styles.label}>To (Contract)</span>
            <span style={styles.value}>
              {latestTransaction.to ? latestTransaction.to : "N/A"}
            </span>
          </div>
          {/* Value Transferred */}
          <div style={styles.transactionItem}>
            <span style={styles.label}>Value</span>
            <span style={styles.value}>
              {weiToEther(latestTransaction.value)} ETH
            </span>
          </div>
          {/* Logs/Events */}
          {latestTransaction.logs && latestTransaction.logs.length > 0 && (
            <div style={styles.transactionItem}>
              <span style={styles.label}>Events/Logs</span>
              <span style={styles.value}>
                {latestTransaction.logs.length} events emitted
              </span>
            </div>
          )}
          {/* Timestamp */}
          {latestTransaction.timestamp && (
            <div style={styles.transactionItem}>
              <span style={styles.label}>Timestamp</span>
              <span style={styles.value}>
                {new Date(latestTransaction.timestamp * 1000).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

/**
 * EXERCISE 2 PAGE - ETHER/WEI CONVERSION
 *
 * This page demonstrates interaction with the Exercice2 smart contract which:
 * - Converts Ether amounts to Wei (etherEnWei function)
 * - Converts Wei amounts to Ether (weiEnEther function)
 * - Both functions are pure (no state variables)
 *
 * CRYPTOCURRENCY CONVERSION CONCEPTS:
 * - 1 Ether = 10^18 Wei (1,000,000,000,000,000,000 Wei)
 * - Wei is the smallest unit of Ether (like cents to dollars)
 * - Pure functions: Don't access blockchain state, just compute
 * - Solidity's built-in unit conversions (1 ether = 10^18 wei)
 */

import React, { useState } from "react";
import { useWeb3 } from "../hooks/useWeb3";
import { Navigation } from "../components/Navigation";
import { BlockchainInfo } from "../components/BlockchainInfo";
import { TransactionDetails } from "../components/TransactionDetails";
import { callContractFunction } from "../utils/web3Utils";

// CSS styles (same as Exercise1)
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    color: "#fff",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "30px",
  },
  title: {
    fontSize: "2rem",
    color: "#4dabf7",
    marginBottom: "12px",
  },
  description: {
    color: "#adb5bd",
    fontSize: "1.1rem",
    lineHeight: "1.6",
  },
  section: {
    background: "#1a1a2e",
    border: "1px solid #16213e",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
  },
  sectionTitle: {
    color: "#51cf66",
    fontSize: "1.3rem",
    marginBottom: "16px",
    fontWeight: "bold",
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    color: "#74c0fc",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px",
    background: "#16213e",
    border: "1px solid #495057",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "14px",
  },
  button: {
    background: "#4dabf7",
    color: "#000",
    border: "none",
    borderRadius: "6px",
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginRight: "12px",
    marginBottom: "8px",
  },
  buttonDisabled: {
    background: "#495057",
    cursor: "not-allowed",
  },
  result: {
    background: "#16213e",
    border: "1px solid #495057",
    borderRadius: "6px",
    padding: "16px",
    marginTop: "16px",
  },
  resultTitle: {
    color: "#51cf66",
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  resultValue: {
    color: "#fff",
    fontSize: "18px",
    fontFamily: "monospace",
    fontWeight: "bold",
  },
  error: {
    background: "#ff8787",
    color: "#000",
    padding: "12px",
    borderRadius: "6px",
    marginTop: "16px",
  },
  contractInfo: {
    background: "#0c4a6e",
    border: "1px solid #075985",
    borderRadius: "6px",
    padding: "16px",
    marginBottom: "16px",
  },
  infoText: {
    color: "#bae6fd",
    fontSize: "14px",
    lineHeight: "1.5",
  },
};

export const Exercise2: React.FC = () => {
  // Get Web3 context and contract instances
  const { web3, contracts, isReady } = useWeb3();

  // Component state for form inputs
  const [etherAmount, setEtherAmount] = useState<string>("1");
  const [weiAmount, setWeiAmount] = useState<string>("1000000000000000000");

  // State for results
  const [etherToWeiResult, setEtherToWeiResult] = useState<string | null>(null);
  const [weiToEtherResult, setWeiToEtherResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get the Exercice2 contract instance
  const contract = contracts?.["Exercice2"]?.contract;

  /**
   * Convert Ether to Wei using smart contract
   * Calls etherEnWei() pure function
   */
  const convertEtherToWei = async () => {
    if (!contract || !web3 || !etherAmount) return;

    try {
      setLoading("etherToWei");
      setError(null);

      // Validate input
      const etherValue = parseFloat(etherAmount);
      if (isNaN(etherValue) || etherValue < 0) {
        setError("Please enter a valid positive number for Ether amount");
        return;
      }

      // Call the pure function - etherEnWei(uint montantEther)
      // The contract uses Solidity's built-in conversion: montantEther * 1 ether
      const result = await callContractFunction(contract, "etherEnWei", [
        Math.floor(etherValue),
      ]);

      setEtherToWeiResult(result.toString());
      console.log(
        `💱 Converted ${etherAmount} ETH to ${result.toString()} Wei`
      );
    } catch (err) {
      console.error("❌ Error converting Ether to Wei:", err);
      setError("Failed to convert Ether to Wei");
    } finally {
      setLoading(null);
    }
  };

  /**
   * Convert Wei to Ether using smart contract
   * Calls weiEnEther() pure function (if implemented)
   */
  const convertWeiToEther = async () => {
    if (!contract || !web3 || !weiAmount) return;

    try {
      setLoading("weiToEther");
      setError(null);

      // Validate input
      const weiValue = parseInt(weiAmount);
      if (isNaN(weiValue) || weiValue < 0) {
        setError("Please enter a valid positive number for Wei amount");
        return;
      }

      // Call the reverse conversion function (if it exists)
      const result = await callContractFunction(contract, "weiEnEther", [
        weiValue,
      ]);

      setWeiToEtherResult(result.toString());
      console.log(`💱 Converted ${weiAmount} Wei to ${result.toString()} ETH`);
    } catch (err) {
      console.error("❌ Error converting Wei to Ether:", err);
      setError("Failed to convert Wei to Ether (function might not exist)");
    } finally {
      setLoading(null);
    }
  };

  // Show loading state while connecting to blockchain
  if (!isReady) {
    return (
      <div style={styles.container}>
        <Navigation />
        <div style={styles.section}>
          <h2 style={styles.title}>🔄 Connexion à la blockchain...</h2>
          <p style={styles.description}>
            Chargement du contrat Exercice2. Assurez-vous que Ganache est
            démarré.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navigation />

      {/* Page Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>💱 Exercice 2 : Conversion Ether/Wei</h1>
        <p style={styles.description}>
          Conversion entre les unités de cryptomonnaie Ethereum.
          <br />
          <strong>1 Ether = 1,000,000,000,000,000,000 Wei (10^18)</strong>
        </p>
      </div>

      {/* Contract Information */}
      <div style={styles.contractInfo}>
        <h3 style={styles.sectionTitle}>📋 Informations du contrat</h3>
        <div style={styles.infoText}>
          <strong>Adresse du contrat:</strong>{" "}
          {contracts?.["Exercice2"]?.address}
          <br />
          <strong>Variables d'état:</strong> Aucune (toutes les fonctions sont
          pure)
          <br />
          <strong>Fonctions:</strong>
          <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
            <li>
              <code>etherEnWei(uint montantEther)</code> - Convertit Ether en
              Wei
            </li>
            <li>
              <code>weiEnEther(uint montantWei)</code> - Convertit Wei en Ether
            </li>
          </ul>
          <br />
          <strong>Concept:</strong> Wei est la plus petite unité d'Ether, comme
          les centimes pour les euros.
        </div>
      </div>

      {/* Ether to Wei Conversion */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🔄 Conversion Ether → Wei</h3>
        <p style={styles.infoText}>
          Convertit un montant en Ether vers son équivalent en Wei. Utilise la
          formule Solidity : <code>montantEther * 1 ether</code>
        </p>

        <div style={styles.formGroup}>
          <label style={styles.label}>Montant en Ether :</label>
          <input
            type="number"
            step="0.001"
            value={etherAmount}
            onChange={(e) => setEtherAmount(e.target.value)}
            style={styles.input}
            placeholder="Entrez le montant en Ether (ex: 1.5)"
          />
        </div>

        <button
          onClick={convertEtherToWei}
          style={{
            ...styles.button,
            ...(loading === "etherToWei" ? styles.buttonDisabled : {}),
          }}
          disabled={loading === "etherToWei"}
        >
          {loading === "etherToWei"
            ? "🔄 Conversion..."
            : `💱 Convertir ${etherAmount} ETH en Wei`}
        </button>

        {etherToWeiResult && (
          <div style={styles.result}>
            <div style={styles.resultTitle}>Résultat de la conversion :</div>
            <div style={styles.resultValue}>
              {etherAmount} ETH = {etherToWeiResult} Wei
            </div>
            <div
              style={{ ...styles.infoText, marginTop: "8px", fontSize: "12px" }}
            >
              Vérification : {parseInt(etherAmount) * Math.pow(10, 18)} Wei
              (calcul JavaScript)
            </div>
          </div>
        )}
      </div>

      {/* Wei to Ether Conversion */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🔄 Conversion Wei → Ether</h3>
        <p style={styles.infoText}>
          Convertit un montant en Wei vers son équivalent en Ether. Utilise la
          division : <code>montantWei / 1 ether</code>
        </p>

        <div style={styles.formGroup}>
          <label style={styles.label}>Montant en Wei :</label>
          <input
            type="number"
            value={weiAmount}
            onChange={(e) => setWeiAmount(e.target.value)}
            style={styles.input}
            placeholder="Entrez le montant en Wei (ex: 1000000000000000000)"
          />
        </div>

        <button
          onClick={convertWeiToEther}
          style={{
            ...styles.button,
            ...(loading === "weiToEther" ? styles.buttonDisabled : {}),
          }}
          disabled={loading === "weiToEther"}
        >
          {loading === "weiToEther"
            ? "🔄 Conversion..."
            : `💱 Convertir ${weiAmount} Wei en ETH`}
        </button>

        {weiToEtherResult && (
          <div style={styles.result}>
            <div style={styles.resultTitle}>Résultat de la conversion :</div>
            <div style={styles.resultValue}>
              {weiAmount} Wei = {weiToEtherResult} ETH
            </div>
            <div
              style={{ ...styles.infoText, marginTop: "8px", fontSize: "12px" }}
            >
              Vérification : {parseInt(weiAmount) / Math.pow(10, 18)} ETH
              (calcul JavaScript)
            </div>
          </div>
        )}
      </div>

      {/* Conversion Reference Table */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📊 Tableau de référence des unités</h3>
        <div style={styles.infoText}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #495057" }}>
                <th style={{ padding: "8px", textAlign: "left" }}>Unité</th>
                <th style={{ padding: "8px", textAlign: "left" }}>
                  Équivalent en Wei
                </th>
                <th style={{ padding: "8px", textAlign: "left" }}>
                  Utilisation
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "8px" }}>1 Wei</td>
                <td style={{ padding: "8px" }}>1</td>
                <td style={{ padding: "8px" }}>Plus petite unité</td>
              </tr>
              <tr>
                <td style={{ padding: "8px" }}>1 Gwei</td>
                <td style={{ padding: "8px" }}>1,000,000,000</td>
                <td style={{ padding: "8px" }}>Prix du gas</td>
              </tr>
              <tr>
                <td style={{ padding: "8px" }}>1 Ether</td>
                <td style={{ padding: "8px" }}>1,000,000,000,000,000,000</td>
                <td style={{ padding: "8px" }}>Unité principale</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Error Display */}
      {error && <div style={styles.error}>❌ Erreur : {error}</div>}

      {/* Blockchain Info Component */}
      <BlockchainInfo />

      {/* Transaction Details Component */}
      <TransactionDetails transaction={null} />
    </div>
  );
};

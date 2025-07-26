/**
 * EXERCISE 1 PAGE - ADDITION OPERATIONS
 *
 * This page demonstrates interaction with the Exercice1 smart contract which:
 * - Has two state variables (nombre1, nombre2)
 * - Provides addition1() view function (sums state variables)
 * - Provides addition2() pure function (sums parameters)
 *
 * SMART CONTRACT INTERACTION CONCEPTS:
 * - View functions: Read blockchain state without cost (no gas)
 * - Pure functions: Don't access state, just compute (no gas)
 * - State variables: Data stored permanently on blockchain
 * - Contract calls: JavaScript calling Solidity functions via Web3
 */

import React, { useState, useEffect } from "react";
import { useWeb3 } from "../hooks/useWeb3";
import { Navigation } from "../components/Navigation";
import { BlockchainInfo } from "../components/BlockchainInfo";
import { TransactionDetails } from "../components/TransactionDetails";
import { callContractFunction } from "../utils/web3Utils";

// CSS styles for the page
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

export const Exercise1: React.FC = () => {
  // Get Web3 context and contract instances
  const { web3, contracts, isReady } = useWeb3();

  // Component state for form inputs
  const [number1, setNumber1] = useState<string>("10");
  const [number2, setNumber2] = useState<string>("20");

  // State for results and blockchain data
  const [stateVariables, setStateVariables] = useState<{
    nombre1: string;
    nombre2: string;
  } | null>(null);
  const [addition1Result, setAddition1Result] = useState<string | null>(null);
  const [addition2Result, setAddition2Result] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get the Exercice1 contract instance
  const contract = contracts?.["Exercice1"]?.contract;

  /**
   * Load initial state variables from the smart contract
   * This demonstrates reading blockchain state via view functions
   */
  const loadStateVariables = async () => {
    if (!contract || !web3) return;

    try {
      setLoading("state");
      setError(null);

      // Call contract view functions to read state variables
      // These calls are free (no gas cost) because they only read data
      const nombre1Value = await callContractFunction(contract, "nombre1", []);
      const nombre2Value = await callContractFunction(contract, "nombre2", []);

      setStateVariables({
        nombre1: nombre1Value.toString(),
        nombre2: nombre2Value.toString(),
      });

      console.log("📖 State variables loaded:", { nombre1Value, nombre2Value });
    } catch (err) {
      console.error("❌ Error loading state variables:", err);
      setError("Failed to load contract state variables");
    } finally {
      setLoading(null);
    }
  };

  /**
   * Call addition1() - View function that sums state variables
   * This function reads the contract's state variables and returns their sum
   */
  const callAddition1 = async () => {
    if (!contract || !web3) return;

    try {
      setLoading("addition1");
      setError(null);

      // Call the view function - no gas cost, just reads blockchain state
      const result = await callContractFunction(contract, "addition1", []);

      setAddition1Result(result.toString());
      console.log("🧮 Addition1 result:", result.toString());
    } catch (err) {
      console.error("❌ Error calling addition1:", err);
      setError("Failed to call addition1 function");
    } finally {
      setLoading(null);
    }
  };

  /**
   * Call addition2() - Pure function that sums two parameters
   * This function doesn't access state, just computes with given parameters
   */
  const callAddition2 = async () => {
    if (!contract || !web3 || !number1 || !number2) return;

    try {
      setLoading("addition2");
      setError(null);

      // Convert string inputs to numbers for the contract call
      const num1 = parseInt(number1);
      const num2 = parseInt(number2);

      if (isNaN(num1) || isNaN(num2)) {
        setError("Please enter valid numbers");
        return;
      }

      // Call the pure function with parameters - no gas cost, pure computation
      const result = await callContractFunction(contract, "addition2", [
        num1,
        num2,
      ]);

      setAddition2Result(result.toString());
      console.log("🧮 Addition2 result:", result.toString());
    } catch (err) {
      console.error("❌ Error calling addition2:", err);
      setError("Failed to call addition2 function");
    } finally {
      setLoading(null);
    }
  };

  /**
   * Load contract data when component mounts or contract becomes available
   */
  useEffect(() => {
    const loadData = async () => {
      if (!contract || !web3) return;

      try {
        setLoading("state");
        setError(null);

        // Call contract view functions to read state variables
        const nombre1Value = await callContractFunction(
          contract,
          "nombre1",
          []
        );
        const nombre2Value = await callContractFunction(
          contract,
          "nombre2",
          []
        );

        setStateVariables({
          nombre1: nombre1Value.toString(),
          nombre2: nombre2Value.toString(),
        });

        console.log("📖 State variables loaded:", {
          nombre1Value,
          nombre2Value,
        });
      } catch (err) {
        console.error("❌ Error loading state variables:", err);
        setError("Failed to load contract state variables");
      } finally {
        setLoading(null);
      }
    };

    if (isReady && contract) {
      loadData();
    }
  }, [isReady, contract, web3]);

  // Show loading state while connecting to blockchain
  if (!isReady) {
    return (
      <div style={styles.container}>
        <Navigation />
        <div style={styles.section}>
          <h2 style={styles.title}>🔄 Connexion à la blockchain...</h2>
          <p style={styles.description}>
            Chargement du contrat Exercice1. Assurez-vous que Ganache est
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
        <h1 style={styles.title}>🧮 Exercice 1 : Addition de nombres</h1>
        <p style={styles.description}>
          Interaction avec un contrat qui stocke deux nombres et fournit des
          fonctions d'addition.
          <br />
          <strong>Fonctions disponibles :</strong> addition1() [view] et
          addition2() [pure]
        </p>
      </div>

      {/* Contract Information */}
      <div style={styles.contractInfo}>
        <h3 style={styles.sectionTitle}>📋 Informations du contrat</h3>
        <div style={styles.infoText}>
          <strong>Adresse du contrat:</strong>{" "}
          {contracts?.["Exercice1"]?.address}
          <br />
          <strong>Variables d'état:</strong> nombre1 et nombre2 (initialisées
          lors du déploiement)
          <br />
          <strong>Fonctions:</strong>
          <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
            <li>
              <code>addition1()</code> - Fonction view : retourne nombre1 +
              nombre2
            </li>
            <li>
              <code>addition2(uint a, uint b)</code> - Fonction pure : retourne
              a + b
            </li>
          </ul>
        </div>
      </div>

      {/* State Variables Section */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📊 Variables d'état du contrat</h3>
        <p style={styles.infoText}>
          Ces valeurs sont stockées de façon permanente sur la blockchain lors
          du déploiement.
        </p>

        <button
          onClick={loadStateVariables}
          style={{
            ...styles.button,
            ...(loading === "state" ? styles.buttonDisabled : {}),
          }}
          disabled={loading === "state"}
        >
          {loading === "state"
            ? "🔄 Chargement..."
            : "📖 Lire les variables d'état"}
        </button>

        {stateVariables && (
          <div style={styles.result}>
            <div style={styles.resultTitle}>Variables d'état actuelles :</div>
            <div style={styles.resultValue}>
              nombre1 = {stateVariables.nombre1}
              <br />
              nombre2 = {stateVariables.nombre2}
            </div>
          </div>
        )}
      </div>

      {/* Addition1 Section - View Function */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🔍 Fonction addition1() [VIEW]</h3>
        <p style={styles.infoText}>
          Cette fonction lit les variables d'état du contrat et retourne leur
          somme. Aucun coût en gas car elle ne modifie pas l'état de la
          blockchain.
        </p>

        <button
          onClick={callAddition1}
          style={{
            ...styles.button,
            ...(loading === "addition1" ? styles.buttonDisabled : {}),
          }}
          disabled={loading === "addition1"}
        >
          {loading === "addition1" ? "🔄 Calcul..." : "🧮 Calculer addition1()"}
        </button>

        {addition1Result && (
          <div style={styles.result}>
            <div style={styles.resultTitle}>Résultat de addition1() :</div>
            <div style={styles.resultValue}>{addition1Result}</div>
          </div>
        )}
      </div>

      {/* Addition2 Section - Pure Function */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>⚡ Fonction addition2() [PURE]</h3>
        <p style={styles.infoText}>
          Cette fonction prend deux paramètres et retourne leur somme. Elle
          n'accède pas aux variables d'état, c'est une fonction pure.
        </p>

        <div style={styles.formGroup}>
          <label style={styles.label}>Premier nombre (a) :</label>
          <input
            type="number"
            value={number1}
            onChange={(e) => setNumber1(e.target.value)}
            style={styles.input}
            placeholder="Entrez le premier nombre"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Deuxième nombre (b) :</label>
          <input
            type="number"
            value={number2}
            onChange={(e) => setNumber2(e.target.value)}
            style={styles.input}
            placeholder="Entrez le deuxième nombre"
          />
        </div>

        <button
          onClick={callAddition2}
          style={{
            ...styles.button,
            ...(loading === "addition2" ? styles.buttonDisabled : {}),
          }}
          disabled={loading === "addition2"}
        >
          {loading === "addition2"
            ? "🔄 Calcul..."
            : `🧮 Calculer ${number1} + ${number2}`}
        </button>

        {addition2Result && (
          <div style={styles.result}>
            <div style={styles.resultTitle}>
              Résultat de addition2({number1}, {number2}) :
            </div>
            <div style={styles.resultValue}>{addition2Result}</div>
          </div>
        )}
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

import React, { useState, useEffect } from "react";
import { useWeb3 } from "../hooks/useWeb3";
import { Navigation } from "../components/Navigation";
import { BlockchainInfo } from "../components/BlockchainInfo";
import { TransactionDetails } from "../components/TransactionDetails";
import {
  callContractFunction,
  sendContractTransaction,
} from "../utils/web3Utils";

// CSS styles (reusing the same styles)
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    color: "#fff",
  },
  header: { textAlign: "center" as const, marginBottom: "30px" },
  title: { fontSize: "2rem", color: "#4dabf7", marginBottom: "12px" },
  description: { color: "#adb5bd", fontSize: "1.1rem", lineHeight: "1.6" },
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
  formGroup: { marginBottom: "16px" },
  label: {
    display: "block",
    color: "#74c0fc",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  input: {
    width: "50%",
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
  buttonDisabled: { background: "#495057", cursor: "not-allowed" },
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
  infoText: { color: "#bae6fd", fontSize: "14px", lineHeight: "1.5" },
};

export const Exercise3: React.FC = () => {
  const { currentAccount, contracts, isReady } = useWeb3();

  // Form states
  const [newMessage, setNewMessage] = useState<string>("");
  const [string1, setString1] = useState<string>("Hello");
  const [string2, setString2] = useState<string>("World");
  const [stringToCheck, setStringToCheck] = useState<string>("Test");
  const [compareString1, setCompareString1] = useState<string>("Hello");
  const [compareString2, setCompareString2] = useState<string>("Hello");

  // Results states
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [concatenateResult, setConcatenateResult] = useState<string>("");
  const [concatenateWithResult, setConcatenateWithResult] =
    useState<string>("");
  const [lengthResult, setLengthResult] = useState<string>("");
  const [compareResult, setCompareResult] = useState<string>("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const contract = contracts?.["Exercice3"]?.contract;
  const contractAddress = contracts?.["Exercice3"]?.address;

  // Load current message
  const getMessage = async () => {
    if (!contract) return;
    try {
      setLoading("getMessage");
      const result = await callContractFunction(contract, "getMessage", []);
      setCurrentMessage(result.toString());
    } catch {
      setError("Failed to get message");
    } finally {
      setLoading(null);
    }
  };

  // Set new message
  const setMessage = async () => {
    if (!contract || !currentAccount || !newMessage) return;
    try {
      setLoading("setMessage");
      setError(null);
      await sendContractTransaction(
        contract,
        "setMessage",
        [newMessage],
        currentAccount
      );
      await getMessage(); // Refresh current message
    } catch {
      setError("Failed to set message");
    } finally {
      setLoading(null);
    }
  };

  // Concatenate two strings
  const concatenateStrings = async () => {
    if (!contract || !string1 || !string2) return;
    try {
      setLoading("concatenate");
      const result = await callContractFunction(contract, "concatener", [
        string1,
        string2,
      ]);
      setConcatenateResult(result.toString());
    } catch {
      setError("Failed to concatenate strings");
    } finally {
      setLoading(null);
    }
  };

  // Concatenate with message
  const concatenateWith = async () => {
    if (!contract || !string1) return;
    try {
      setLoading("concatenateWith");
      const result = await callContractFunction(contract, "concatenerAvec", [
        string1,
      ]);
      setConcatenateWithResult(result.toString());
    } catch {
      setError("Failed to concatenate with message");
    } finally {
      setLoading(null);
    }
  };

  // Get string length
  const getLength = async () => {
    if (!contract || !stringToCheck) return;
    try {
      setLoading("length");
      const result = await callContractFunction(contract, "longueur", [
        stringToCheck,
      ]);
      setLengthResult(result.toString());
    } catch {
      setError("Failed to get string length");
    } finally {
      setLoading(null);
    }
  };

  // Compare strings
  const compareStrings = async () => {
    if (!contract || !compareString1 || !compareString2) return;
    try {
      setLoading("compare");
      const result = await callContractFunction(contract, "comparer", [
        compareString1,
        compareString2,
      ]);
      setCompareResult(result.toString());
    } catch {
      setError("Failed to compare strings");
    } finally {
      setLoading(null);
    }
  };

  useEffect(() => {
    if (isReady && contract) {
      getMessage();
    }
  }, [isReady, contract]);

  if (!isReady) {
    return (
      <div style={styles.container}>
        <Navigation />
        <div style={styles.section}>
          <h2 style={styles.title}>Connexion à la blockchain...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Navigation />

      <div style={styles.header}>
        <h1 style={styles.title}>Exercice 3 : Gestion des chaînes</h1>
        <p style={styles.description}>
          Manipulation de chaînes de caractères avec Solidity : stockage,
          modification, concaténation, longueur et comparaison.
        </p>
      </div>

      {/* Current Message */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Message actuel</h3>

        {currentMessage && (
          <div style={styles.result}>
            <div style={styles.resultValue}>"{currentMessage}"</div>
          </div>
        )}
      </div>

      {/* Set Message */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Modifier le message</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>Nouveau message :</label>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={styles.input}
            placeholder="Entrez un nouveau message"
          />
        </div>
        <button
          onClick={setMessage}
          style={styles.button}
          disabled={loading === "setMessage" || !newMessage}
        >
          {loading === "setMessage" ? "Modification..." : "Modifier le message"}
        </button>
      </div>

      {/* Concatenate Strings */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Concaténation de chaînes</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>Première chaîne :</label>
          <input
            value={string1}
            onChange={(e) => setString1(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Deuxième chaîne :</label>
          <input
            value={string2}
            onChange={(e) => setString2(e.target.value)}
            style={styles.input}
          />
        </div>
        <button
          onClick={concatenateStrings}
          style={styles.button}
          disabled={loading === "concatenate"}
        >
          {loading === "concatenate" ? "Concaténation..." : "Concaténer"}
        </button>
        {concatenateResult && (
          <div style={styles.result}>
            <div style={styles.resultTitle}>Résultat :</div>
            <div style={styles.resultValue}>"{concatenateResult}"</div>
          </div>
        )}
      </div>

      {/* Concatenate with Message */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Concaténer avec le message</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>Chaîne à ajouter :</label>
          <input
            value={string1}
            onChange={(e) => setString1(e.target.value)}
            style={styles.input}
          />
        </div>
        <button
          onClick={concatenateWith}
          style={styles.button}
          disabled={loading === "concatenateWith"}
        >
          {loading === "concatenateWith"
            ? "Concaténation..."
            : "Concaténer avec message"}
        </button>
        {concatenateWithResult && (
          <div style={styles.result}>
            <div style={styles.resultTitle}>Résultat :</div>
            <div style={styles.resultValue}>"{concatenateWithResult}"</div>
          </div>
        )}
      </div>

      {/* String Length */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Longueur de chaîne</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>Chaîne à mesurer :</label>
          <input
            value={stringToCheck}
            onChange={(e) => setStringToCheck(e.target.value)}
            style={styles.input}
          />
        </div>
        <button
          onClick={getLength}
          style={styles.button}
          disabled={loading === "length"}
        >
          {loading === "length" ? "Calcul..." : "Calculer longueur"}
        </button>
        {lengthResult && (
          <div style={styles.result}>
            <div style={styles.resultTitle}>Longueur :</div>
            <div style={styles.resultValue}>{lengthResult} caractères</div>
          </div>
        )}
      </div>

      {/* Compare Strings */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Comparaison de chaînes</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>Première chaîne :</label>
          <input
            value={compareString1}
            onChange={(e) => setCompareString1(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Deuxième chaîne :</label>
          <input
            value={compareString2}
            onChange={(e) => setCompareString2(e.target.value)}
            style={styles.input}
          />
        </div>
        <button
          onClick={compareStrings}
          style={styles.button}
          disabled={loading === "compare"}
        >
          {loading === "compare" ? "Comparaison..." : "Comparer"}
        </button>
        {compareResult && (
          <div style={styles.result}>
            <div style={styles.resultTitle}>Résultat :</div>
            <div style={styles.resultValue}>
              {compareResult === "true" ? "Identiques" : "Différentes"}
            </div>
          </div>
        )}
      </div>

      {error && <div style={styles.error}>Erreur : {error}</div>}

      <BlockchainInfo contractAddress={contractAddress} />
      <TransactionDetails />
    </div>
  );
};

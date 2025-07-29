import React, { useState } from "react";
import { useWeb3 } from "../hooks/useWeb3";
import { Navigation } from "../components/Navigation";
import { BlockchainInfo } from "../components/BlockchainInfo";
import { TransactionDetails } from "../components/TransactionDetails";
import { callContractFunction } from "../utils/web3Utils";

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    color: "#fff",
  },
  header: { textAlign: "center" as const, marginBottom: "30px" },
  title: { fontSize: "2rem", color: "#4dabf7", marginBottom: "12px" },
  formGroup: {
    marginBottom: "16px",
  },
  section: {
    background: "#1a1a2e",
    border: "1px solid #16213e",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
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
    marginTop: "12px",
  },
  result: {
    background: "#16213e",
    border: "1px solid #495057",
    borderRadius: "6px",
    padding: "16px",
    marginTop: "16px",
    color: "#fff",
    fontFamily: "monospace",
  },
};

export const Exercise4: React.FC = () => {
  const { contracts, isReady } = useWeb3();
  const [number, setNumber] = useState<string>("5");
  const [result, setResult] = useState<string>("");

  const contract = contracts?.["Exercice4"]?.contract;
  const contractAddress = contracts?.["Exercice4"]?.address;

  const checkPositive = async () => {
    if (!contract || !number) return;
    try {
      const res = await callContractFunction(contract, "estPositif", [
        parseInt(number),
      ]);
      setResult(res.toString() === "true" ? "Positif" : "Négatif");
    } catch {
      setResult("Erreur");
    }
  };

  if (!isReady)
    return (
      <div style={styles.container}>
        <Navigation />
        <p>Chargement...</p>
      </div>
    );

  return (
    <div style={styles.container}>
      <Navigation />
      <div style={styles.header}>
        <h1 style={styles.title}>Exercice 4 : Vérification si positif</h1>
      </div>
      <div style={styles.section}>
        <div style={styles.formGroup}>
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            style={styles.input}
            placeholder="Entrez un nombre"
          />
        </div>
        <button onClick={checkPositive} style={styles.button}>
          Vérifier
        </button>
        {result && <div style={styles.result}>Résultat: {result}</div>}
      </div>
      <BlockchainInfo contractAddress={contractAddress} />
      <TransactionDetails />
    </div>
  );
};

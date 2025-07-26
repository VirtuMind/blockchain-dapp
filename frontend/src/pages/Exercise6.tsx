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
  section: {
    background: "#1a1a2e",
    border: "1px solid #16213e",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
  },
  input: {
    width: "100%",
    padding: "12px",
    background: "#16213e",
    border: "1px solid #495057",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "14px",
    marginBottom: "12px",
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

export const Exercise6: React.FC = () => {
  const { contracts, isReady } = useWeb3();
  const [index, setIndex] = useState<string>("0");
  const [result, setResult] = useState<string>("");

  const contract = contracts?.["Exercice6"]?.contract;

  const getNumbers = async () => {
    if (!contract) return;
    try {
      const res = await callContractFunction(contract, "getNombres", []);
      setResult("Nombres: " + res.toString());
    } catch {
      setResult("Erreur lors de la récupération");
    }
  };

  const getSum = async () => {
    if (!contract) return;
    try {
      const res = await callContractFunction(contract, "getSomme", []);
      setResult("Somme: " + res.toString());
    } catch {
      setResult("Erreur lors du calcul");
    }
  };

  const getNumber = async () => {
    if (!contract || !index) return;
    try {
      const res = await callContractFunction(contract, "getNombre", [
        parseInt(index),
      ]);
      setResult(`Nombre à l'index ${index}: ${res.toString()}`);
    } catch {
      setResult("Index invalide");
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
        <h1 style={styles.title}>Exercice 6 : Opérations sur tableaux</h1>
      </div>
      <div style={styles.section}>
        <p>Contrat: {contracts?.["Exercice6"]?.address}</p>

        <button onClick={getNumbers} style={styles.button}>
          Voir tous les nombres
        </button>

        <button onClick={getSum} style={styles.button}>
          ➕ Calculer somme
        </button>

        <div style={{ marginTop: "16px" }}>
          <input
            type="number"
            value={index}
            onChange={(e) => setIndex(e.target.value)}
            style={styles.input}
            placeholder="Index à consulter"
          />
          <button onClick={getNumber} style={styles.button}>
            Obtenir nombre par index
          </button>
        </div>

        {result && <div style={styles.result}>{result}</div>}
      </div>
      <BlockchainInfo />
      <TransactionDetails transaction={null} />
    </div>
  );
};

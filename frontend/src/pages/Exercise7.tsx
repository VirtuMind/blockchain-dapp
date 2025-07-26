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

export const Exercise7: React.FC = () => {
  const { contracts, isReady } = useWeb3();
  const [result, setResult] = useState<string>("");

  const contract = contracts?.["Exercice7"]?.contract;

  const getPosition = async () => {
    if (!contract) return;
    try {
      const x = await callContractFunction(contract, "getX", []);
      const y = await callContractFunction(contract, "getY", []);
      setResult(`Position: (${x}, ${y})`);
    } catch {
      setResult("Erreur");
    }
  };

  const getDimensions = async () => {
    if (!contract) return;
    try {
      const longueur = await callContractFunction(contract, "getLongueur", []);
      const largeur = await callContractFunction(contract, "getLargeur", []);
      setResult(`Dimensions: ${longueur} x ${largeur}`);
    } catch {
      setResult("Erreur");
    }
  };

  const calculateArea = async () => {
    if (!contract) return;
    try {
      const aire = await callContractFunction(contract, "calculerAire", []);
      setResult(`Aire: ${aire} unités²`);
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
        <h1 style={styles.title}>🔷 Exercice 7 : Rectangle (Héritage)</h1>
      </div>
      <div style={styles.section}>
        <p>Contrat Exercice7: {contracts?.["Exercice7"]?.address}</p>
        <p>Hérite du contrat abstrait Forme</p>

        <button onClick={getPosition} style={styles.button}>
          📍 Position
        </button>

        <button onClick={getDimensions} style={styles.button}>
          Dimensions
        </button>

        <button onClick={calculateArea} style={styles.button}>
          📐 Calculer aire
        </button>

        {result && <div style={styles.result}>{result}</div>}
      </div>
      <BlockchainInfo />
      <TransactionDetails transaction={null} />
    </div>
  );
};

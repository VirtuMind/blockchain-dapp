import React, { useState } from "react";
import { useWeb3 } from "../hooks/useWeb3";
import { Navigation } from "../components/Navigation";
import { BlockchainInfo } from "../components/BlockchainInfo";
import { TransactionDetails } from "../components/TransactionDetails";
import {
  callContractFunction,
  sendContractTransaction,
} from "../utils/web3Utils";

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    color: "#fff",
  },
  header: { textAlign: "center" as const, marginBottom: "30px" },
  title: { fontSize: "2rem", color: "#4dabf7", marginBottom: "12px" },
  resultTitle: {
    color: "#51cf66",
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "8px",
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
  const { contracts, isReady, currentAccount } = useWeb3();
  const [result, setResult] = useState<string>("");
  const [deplacerFormeResult, setDeplacerFormeResult] = useState<string>("");
  const [xValue, setXValue] = useState<string>("0");
  const [yValue, setYValue] = useState<string>("0");

  const contract = contracts?.["Rectangle"]?.contract;
  const contractAddress = contracts?.["Rectangle"]?.address;

  const getPosition = async () => {
    if (!contract) return;
    try {
      const res = await callContractFunction(contract, "afficheXY", []);
      setResult(`Position: (${res[0]}, ${res[1]})`);
    } catch {
      setResult("Erreur");
    }
  };

  const getInfo = async () => {
    if (!contract) return;
    try {
      const res = await callContractFunction(contract, "afficheInfos", []);
      setResult(res);
    } catch {
      setResult("Erreur");
    }
  };

  const getLoLa = async () => {
    if (!contract) return;
    try {
      const res = await callContractFunction(contract, "afficheLoLa", []);
      setResult(`Longueur: ${res[0]}, Largeur: ${res[1]}`);
    } catch {
      setResult("Erreur");
    }
  };

  const getSurface = async () => {
    if (!contract) return;
    try {
      const res = await callContractFunction(contract, "surface", []);
      setResult(`Surface: ${res}`);
    } catch {
      setResult("Erreur");
    }
  };

  const deplacerForme = async () => {
    if (!contract || !xValue || !yValue) return;
    try {
      const res = await sendContractTransaction(
        contract,
        "deplacerForme",
        [parseInt(xValue), parseInt(yValue)],
        currentAccount
      );
      console.log("Transaction sent:", res);
      setDeplacerFormeResult("Position changée avec succès");
    } catch {
      setDeplacerFormeResult("Erreur");
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
        <h1 style={styles.title}>Exercice 7 : POO</h1>
      </div>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Rectangle : Forme</h3>
        <div style={styles.formGroup}>
          {result && <div style={styles.result}>{result}</div>}
        </div>

        <button onClick={getPosition} style={styles.button}>
          Position
        </button>
        <button onClick={getSurface} style={styles.button}>
          Surface
        </button>
        <button onClick={getLoLa} style={styles.button}>
          Longueur & Largeur
        </button>

        <button onClick={getInfo} style={styles.button}>
          Info
        </button>
      </div>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Déplacer Rectangle</h3>

        <div style={styles.formGroup}>
          <label style={styles.label}> dx :</label>
          <input
            type="number"
            value={xValue}
            onChange={(e) => setXValue(e.target.value)}
            style={styles.input}
            placeholder="Entrez le premier nombre"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}> dy :</label>
          <input
            type="number"
            value={yValue}
            onChange={(e) => setYValue(e.target.value)}
            style={styles.input}
            placeholder="Entrez le deuxième nombre"
          />
        </div>

        <button onClick={deplacerForme} style={styles.button}>
          Déplacer
        </button>

        {deplacerFormeResult && (
          <div style={styles.result}>
            <div style={styles.resultTitle}>{deplacerFormeResult}</div>
          </div>
        )}
      </div>

      <BlockchainInfo contractAddress={contractAddress} />
      <TransactionDetails />
    </div>
  );
};

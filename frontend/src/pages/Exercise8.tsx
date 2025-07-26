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

export const Exercise8: React.FC = () => {
  const { contracts, currentAccount, isReady } = useWeb3();
  const [amount, setAmount] = useState<string>("0.1");
  const [result, setResult] = useState<string>("");

  const contract = contracts?.["Exercice8"]?.contract;

  const getBalance = async () => {
    if (!contract) return;
    try {
      const balance = await callContractFunction(contract, "getBalance", []);
      setResult(`Solde du contrat: ${balance} Wei`);
    } catch {
      setResult("Erreur");
    }
  };

  const deposit = async () => {
    if (!contract || !currentAccount || !amount) return;
    try {
      const weiAmount = parseFloat(amount) * Math.pow(10, 18);
      const result = await sendContractTransaction(
        contract,
        "deposit",
        [],
        currentAccount,
        weiAmount
      );
      setResult(`Dépôt effectué! Hash: ${result.transactionHash}`);
    } catch {
      setResult("Erreur lors du dépôt");
    }
  };

  const withdraw = async () => {
    if (!contract || !currentAccount || !amount) return;
    try {
      const weiAmount = parseFloat(amount) * Math.pow(10, 18);
      const result = await sendContractTransaction(
        contract,
        "withdraw",
        [weiAmount],
        currentAccount
      );
      setResult(`Retrait effectué! Hash: ${result.transactionHash}`);
    } catch {
      setResult("Erreur lors du retrait");
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
        <h1 style={styles.title}>💳 Exercice 8 : Contrat de paiement</h1>
      </div>
      <div style={styles.section}>
        <p>Contrat: {contracts?.["Exercice8"]?.address}</p>
        <p>Compte connecté: {currentAccount}</p>

        <button onClick={getBalance} style={styles.button}>
          Voir solde
        </button>

        <div style={{ marginTop: "16px" }}>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
            placeholder="Montant en ETH"
          />

          <button onClick={deposit} style={styles.button}>
            📥 Déposer
          </button>

          <button onClick={withdraw} style={styles.button}>
            📤 Retirer
          </button>
        </div>

        {result && <div style={styles.result}>{result}</div>}
      </div>
      <BlockchainInfo />
      <TransactionDetails transaction={null} />
    </div>
  );
};

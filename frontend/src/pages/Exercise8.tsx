import React, { use, useEffect, useState } from "react";
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
  infoText: {
    color: "#bae6fd",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  section: {
    background: "#1a1a2e",
    border: "1px solid #16213e",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
  },
  label: {
    display: "block",
    color: "#f7b34d",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  input: {
    width: "40%",
    padding: "12px",
    background: "#16213e",
    border: "1px solid #495057",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "14px",
    marginBottom: "12px",
  },
  depositButton: {
    background: "#f75b4d",
    color: "#000",
    border: "none",
    borderRadius: "6px",
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginRight: "12px",
  },
  withdrawButton: {
    background: "#51cf66",
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
  const [amount, setAmount] = useState<string>("1");
  const [result, setResult] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");

  const contract = contracts?.["Payment"]?.contract;
  const contractAddress = contracts?.["Payment"]?.address;

  const deposit = async () => {
    if (!contract || !currentAccount || !amount) return;
    try {
      const weiAmount = parseFloat(amount) * Math.pow(10, 18);
      const result = await sendContractTransaction(
        contract,
        "receivePayment",
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
  useEffect(() => {
    const getRecipient = async () => {
      if (!contract) return;
      try {
        const recipient = await callContractFunction(
          contract,
          "getRecipient",
          []
        );
        setRecipientAddress(recipient);
      } catch {
        setRecipientAddress("Erreur lors de la récupération de l'adresse");
      }
    };
    getRecipient();
  }, [contract]);

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
        <h1 style={styles.title}>Exercice 8 : Contrat de paiement</h1>
      </div>
      <div style={styles.section}>
        <div style={{ marginTop: "16px" }}>
          <label style={styles.label}> l'addresse du recepteur est :</label>
          <p style={styles.infoText}>{recipientAddress}</p>
          <input
            type="number"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
            placeholder="Montant en ETH"
          />
          <span style={{ color: "#fff", marginLeft: "8px" }}>
            {/* Display ETH unit */}
            ETH
          </span>
        </div>
        <button onClick={deposit} style={styles.depositButton}>
          Déposer
        </button>

        <button onClick={withdraw} style={styles.withdrawButton}>
          Retirer
        </button>

        {result && <div style={styles.result}>{result}</div>}
      </div>
      <BlockchainInfo contractAddress={contractAddress} />
      <TransactionDetails />
    </div>
  );
};

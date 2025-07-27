import React, { useEffect, useState } from "react";
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
  sectionTitle: {
    color: "#51cf66",
    fontSize: "1.3rem",
    marginBottom: "16px",
    fontWeight: "bold",
  },
  formGroup: {
    marginBottom: "16px",
  },
  infoText: {
    color: "#bae6fd",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  input: {
    width: "50%",
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
  const { contracts, isReady, currentAccount } = useWeb3();
  const [array, setArray] = useState<number[]>([]);
  const [index, setIndex] = useState<string>("0");
  const [sum, setSum] = useState<string>("Clicker pour calculer");
  const [number, setNumber] = useState<string>("");
  const [addResult, setAddResult] = useState<string>("");
  const [getResult, setGetResult] = useState<string>("");

  const contract = contracts?.["Exercice6"]?.contract;
  const contractAddress = contracts?.["Exercice6"]?.address;

  useEffect(() => {
    if (!contract) return;
    const fetchTableau = async () => {
      const res = await callContractFunction(contract, "afficheTableau", []);
      setArray(res);
    };
    fetchTableau();
  }, [contract, addResult]);

  const getSum = async () => {
    if (!contract || !index) return;
    try {
      const res = await callContractFunction(contract, "calculerSomme", [
        parseInt(index),
      ]);
      setSum(`La somme: ${res.toString()}`);
    } catch {
      setSum("Erreur");
    }
  };

  const ajouterNombre = async () => {
    if (!contract || !number) return;
    try {
      console.log("Ajout du nombre:", number);
      await sendContractTransaction(
        contract,
        "ajouterNombre",
        [parseInt(number)],
        currentAccount
      );
      setAddResult(`Nombre ajouté: ${number}`); // Reset input after adding
    } catch {
      setAddResult("Erreur lors de l'ajout du nombre");
    }
  };

  const getElement = async () => {
    if (!contract || !index) return;
    try {
      const res = await callContractFunction(contract, "getElement", [
        parseInt(index),
      ]);
      setGetResult(`Élément à l'index ${index} est ${res.toString()}`);
    } catch (err) {
      setGetResult(err.message);
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
        <div style={styles.sectionTitle}>Tableau de Nombres</div>
        <div style={styles.result}>{array.join(", ")}</div>
      </div>
      {/* LA SOMME */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Calculer la somme</h3>

        <div style={styles.formGroup}>
          <div style={styles.result}>{sum}</div>
        </div>
        <button onClick={getSum} style={styles.button}>
          Calculer
        </button>
      </div>
      {/* Ajouter un nombre */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Ajouter un nombre</h3>
        <div style={styles.formGroup}>
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            style={styles.input}
            placeholder="Entrez un nombre"
          />
        </div>

        {addResult && <p style={styles.infoText}>{addResult}</p>}

        <button onClick={ajouterNombre} style={styles.button}>
          Ajouter
        </button>
      </div>

      {/* Get element */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Recupérer un élément</h3>
        <div style={styles.formGroup}>
          <input
            type="number"
            value={index}
            onChange={(e) => setIndex(e.target.value)}
            style={styles.input}
            placeholder="Entrez un index"
          />
        </div>
        {getResult && <p style={styles.infoText}>{getResult}</p>}
        <button onClick={getElement} style={styles.button}>
          Récupérer
        </button>
      </div>

      <BlockchainInfo contractAddress={contractAddress} />
      <TransactionDetails />
    </div>
  );
};

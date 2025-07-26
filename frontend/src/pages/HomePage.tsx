/**
 * HOME PAGE COMPONENT
 *
 * This is the main landing page of the dApp that displays:
 * - Welcome message and project description
 * - Menu with 8 links to different exercise pages
 * - Blockchain connection status
 * - Overview of all available exercises
 *
 * As specified in the requirements, this page serves as the main navigation hub
 */

import React from "react";
import { Link } from "react-router-dom";
import { useWeb3 } from "../hooks/useWeb3";
import { BlockchainInfo } from "../components/BlockchainInfo";

// CSS styles for the home page
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    color: "#fff",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "40px",
  },
  title: {
    fontSize: "2.5rem",
    color: "#4dabf7",
    marginBottom: "16px",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#74c0fc",
    marginBottom: "24px",
  },
  description: {
    fontSize: "1rem",
    color: "#ced4da",
    lineHeight: "1.6",
    maxWidth: "800px",
    margin: "0 auto",
  },
  exerciseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },
  exerciseCard: {
    background: "#1a1a2e",
    border: "1px solid #16213e",
    borderRadius: "12px",
    padding: "24px",
    transition: "all 0.3s ease",
    textDecoration: "none",
    color: "inherit",
    display: "block",
  },
  exerciseCardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 25px rgba(74, 171, 247, 0.2)",
    borderColor: "#4dabf7",
  },
  exerciseNumber: {
    background: "#4dabf7",
    color: "#000",
    fontSize: "14px",
    fontWeight: "bold",
    padding: "4px 12px",
    borderRadius: "20px",
    display: "inline-block",
    marginBottom: "12px",
  },
  exerciseTitle: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: "8px",
  },
  exerciseDescription: {
    color: "#adb5bd",
    fontSize: "0.95rem",
    lineHeight: "1.5",
  },
  statusSection: {
    background: "#16213e",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "40px",
  },
  statusTitle: {
    color: "#51cf66",
    fontSize: "1.5rem",
    marginBottom: "16px",
    fontWeight: "bold",
  },
  statusText: {
    color: "#ced4da",
    fontSize: "1rem",
    lineHeight: "1.6",
  },
  errorText: {
    color: "#ff6b6b",
  },
  loadingText: {
    color: "#ffd43b",
  },
};

// Exercise data with descriptions matching the project requirements
const exercises = [
  {
    id: 1,
    title: "Addition de nombres",
    description:
      "Contrat avec deux variables d'état et fonctions pour calculer la somme. Fonctions view et pure.",
    path: "/exercise1",
  },
  {
    id: 2,
    title: "Conversion Ether/Wei",
    description:
      "Convertisseur de cryptomonnaies entre Ether et Wei. Fonctions de conversion bidirectionnelle.",
    path: "/exercise2",
  },
  {
    id: 3,
    title: "Gestion des chaînes",
    description:
      "Manipulation de chaînes de caractères : modification, concaténation, longueur et comparaison.",
    path: "/exercise3",
  },
  {
    id: 4,
    title: "Vérification positive",
    description:
      "Fonction pour vérifier si un nombre est positif. Retourne un booléen.",
    path: "/exercise4",
  },
  {
    id: 5,
    title: "Vérification parité",
    description:
      "Contrat intelligent pour vérifier la parité d'un nombre entier (pair ou impair).",
    path: "/exercise5",
  },
  {
    id: 6,
    title: "Opérations sur tableaux",
    description:
      "Stockage et manipulation d'une liste de nombres avec calcul de somme et gestion des éléments.",
    path: "/exercise6",
  },
  {
    id: 7,
    title: "Formes géométriques",
    description:
      "Programmation orientée objet avec contrat abstrait Forme et implémentation Rectangle.",
    path: "/exercise7",
  },
  {
    id: 8,
    title: "Contrat de paiement",
    description:
      "Système de paiement avec gestion des transactions et des soldes entre adresses.",
    path: "/exercise8",
  },
];

export const HomePage: React.FC = () => {
  const { isConnected, loading, error, hasContracts } = useWeb3();

  // Handle mouse hover effects
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    Object.assign(target.style, {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 25px rgba(74, 171, 247, 0.2)",
      borderColor: "#4dabf7",
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    Object.assign(target.style, {
      transform: "translateY(0)",
      boxShadow: "none",
      borderColor: "#16213e",
    });
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <h1 style={styles.title}>🚀 Application Décentralisée</h1>
        <h2 style={styles.subtitle}>TP 3 : Bases du langage Solidity</h2>
        <p style={styles.description}>
          Cette application décentralisée (dApp) vous permet d'interagir avec 8
          contrats intelligents développés en Solidity. Chaque exercice explore
          différents concepts blockchain : variables d'état, fonctions
          view/pure, gestion des chaînes, tableaux, programmation orientée
          objet, et systèmes de paiement. Utilisez Ganache pour le développement
          local et MetaMask pour les interactions.
        </p>
      </div>

      {/* Connection Status */}
      <div style={styles.statusSection}>
        <h3 style={styles.statusTitle}>📡 État de la connexion</h3>
        <p style={styles.statusText}>
          {loading && (
            <span style={styles.loadingText}>
              🔄 Connexion à la blockchain en cours...
            </span>
          )}
          {error && (
            <span style={styles.errorText}>
              ❌ Erreur de connexion : {error}
            </span>
          )}
          {isConnected && hasContracts && (
            <span>
              ✅ Connecté à la blockchain ! Tous les contrats sont chargés et
              prêts à être utilisés.
            </span>
          )}
          {isConnected && !hasContracts && (
            <span style={styles.loadingText}>
              ⚠️ Connecté mais chargement des contrats en cours...
            </span>
          )}
          {!isConnected && !loading && !error && (
            <span style={styles.errorText}>
              🔌 Non connecté à la blockchain. Vérifiez que Ganache est démarré.
            </span>
          )}
        </p>
      </div>

      {/* Blockchain Info Component */}
      <BlockchainInfo />

      {/* Exercise Menu */}
      <div style={styles.exerciseGrid}>
        {exercises.map((exercise) => (
          <Link
            key={exercise.id}
            to={exercise.path}
            style={styles.exerciseCard}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div style={styles.exerciseNumber}>Exercice {exercise.id}</div>
            <h3 style={styles.exerciseTitle}>{exercise.title}</h3>
            <p style={styles.exerciseDescription}>{exercise.description}</p>
          </Link>
        ))}
      </div>

      {/* Instructions Footer */}
      <div style={styles.statusSection}>
        <h3 style={styles.statusTitle}>📋 Instructions d'utilisation</h3>
        <div style={styles.statusText}>
          <ol style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
            <li>
              Assurez-vous que <strong>Ganache</strong> est démarré sur le port
              7545
            </li>
            <li>
              Vérifiez que les <strong>contrats sont déployés</strong> (statut
              de connexion vert)
            </li>
            <li>
              Cliquez sur un <strong>exercice</strong> pour accéder à son
              interface
            </li>
            <li>
              Utilisez les <strong>formulaires</strong> pour tester les
              fonctions des contrats
            </li>
            <li>
              Consultez les <strong>détails des transactions</strong> après
              chaque interaction
            </li>
            <li>
              <em>Optionnel</em> : Connectez <strong>MetaMask</strong> au réseau
              Ganache pour plus de fonctionnalités
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

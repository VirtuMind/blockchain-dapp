import React from "react";
import { Link } from "react-router-dom";

// CSS styles for the home page
const styles = {
  container: {
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
    color: "#c282e0",
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
    path: "/exercice1",
  },
  {
    id: 2,
    title: "Conversion Ether/Wei",
    description:
      "Convertisseur de cryptomonnaies entre Ether et Wei. Fonctions de conversion bidirectionnelle.",
    path: "/exercice2",
  },
  {
    id: 3,
    title: "Gestion des chaînes",
    description:
      "Manipulation de chaînes de caractères : modification, concaténation, longueur et comparaison.",
    path: "/exercice3",
  },
  {
    id: 4,
    title: "Vérification positive",
    description:
      "Fonction pour vérifier si un nombre est positif. Retourne un booléen.",
    path: "/exercice4",
  },
  {
    id: 5,
    title: "Vérification parité",
    description:
      "Contrat intelligent pour vérifier la parité d'un nombre entier (pair ou impair).",
    path: "/exercice5",
  },
  {
    id: 6,
    title: "Opérations sur tableaux",
    description:
      "Stockage et manipulation d'une liste de nombres avec calcul de somme et gestion des éléments.",
    path: "/exercice6",
  },
  {
    id: 7,
    title: "Formes géométriques",
    description:
      "Programmation orientée objet avec contrat abstrait Forme et implémentation Rectangle.",
    path: "/exercice7",
  },
  {
    id: 8,
    title: "Contrat de paiement",
    description:
      "Système de paiement avec gestion des transactions et des soldes entre adresses.",
    path: "/exercice8",
  },
];

export const HomePage: React.FC = () => {
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
        <h1 style={styles.title}>
          <img src="/block.png" alt="Blockchain" height="40" /> Application
          Décentralisée
        </h1>
        <h2 style={styles.subtitle}>Travail réalisé par Younes Khoubaz</h2>
      </div>

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
    </div>
  );
};

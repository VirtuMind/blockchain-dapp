/**
 * NAVIGATION COMPONENT
 *
 * This component provides navigation between exercise pages and the home page.
 * It includes a "Sommaire" (Summary) link to return to the main menu as specified
 * in the project requirements.
 */

import React from "react";
import { Link, useLocation } from "react-router-dom";

// CSS styles for the navigation
const styles = {
  nav: {
    background: "#16213e",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  navList: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "12px",
    alignItems: "center",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  navItem: {
    display: "flex",
  },
  navLink: {
    color: "#74c0fc",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    border: "1px solid transparent",
  },
  activeLink: {
    background: "#4dabf7",
    color: "#000",
    fontWeight: "600",
  },
  homeLink: {
    background: "#51cf66",
    color: "#000",
    fontWeight: "600",
    marginRight: "12px",
  },
  divider: {
    color: "#495057",
    margin: "0 8px",
  },
};

export const Navigation: React.FC = () => {
  const location = useLocation();

  // Check if current route is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <ul style={styles.navList}>
        {/* Sommaire (Home) Link - as specified in requirements */}
        <li style={styles.navItem}>
          <Link
            to="/"
            style={{
              ...styles.navLink,
              ...styles.homeLink,
              ...(isActive("/") ? { background: "#40c057" } : {}),
            }}
          >
            Sommaire
          </Link>
        </li>

        <li style={styles.divider}>|</li>

        {/* Exercise Navigation Links */}
        <li style={styles.navItem}>
          <Link
            to="/exercice1"
            style={{
              ...styles.navLink,
              ...(isActive("/exercice1") ? styles.activeLink : {}),
            }}
          >
            Ex 1
          </Link>
        </li>

        <li style={styles.navItem}>
          <Link
            to="/exercice2"
            style={{
              ...styles.navLink,
              ...(isActive("/exercice2") ? styles.activeLink : {}),
            }}
          >
            Ex 2
          </Link>
        </li>

        <li style={styles.navItem}>
          <Link
            to="/exercice3"
            style={{
              ...styles.navLink,
              ...(isActive("/exercice3") ? styles.activeLink : {}),
            }}
          >
            Ex 3
          </Link>
        </li>

        <li style={styles.navItem}>
          <Link
            to="/exercice4"
            style={{
              ...styles.navLink,
              ...(isActive("/exercice4") ? styles.activeLink : {}),
            }}
          >
            Ex 4
          </Link>
        </li>

        <li style={styles.navItem}>
          <Link
            to="/exercice5"
            style={{
              ...styles.navLink,
              ...(isActive("/exercice5") ? styles.activeLink : {}),
            }}
          >
            Ex 5
          </Link>
        </li>

        <li style={styles.navItem}>
          <Link
            to="/exercice6"
            style={{
              ...styles.navLink,
              ...(isActive("/exercice6") ? styles.activeLink : {}),
            }}
          >
            Ex 6
          </Link>
        </li>

        <li style={styles.navItem}>
          <Link
            to="/exercice7"
            style={{
              ...styles.navLink,
              ...(isActive("/exercice7") ? styles.activeLink : {}),
            }}
          >
            Ex 7
          </Link>
        </li>

        <li style={styles.navItem}>
          <Link
            to="/exercice8"
            style={{
              ...styles.navLink,
              ...(isActive("/exercice8") ? styles.activeLink : {}),
            }}
          >
            Ex 8
          </Link>
        </li>
      </ul>
    </nav>
  );
};

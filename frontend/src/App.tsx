import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { Exercise1 } from "./pages/Exercise1";
import { Exercise2 } from "./pages/Exercise2";
import { Exercise3 } from "./pages/Exercise3";
import { Exercise4 } from "./pages/Exercise4";
import { Exercise5 } from "./pages/Exercise5";
import { Exercise6 } from "./pages/Exercise6";
import { Exercise7 } from "./pages/Exercise7";
import { Exercise8 } from "./pages/Exercise8";
import "./App.css";

/**
 * APPLICATION PRINCIPALE - ROUTAGE DES PAGES
 *
 * Cette application React utilise React Router pour naviguer entre les différents exercices
 * de développement blockchain. Chaque exercice démontre une fonctionnalité spécifique
 * des contrats intelligents Ethereum.
 *
 * STRUCTURE DE NAVIGATION:
 * - HomePage (/) : Menu principal avec liste des exercices
 * - Exercise1 (/exercise1) : Opérations d'addition avec contrats
 * - Exercise2 (/exercise2) : Conversions Ether/Wei
 * - Exercise3 (/exercise3) : Gestion de chaînes de caractères
 * - Exercise4 (/exercise4) : Vérification de nombres positifs
 * - Exercise5 (/exercise5) : Contrôle de parité (pair/impair)
 * - Exercise6 (/exercise6) : Opérations sur les tableaux
 * - Exercise7 (/exercise7) : Géométrie avec héritage (Rectangle/Forme)
 * - Exercise8 (/exercise8) : Contrat de paiement et transactions
 *
 * INTÉGRATION BLOCKCHAIN:
 * Chaque page utilise le hook useWeb3 pour se connecter à la blockchain Ethereum
 * via MetaMask ou Ganache, permettant l'interaction avec les contrats intelligents.
 */
function App() {
  return (
    <Router>
      <div
        className="App"
        style={{
          background: "linear-gradient(135deg, #0f3460 0%, #16213e 100%)",
          minHeight: "100vh",
          fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
        }}
      >
        <Routes>
          {/* PAGE D'ACCUEIL - Menu principal avec sommaire des exercices */}
          <Route path="/" element={<HomePage />} />

          {/* EXERCICE 1 - Addition et fonctions view/pure */}
          <Route path="/exercise1" element={<Exercise1 />} />

          {/* EXERCICE 2 - Conversions Ether/Wei */}
          <Route path="/exercise2" element={<Exercise2 />} />

          {/* EXERCICE 3 - Gestion des chaînes de caractères */}
          <Route path="/exercise3" element={<Exercise3 />} />

          {/* EXERCICE 4 - Vérification de nombres positifs */}
          <Route path="/exercise4" element={<Exercise4 />} />

          {/* EXERCICE 5 - Contrôle de parité */}
          <Route path="/exercise5" element={<Exercise5 />} />

          {/* EXERCICE 6 - Opérations sur les tableaux */}
          <Route path="/exercise6" element={<Exercise6 />} />

          {/* EXERCICE 7 - Géométrie et héritage */}
          <Route path="/exercise7" element={<Exercise7 />} />

          {/* EXERCICE 8 - Contrat de paiement */}
          <Route path="/exercise8" element={<Exercise8 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

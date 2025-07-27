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

function App() {
  return (
    <Router>
      <div
        className="App"
        style={{
          background: "linear-gradient(135deg, #0f3460 0%, #16213e 100%)",
          minHeight: "100vh",
          maxWidth: "784px",
          fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/exercice1" element={<Exercise1 />} />

          <Route path="/exercice2" element={<Exercise2 />} />

          <Route path="/exercice3" element={<Exercise3 />} />

          <Route path="/exercice4" element={<Exercise4 />} />

          <Route path="/exercice5" element={<Exercise5 />} />

          <Route path="/exercice6" element={<Exercise6 />} />

          <Route path="/exercice7" element={<Exercise7 />} />

          <Route path="/exercice8" element={<Exercise8 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

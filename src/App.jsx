// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Registro from './pages/Registro';
import Historial from './pages/Historial';
import './App.css'; // Importa tu CSS global

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Registro />} />
          <Route path="/historial" element={<Historial />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

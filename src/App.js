// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage'; // Ajustado para a pasta pages
import AddProject from './pages/AddProject'; // Ajustado para a pasta pages
import ProjectPage from './pages/ProjectPage'; // Ajustado para a pasta pages
import Navbar from './components/Navbar'; // Corrigido para importar de components

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Adicionando a Navbar para ser exibida em todas as páginas */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-project" element={<AddProject />} />
        <Route path="/projects" element={<ProjectPage />} /> {/* Ajustado para /projects */}
      </Routes>
    </Router>
  );
};

export default App;

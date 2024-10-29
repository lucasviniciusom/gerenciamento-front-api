// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage'; // Certifique-se de que o caminho está correto
import AddProject from './pages/AddProject'; // Certifique-se de que o caminho está correto
import ProjectPage from './pages/ProjectPage'; // Certifique-se de que o caminho está correto
import Navbar from './components/Navbar'; // Certifique-se de que o caminho está correto

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-project" element={<AddProject />} />
        <Route path="/projetos/:id" element={<ProjectPage />} /> {/* Corrigido para usar "projetos" */}
      </Routes>
    </Router>
  );
};

export default App;

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import AddProject from './pages/AddProject'; 
import ProjectPage from './pages/ProjectPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-project" element={<AddProject />} />
        <Route path="/projetos/:id" element={<ProjectPage />} />
      </Routes>
    </Router>
  );
};

export default App;

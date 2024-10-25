// src/components/HomePage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Atualize aqui
import api from '../api'; // Importa a configuração do axios

const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate(); // Atualize aqui

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projetos'); // Obtém a lista de projetos
        setProjects(response.data); // Atualiza o estado com os projetos
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
      }
    };

    fetchProjects(); // Chama a função ao montar o componente
  }, []);

  const handleAddProject = () => {
    navigate('/add-project'); // Atualize aqui
  };

  const handleProjectClick = (id) => {
    navigate(`/project/${id}`); // Atualize aqui
  };

  return (
    <div>
      <h1>Projetos em que você está participando</h1>
      <button onClick={handleAddProject}>Adicionar Projeto</button>
      <ul>
        {projects.map((project) => (
          <li key={project.id} onClick={() => handleProjectClick(project.id)}>
            {project.nome} {/* Exibe o nome do projeto */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;

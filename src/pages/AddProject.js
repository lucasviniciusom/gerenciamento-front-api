// src/pages/AddProject.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para navegação
import api from '../api'; // Importa a configuração do axios

const AddProject = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const navigate = useNavigate(); // Para redirecionar após adicionar o projeto

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    const newProject = {
      nome,
      descricao,
      dataInicio,
      dataFim,
    };

    try {
      await api.post('/projetos', newProject); // Envia os dados do novo projeto
      navigate('/'); // Redireciona para a home após adicionar o projeto
    } catch (error) {
      console.error('Erro ao adicionar o projeto:', error);
    }
  };

  return (
    <div>
      <h1>Adicionar Projeto</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome do Projeto:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Data de Início:</label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Data de Fim:</label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </div>
        <button type="submit">Adicionar Projeto</button>
      </form>
    </div>
  );
};

export default AddProject;

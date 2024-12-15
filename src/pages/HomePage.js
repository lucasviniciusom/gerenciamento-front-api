import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const [projetos, setProjetos] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [status, setStatus] = useState(0);
  const [projetoEditando, setProjetoEditando] = useState(null);
  const [error, setError] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  const fetchProjetos = useCallback(async () => {
    try {
      const response = await axios.get('https://localhost:44374/api/Projetos');
      const projetosArray = response.data.items?.$values || response.data;
      setProjetos(Array.isArray(projetosArray) ? projetosArray : []);
      setError(null);
    } catch (error) {
      setError('Não foi possível carregar os projetos.');
    }
  }, []);

  useEffect(() => {
    fetchProjetos();
  }, [fetchProjetos]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projetoData = {
      id: projetoEditando ? projetoEditando.id : 0,
      nome,
      descricao,
      dataInicio: new Date(dataInicio).toISOString(),
      dataFim: dataFim ? new Date(dataFim).toISOString() : null,
      status,
    };

    try {
      if (projetoEditando) {
        await axios.put(`https://localhost:44374/api/Projetos/${projetoEditando.id}`, projetoData);
      } else {
        await axios.post('https://localhost:44374/api/Projetos', projetoData);
      }

      resetForm();
      fetchProjetos();
      setFormVisible(false);
    } catch (error) {
      setError('Não foi possível adicionar ou editar o projeto.');
    }
  };

  const resetForm = () => {
    setNome('');
    setDescricao('');
    setDataInicio('');
    setDataFim('');
    setStatus(0);
    setProjetoEditando(null);
    setError(null);
  };

  const toggleFormVisibility = () => {
    setFormVisible(!formVisible);
    if (projetoEditando) resetForm();
  };

  const handleEdit = (projeto) => {
    setProjetoEditando(projeto);
    setNome(projeto.nome);
    setDescricao(projeto.descricao);
    setDataInicio(projeto.dataInicio.split('T')[0]);
    setDataFim(projeto.dataFim ? projeto.dataFim.split('T')[0] : '');
    setStatus(projeto.status);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:44374/api/Projetos/${id}`);
      fetchProjetos();
    } catch (error) {
      setError('Não foi possível deletar o projeto.');
    }
  };

  return (
    <div className="container">
      <h1>Todos os Projetos</h1>
      {error && <div className="error">{error}</div>}

      <ul>
        {projetos.length > 0 ? (
          projetos.map((projeto) => (
            <li key={projeto.id}>
              <div>
                <strong>{projeto.nome}</strong>
                <p>{projeto.descricao}</p>
                <p>
                  (Data de Início: {new Date(projeto.dataInicio).toLocaleDateString()}, Data de Fim:{' '}
                  {projeto.dataFim ? new Date(projeto.dataFim).toLocaleDateString() : 'Não definido'}, Status:{' '}
                  {projeto.status === 0
                    ? 'Em Andamento'
                    : projeto.status === 1
                    ? 'Concluído'
                    : 'Cancelado'})
                </p>
              </div>
              <div>
                <button onClick={() => handleEdit(projeto)}>Editar</button>
                <button onClick={() => handleDelete(projeto.id)}>Excluir</button>
              </div>
            </li>
          ))
        ) : (
          <li>Nenhum projeto encontrado.</li>
        )}
      </ul>

      <button onClick={toggleFormVisibility} className="toggle-form-btn">
        {formVisible ? 'Cancelar' : 'Adicionar Novo Projeto'}
      </button>

      {formVisible && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Data de Início</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Data de Fim</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>

          <div>
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
              required
            >
              <option value={0}>Em Andamento</option>
              <option value={1}>Concluído</option>
              <option value={2}>Cancelado</option>
            </select>
          </div>

          <button type="submit">{projetoEditando ? 'Atualizar' : 'Adicionar'}</button>
        </form>
      )}
    </div>
  );
};

export default HomePage;

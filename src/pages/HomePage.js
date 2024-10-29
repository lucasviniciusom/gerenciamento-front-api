import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Importe o Link para navegação

const HomePage = () => {
  const [projetos, setProjetos] = useState([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [status, setStatus] = useState(0); // Mudado para número
  const [projetoEditando, setProjetoEditando] = useState(null);
  const [error, setError] = useState(null);

  // Função para buscar projetos
  const fetchProjetos = useCallback(async () => {
    try {
      const response = await axios.get('https://localhost:44374/api/Projetos');
      console.log('Resposta da API ao buscar projetos:', response.data);
      const projetosArray = response.data.items?.$values || response.data;
      setProjetos(Array.isArray(projetosArray) ? projetosArray : []);
      setError(null);
    } catch (error) {
      setError('Não foi possível carregar os projetos.');
      console.error('Erro ao buscar projetos:', error);
    }
  }, []);

  useEffect(() => {
    fetchProjetos();
  }, [fetchProjetos]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projetoData = {
      id: projetoEditando ? projetoEditando : 0, // Usando o ID se estiver editando
      nome,
      descricao,
      dataInicio: new Date(dataInicio).toISOString(),
      dataFim: new Date(dataFim).toISOString(),
      status: status, // Mantendo o status como número
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };

    try {
      if (projetoEditando) {
        const response = await axios.put(`https://localhost:44374/api/Projetos/${projetoEditando}`, projetoData);
        console.log('Projeto editado com sucesso:', response.data);
      } else {
        const response = await axios.post('https://localhost:44374/api/Projetos', projetoData);
        console.log('Projeto adicionado com sucesso:', response.data);
      }

      resetForm();
      fetchProjetos();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Não foi possível adicionar ou editar o projeto.';
      setError(errorMessage);
      console.error('Erro ao adicionar ou editar projeto:', error);
    }
  };

  const resetForm = () => {
    setNome('');
    setDescricao('');
    setDataInicio('');
    setDataFim('');
    setStatus(0); // Resetando para o status padrão (número)
    setProjetoEditando(null);
    setError(null); // Limpa qualquer erro anterior
  };

  const handleEdit = (projeto) => {
    setNome(projeto.nome);
    setDescricao(projeto.descricao);
    setDataInicio(new Date(projeto.dataInicio).toISOString().split('T')[0]);
    setDataFim(new Date(projeto.dataFim).toISOString().split('T')[0]);
    setStatus(projeto.status); // O status agora é tratado como número
    setProjetoEditando(projeto.id);
    setError(null); // Limpa qualquer erro anterior
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:44374/api/Projetos/${id}`);
      console.log('Projeto deletado com sucesso:', id);
      fetchProjetos();
    } catch (error) {
      setError('Não foi possível deletar o projeto.');
      console.error('Erro ao deletar projeto:', error);
    }
  };

  return (
    <div>
      <h1>Todas os Projetos</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <h2>Projetos</h2>
      <ul>
        {projetos.length > 0 ? (
          projetos.map((projeto) => (
            <li key={projeto.id}>
              <strong>
                <Link to={`/projetos/${projeto.id}`}>{projeto.nome}</Link>
              </strong> - {projeto.descricao} <br />
              (Data de Início: {new Date(projeto.dataInicio).toLocaleDateString()}, Data de Fim: {new Date(projeto.dataFim).toLocaleDateString()}, Status: {projeto.status})
              <button onClick={() => handleEdit(projeto)}>Editar</button>
              <button onClick={() => handleDelete(projeto.id)}>Excluir</button>
            </li>
          ))
        ) : (
          <li>Nenhum projeto encontrado.</li>
        )}
      </ul>

      <h2>{projetoEditando ? 'Editar Projeto' : 'Adicionar Novo Projeto'}</h2>
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
            required
          />
        </div>

        <div>
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(Number(e.target.value))} // Convertendo para número
            required
          >
            <option value={0}>Em Andamento</option>
            <option value={1}>Concluído</option>
            <option value={2}>Cancelado</option>
          </select>
        </div>

        <button type="submit">{projetoEditando ? 'Atualizar' : 'Adicionar'}</button>
        <button type="button" onClick={resetForm}>Cancelar</button>
      </form>
    </div>
  );
};

export default HomePage;

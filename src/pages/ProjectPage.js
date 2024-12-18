import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ProjectPage.css';

const ProjectPage = () => {
  const { id } = useParams();
  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState('Baixa');
  const [status, setStatus] = useState('Não_iniciada');
  const [usuarioAtribuido, setUsuarioAtribuido] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [error, setError] = useState(null);

  const fetchTarefas = useCallback(async () => {
    try {
      const response = await axios.get(`https://localhost:44374/api/Tarefas?projetoId=${id}`);
      const tarefasArray = response.data.items?.$values || response.data;
      setTarefas(Array.isArray(tarefasArray) ? tarefasArray : []);
      setError(null);
    } catch (error) {
      setError('Não foi possível carregar as tarefas.');
    }
  }, [id]);

  useEffect(() => {
    fetchTarefas();
  }, [fetchTarefas]);

  const prioridadeMapping = {
    Baixa: 0,
    Média: 1,
    Alta: 2,
  };

  const statusMapping = {
    Não_iniciada: 0,
    Em_andamento: 1,
    Finalizada: 2,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usuarioIdValido = parseInt(usuarioAtribuido);
    if (isNaN(usuarioIdValido) || usuarioIdValido <= 0) {
      alert('Por favor, insira um ID de usuário válido (maior que 0).');
      return;
    }

    const tarefaData = {
      titulo,
      descricao,
      prioridade: prioridadeMapping[prioridade],
      status: statusMapping[status],
      usuarioAtribuido: usuarioIdValido,
      dataVencimento: new Date(dataVencimento).toISOString(),
      projetoId: id,
    };

    try {
      if (tarefaEditando) {
        await axios.put(`https://localhost:44374/api/Tarefas/${tarefaEditando}`, tarefaData);
      } else {
        await axios.post('https://localhost:44374/api/Tarefas', tarefaData);
      }

      resetForm();
      fetchTarefas();
    } catch (error) {
      setError('Não foi possível adicionar ou editar a tarefa.');
    }
  };

  const resetForm = () => {
    setTitulo('');
    setDescricao('');
    setPrioridade('Baixa');
    setStatus('Não_iniciada');
    setUsuarioAtribuido('');
    setDataVencimento('');
    setTarefaEditando(null);
  };

  const handleEdit = (tarefa) => {
    setTitulo(tarefa.titulo);
    setDescricao(tarefa.descricao);
    setPrioridade(tarefa.prioridade === 0 ? 'Baixa' : tarefa.prioridade === 1 ? 'Média' : 'Alta');
    setStatus(tarefa.status === 0 ? 'Não_iniciada' : tarefa.status === 1 ? 'Em_andamento' : 'Finalizada');
    setUsuarioAtribuido(tarefa.usuarioAtribuido);
    setDataVencimento(new Date(tarefa.dataVencimento).toISOString().split('T')[0]);
    setTarefaEditando(tarefa.tarefaId);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:44374/api/Tarefas/${id}`);
      fetchTarefas();
    } catch (error) {
      setError('Não foi possível deletar a tarefa.');
    }
  };

  return (
    <div className="container">
      <h1>Todas as Tarefas do Projeto</h1>
      {error && <div className="error">{error}</div>}
      <h2>Tarefas</h2>
      <ul>
        {tarefas.length > 0 ? (
          tarefas.map((tarefa) => (
            <li key={tarefa.tarefaId}>
              <div>
                <strong>{tarefa.titulo}</strong>
                <p>{tarefa.descricao}</p>
                <p>
                  (Status: {tarefa.status === 0 ? 'Não Iniciada' : tarefa.status === 1 ? 'Em Andamento' : 'Finalizada'}, 
                  Prioridade: {tarefa.prioridade === 0 ? 'Baixa' : tarefa.prioridade === 1 ? 'Média' : 'Alta'}, 
                  Data de Vencimento: {new Date(tarefa.dataVencimento).toLocaleDateString()})
                </p>
              </div>
              <div>
                <button onClick={() => handleEdit(tarefa)}>Editar</button>
                <button onClick={() => handleDelete(tarefa.tarefaId)}>Excluir</button>
              </div>
            </li>
          ))
        ) : (
          <li>Nenhuma tarefa encontrada.</li>
        )}
      </ul>
      <h2>{tarefaEditando ? 'Editar Tarefa' : 'Adicionar Nova Tarefa'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título</label>
          <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        </div>
        <div>
          <label>Descrição</label>
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
        </div>
        <div>
          <label>Prioridade</label>
          <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)} required>
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
          </select>
        </div>
        <div>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="Não_iniciada">Não Iniciada</option>
            <option value="Em_andamento">Em Andamento</option>
            <option value="Finalizada">Finalizada</option>
          </select>
        </div>
        <div>
          <label>Usuário Atribuído (ID)</label>
          <input type="number" value={usuarioAtribuido} onChange={(e) => setUsuarioAtribuido(e.target.value)} required />
        </div>
        <div>
          <label>Data de Vencimento</label>
          <input type="date" value={dataVencimento} onChange={(e) => setDataVencimento(e.target.value)} required />
        </div>
        <button type="submit">{tarefaEditando ? 'Atualizar' : 'Adicionar'}</button>
        <button type="button" onClick={resetForm}>Cancelar</button>
      </form>
      <Link to="/" className="back-link">
        Voltar para Projetos
      </Link>
    </div>
  );
};

export default ProjectPage;

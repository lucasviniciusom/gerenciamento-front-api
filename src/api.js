// src/api.js
import axios from 'axios';

// Configuração da URL base da API
const api = axios.create({
  baseURL: 'https://localhost:44374',  
});

export default api;

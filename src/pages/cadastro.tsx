import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
        const response = await axios.post(`${apiUrl}/Mestre`, {
          nome,
          senha: password,
        });
    
        if (response.status !== 200) {
          throw new Error('Erro no cadastro');
        }
    
        navigate('/');
      } catch (error) {
        setError('Erro ao criar conta. Tente novamente.');
      }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-black">
      <div className="w-full max-w-sm p-6 bg-gray-900 rounded-lg shadow-md">
        <h3 className="text-3xl font-bold text-center text-white">Criar Conta</h3>
        <form onSubmit={handleSubmit} className="mt-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-300">
              Nome
            </label>
            <input
              type="text"
              placeholder="Digite seu nome"
              className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Senha
            </label>
            <input
              type="password"
              placeholder="Digite sua senha"
              className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 mt-6 text-white bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cadastrar
          </button>
        </form>
        {error && (
          <div className="mt-4 text-sm text-center text-red-500">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cadastro;

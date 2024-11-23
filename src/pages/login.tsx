import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirecionar automaticamente se o ID do usuário já estiver no localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://apifakedelivery.vercel.app/users');
      const users = await response.json();

      const user = users.find((u: any) => u.email === email && u.senha === password);

      if (user) {
        // Armazenar ID do usuário localmente
        localStorage.setItem('userId', user.id);
        navigate('/home');
      } else {
        setError('Email ou senha inválidos');
      }
    } catch (error) {
      setError('Erro ao fazer login. Tente novamente.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 to-black">
      <div className="w-full max-w-sm p-6 bg-gray-900 rounded-lg shadow-md">
        <h3 className="text-3xl font-bold text-center text-white">Bem-vindo</h3>
        <p className="mt-2 text-sm text-center text-gray-400">Faça login na sua conta</p>
        <form onSubmit={handleSubmit} className="mt-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              placeholder="Digite seu email"
              className="w-full px-4 py-2 mt-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div className="flex justify-end mt-2 text-sm text-gray-400 hover:text-gray-200">
            <a href="#">Esqueceu sua senha?</a>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 mt-6 text-white bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Login
          </button>
        </form>
        {error && (
          <div className="mt-4 text-sm text-center text-red-500">
            {error}
          </div>
        )}
        <p className="mt-6 text-sm text-center text-gray-400">
          Não tem uma conta?{' '}
          <a href="#" className="text-gray-300 hover:text-gray-100">
            Registre-se
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

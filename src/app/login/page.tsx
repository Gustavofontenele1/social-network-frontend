// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Estado para indicar carregamento
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (!validateEmail(email)) {
      setErrorMessage('Por favor, insira um email válido.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (res.ok) {
        router.push('/profile');
      } else if (res.status === 400) {
        setErrorMessage('Login ou senha inválidos!');
      } else {
        setErrorMessage('Erro inesperado. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      setErrorMessage('Falha na conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função simples para validar email
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="p-6 bg-white rounded shadow-md w-80 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {/* Mostrar mensagem de erro */}
        {errorMessage && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className={`w-full p-2 text-white rounded ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <div className="text-center">
          <a href="/signup" className="text-blue-500 hover:underline">
            Não tem uma conta? Criar uma conta
          </a>
        </div>
      </form>
    </div>
  );
}

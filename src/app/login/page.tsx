'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
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

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-black via-gray-800 to-gray-900 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="particles"></div>
      </div>

      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 z-10 text-center">
        <div className="logo-container mb-6 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white text-shadow-lg">StreamHub</h1>
        </div>

        <p className="text-2xl text-white mb-8">Conecte-se ao futuro</p>
        <form onSubmit={handleLogin} className="space-y-6 p-8 bg-opacity-60 bg-black rounded-lg shadow-2xl max-w-sm mx-auto">
          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border-b-2 border-white text-white bg-transparent placeholder-white focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border-b-2 border-white text-white bg-transparent placeholder-white focus:outline-none"
            required
          />
          <button
            type="submit"
            className={`w-full p-3 text-lg text-white rounded-full ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="text-center">
            <a href="/signup" className="text-blue-300 hover:underline">
              Não tem uma conta? Criar uma conta
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

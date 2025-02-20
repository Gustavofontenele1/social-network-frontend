import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const Verify: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const router = useRouter();
  const { token } = router.query; // Pega o token da URL

  useEffect(() => {
    const verifyAccount = async () => {
      if (token) {
        try {
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`, { token });
          setMessage('Conta ativada com sucesso! Agora você pode fazer login.');
        } catch (error) {
          setMessage('O link de ativação expirou ou é inválido.');
        } finally {
          setLoading(false);
        }
      }
    };

    verifyAccount();
  }, [token]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-600 to-blue-800 text-white">
      {loading ? (
        <div className="flex flex-col items-center animate-fadeIn">
          <div className="border-4 border-t-4 border-green-500 rounded-full w-16 h-16 animate-spin"></div>
          <p className="mt-4 text-xl text-center animate-fadeInText">Verificando sua conta...</p>
        </div>
      ) : (
        <div className="text-center animate-fadeIn">
          <h2 className="text-2xl font-semibold text-green-400">{message}</h2>
        </div>
      )}
    </div>
  );
};

export default Verify;

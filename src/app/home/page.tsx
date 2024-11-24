// src/app/home/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/profile'); // Redireciona para a página de perfil
    } else {
      router.push('/login'); // Redireciona para a página de login se não autenticado
    }
  }, [router]);

  return (
    <div>
      {/* Conteúdo da página inicial, se necessário */}
      <h1>Bem-vindo à Home Page</h1>
    </div>
  );
};

export default HomePage;

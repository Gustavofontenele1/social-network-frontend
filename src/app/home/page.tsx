'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    router.push(token ? '/profile' : '/login');
  }, [router]);

  return (
    <div>
      <h1>Bem-vindo à Home Page</h1>
    </div>
  );
};

export default HomePage;

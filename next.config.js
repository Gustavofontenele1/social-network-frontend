const nextConfig = {
  // Suas configurações aqui
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/home', // Redireciona a página inicial para /home
      },
    ];
  },
};

module.exports = nextConfig;

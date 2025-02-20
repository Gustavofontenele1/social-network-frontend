"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const Verify: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (token && typeof token === "string") {
      console.log("Token capturado:", token);
      verifyAccount(token);
    } else {
      setErrorMessage("Token inválido ou não encontrado.");
    }
  }, [token]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const verifyAccount = async (verificationToken: string): Promise<void> => {
    setLoading(true);
    try {
      console.log("Enviando requisição de verificação para o token:", verificationToken);
      const req = await axios.post(`${API_URL}/api/auth/verify`, {
        token: verificationToken,
      });

      if (req.status === 200) {
        setSuccessMessage("Conta verificada com sucesso! Você agora pode fazer login.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setErrorMessage("Erro ao verificar o token.");
      }
    } catch (error) {
      console.error("Erro ao verificar a conta:", error);
      setErrorMessage("Erro ao verificar o token. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 animate-fadeIn">
        <h1 className="text-2xl font-semibold text-blue-600 mb-6">Verificação de Conta</h1>

        {loading && <p className="text-lg text-orange-500">Verificando...</p>}
        {errorMessage && <p className="text-lg text-red-500 mt-4">{errorMessage}</p>}
        {successMessage && (
          <p className="text-lg text-green-500 mt-4">{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default Verify;

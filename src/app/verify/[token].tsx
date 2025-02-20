"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const Verify: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token && typeof token === "string") {
      verifyAccount(token);
    }
  }, [token]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const verifyAccount = async (verificationToken: string): Promise<void> => {
    setLoading(true);
    try {
      const req = await axios.post(`${API_URL}/api/auth/verify`, {
        token: verificationToken,
      });

      if (req.status === 200) {
        setSuccessMessage("Conta verificada com sucesso! Você agora pode fazer login.");
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
    <div>
      <h1>Verificação de Conta</h1>

      {loading && <p>Verificando...</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default Verify;

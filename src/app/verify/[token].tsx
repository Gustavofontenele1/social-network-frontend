"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const Verify: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useParams();

  useEffect(() => {
    if (token && typeof token === "string") {
      verifyAccount(token);
    }
  }, [token]);

  const verifyAccount = async (verificationToken: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/auth/verify/${verificationToken}`);

      if (res.status === 200) {
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

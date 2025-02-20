"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

interface ApiResponse {
  error?: string;
  message?: string;
}

const VerifyClient: React.FC = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post<ApiResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        { email }
      );

      if (res.status === 200) {
        setSuccessMessage("Código de verificação enviado para seu e-mail!");
      } else {
        setErrorMessage(res.data.error || "Erro ao enviar o e-mail.");
      }
    } catch (error) {
      console.error("Erro ao solicitar redefinição de senha:", error);
      setErrorMessage("Erro ao tentar recuperar a senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post<ApiResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-reset-code`,
        { email, code: verificationCode }
      );

      if (res.status === 200) {
        setSuccessMessage(
          "Código verificado com sucesso! Agora defina sua nova senha."
        );
      } else {
        setErrorMessage("Código inválido");
      }
    } catch (error) {
      console.error("Erro na verificação do código:", error);
      setErrorMessage("Erro ao tentar verificar o código. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post<ApiResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
        { token: verificationCode, newPassword }
      );

      if (res.status === 200) {
        setSuccessMessage("Senha alterada com sucesso!");
        router.push("/login");
      } else {
        setErrorMessage(res.data.error || "Erro ao redefinir a senha.");
      }
    } catch (error) {
      console.error("Erro ao alterar a senha:", error);
      setErrorMessage("Erro ao tentar alterar a senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Recuperar Senha</h1>

      <form onSubmit={handleEmailSubmit}>
        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar Código"}
        </button>
      </form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      {successMessage === "Código de verificação enviado para seu e-mail!" && (
        <form onSubmit={handleVerifyCode}>
          <input
            type="text"
            placeholder="Digite o código de verificação"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Verificando..." : "Verificar Código"}
          </button>
        </form>
      )}

      {successMessage ===
        "Código verificado com sucesso! Agora defina sua nova senha." && (
        <form onSubmit={handleResetPassword}>
          <input
            type="password"
            placeholder="Nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Alterando..." : "Alterar Senha"}
          </button>
        </form>
      )}
    </div>
  );
};

export default VerifyClient;

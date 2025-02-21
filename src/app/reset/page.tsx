"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [step, setStep] = useState(1);
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setSuccessMessage("Código de verificação enviado para seu e-mail!");
        setStep(2);
        setErrorMessage("");
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "Erro ao enviar o e-mail.");
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-reset-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: verificationCode }),
        }
      );
      if (res.ok) {
        setSuccessMessage(
          "Código verificado com sucesso! Agora defina sua nova senha."
        );
        setStep(3);
        setErrorMessage("");
      } else {
        setErrorMessage("Código inválido ou expirado.");
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: verificationCode, newPassword }),
        }
      );

      if (res.ok) {
        setSuccessMessage("Senha alterada com sucesso!");
        router.push("/login");
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "Erro ao redefinir a senha.");
      }
    } catch (error) {
      console.error("Erro ao alterar a senha:", error);
      setErrorMessage("Erro ao tentar alterar a senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {step === 1 ? (
        <form
          onSubmit={handleEmailSubmit}
          className="p-6 bg-white rounded shadow-md w-80 space-y-4"
        >
          <h2 className="text-2xl font-bold text-center">
            Recuperação de Senha
          </h2>
          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-center">{successMessage}</p>
          )}
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar Código"}
          </button>
        </form>
      ) : step === 2 ? (
        <form
          onSubmit={handleVerifyCode}
          className="p-6 bg-white rounded shadow-md w-80 space-y-4"
        >
          <h2 className="text-2xl font-bold text-center">
            Verificação do Código
          </h2>
          <p className="text-center text-gray-600">
            Digite o código enviado para seu e-mail.
          </p>
          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}
          <input
            type="text"
            placeholder="Código de verificação"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Verificando..." : "Verificar Código"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleResetPassword}
          className="p-6 bg-white rounded shadow-md w-80 space-y-4"
        >
          <h2 className="text-2xl font-bold text-center">Nova Senha</h2>
          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-center">{successMessage}</p>
          )}
          <input
            type="password"
            placeholder="Nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Alterando..." : "Alterar Senha"}
          </button>
        </form>
      )}
    </div>
  );
}

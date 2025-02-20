"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (res.ok) {
        setSuccessMessage("Código de verificação enviado para seu e-mail!");
        setStep(2);
        setErrorMessage("");
      } else {
        const data = await res.json();
        setErrorMessage(data.message || "Erro no cadastro");
      }
    } catch (error) {
      console.error("Erro durante o cadastro:", error);
      setErrorMessage(
        "Erro ao tentar se cadastrar. Tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth//verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      if (res.ok) {
        setSuccessMessage("Conta verificada com sucesso!");
        router.push("/login");
      } else {
        setErrorMessage("Código inválido");
      }
    } catch (error) {
      console.error("Erro na verificação:", error);
      setErrorMessage("Erro ao tentar verificar o código. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {step === 1 ? (
        <form
          onSubmit={handleSignup}
          className="p-6 bg-white rounded shadow-md w-80 space-y-4"
        >
          <h2 className="text-2xl font-bold text-center">Cadastro</h2>
          {errorMessage && (
            <p className="text-red-500 text-center">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-center">{successMessage}</p>
          )}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Confirme a senha"
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
            {loading ? "Cadastrando..." : "Criar Conta"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleVerify}
          className="p-6 bg-white rounded shadow-md w-80 space-y-4"
        >
          <h2 className="text-2xl font-bold text-center">Verificação</h2>
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
            {loading ? "Verificando..." : "Verificar"}
          </button>
        </form>
      )}
    </div>
  );
}

import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import logoRatRace from "../assets/logos/logoRatRace.png";
import fondoAuth from "../assets/backgrounds/FondoInicio.jpg";
import "./LoginPage.css";

// ─── Login Page ─────────────────────────────────────────────

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const profile = await login({ email, password });
      navigate(profile?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error inesperado al iniciar sesión");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── Background ─────────────────────────────────────── */}
      <div className="auth-bg" style={{ backgroundImage: `url(${fondoAuth})` }}>
        <div className="auth-bg-overlay" />
      </div>

      {/* ── Form Panel ─────────────────────────────────────── */}
      <div className="auth-panel">
        <div className="auth-panel-inner">
          {/* Logo */}
          <div className="auth-logo">
            <img src={logoRatRace} alt="RatRace Logo" />
          </div>

          {/* Header */}
          <div className="auth-header">
            <span className="auth-subtitle">BIENVENIDO DE NUEVO</span>
            <h1 className="auth-title">INICIAR SESIÓN</h1>
          </div>

          {/* Error global */}
          {error && (
            <div className="auth-error" role="alert">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <Input
              label="Email"
              type="email"
              id="login-email"
              placeholder="Ingresa tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              icon={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              }
            />

            <Input
              label="Password"
              type="password"
              id="login-password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              icon={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              }
            />

            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!email || !password}
            >
              LOGIN
            </Button>
          </form>

          {/* Footer */}
          <p className="auth-footer">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="auth-link">
              Crea una
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

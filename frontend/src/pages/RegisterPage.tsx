import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import logoRatRace from "../assets/logos/logoRatRace.png";
import fondoAuth from "../assets/backgrounds/FondoInicio.jpg";
import "./RegisterPage.css";


export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const [locality, setLocality] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const zone =
        locality || city || state || country
          ? [{ locality, city, state, country }]
          : undefined;

      await register({
        username,
        email,
        password,
        profilePhoto: profilePhoto || undefined,
        zone,
      });

      navigate("/login", { state: { registered: true } });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error inesperado al registrarse");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = username && email && password;

  return (
    <div className="auth-page">
      <div
        className="auth-bg"
        style={{ backgroundImage: `url(${fondoAuth})` }}
      >
        <div className="auth-bg-overlay" />
      </div>

      <div className="auth-panel auth-panel--register">
        <div className="auth-panel-inner">
          <div className="auth-logo">
            <img src={logoRatRace} alt="RatRace Logo" />
          </div>

          <div className="auth-header">
            <h1 className="auth-title">REGISTRO</h1>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* ── Datos Principales ──────────────────────────── */}
            <div className="register-section">
              <span className="register-section-title">Datos de Piloto</span>

              <Input
                label="Username"
                type="text"
                id="register-username"
                placeholder="Tu nombre de piloto"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                }
              />

              <Input
                label="Email"
                type="email"
                id="register-email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                }
              />

              <Input
                label="Password"
                type="password"
                id="register-password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                }
              />

              <Input
                label="Foto de Perfil (URL)"
                type="url"
                id="register-photo"
                placeholder="https://ejemplo.com/foto.jpg (opcional)"
                value={profilePhoto}
                onChange={(e) => setProfilePhoto(e.target.value)}
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                }
              />
            </div>

            {/* ── Zona ───────────────────────────────────────── */}
            <div className="register-section">
              <span className="register-section-title">Zona (opcional)</span>

              <div className="register-grid">
                <Input
                  label="Localidad"
                  type="text"
                  id="register-locality"
                  placeholder="Ej: Calatrava"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                />

                <Input
                  label="Ciudad"
                  type="text"
                  id="register-city"
                  placeholder="Ej: Medellín"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />

                <Input
                  label="Departamento"
                  type="text"
                  id="register-state"
                  placeholder="Ej: Antioquia"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />

                <Input
                  label="País"
                  type="text"
                  id="register-country"
                  placeholder="Ej: Colombia"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!isFormValid}
            >
              REGISTRARSE
            </Button>
          </form>

          {/* Footer */}
          <p className="auth-footer">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="auth-link">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

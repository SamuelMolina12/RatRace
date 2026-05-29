import { useState, type InputHTMLAttributes } from "react";
import "./Input.css";

// ─── Props ──────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

// ─── Component ──────────────────────────────────────────────

export default function Input({
  label,
  icon,
  error,
  type = "text",
  id,
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`input-group ${error ? "input-group--error" : ""}`}>
      <label htmlFor={inputId} className="input-label">
        {label}
      </label>
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          id={inputId}
          className="input-field"
          type={isPassword && showPassword ? "text" : type}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            className="input-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? (
              // Eye-off icon
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              // Eye icon
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}

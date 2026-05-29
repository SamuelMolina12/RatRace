import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

// ─── Props ──────────────────────────────────────────────────

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "text";
  isLoading?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
}

// ─── Component ──────────────────────────────────────────────

export default function Button({
  variant = "primary",
  isLoading = false,
  children,
  fullWidth = true,
  disabled,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant} ${fullWidth ? "btn--full" : ""} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className="btn-spinner" />
      ) : (
        <>
          <span className="btn-text">{children}</span>
          {variant === "primary" && (
            <span className="btn-arrow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          )}
        </>
      )}
    </button>
  );
}

import { useState } from "react";
import { challengeService } from "../../services/challengeService";
import type { CreateChallengeRequest } from "../../types/dashboard.types";

interface CreateChallengeModalProps {
  challengedId: string;
  challengedUsername: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateChallengeModal({
  challengedId,
  challengedUsername,
  onClose,
  onSuccess,
}: CreateChallengeModalProps) {
  const [raceType, setRaceType] = useState("quarter_mile");
  const [agreedLocation, setAgreedLocation] = useState("");
  const [agreedDate, setAgreedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreedLocation.trim()) {
      setError("La ubicación es obligatoria");
      return;
    }
    if (!agreedDate) {
      setError("La fecha y hora son obligatorias");
      return;
    }

    setLoading(true);
    try {
      const payload: CreateChallengeRequest = {
        challengedId,
        raceType,
        agreedLocation: agreedLocation.trim(),
        agreedDate: new Date(agreedDate).toISOString(),
        notes: notes.trim() || undefined,
      };

      const response = await challengeService.create(payload);
      if (response.success) {
        onSuccess();
      } else {
        setError(response.error || "Error al crear el reto");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Retar a {challengedUsername}</span>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {error && (
          <div style={{ color: "var(--color-error)", fontSize: "0.85rem", padding: "8px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            {error}
          </div>
        )}

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label className="modal-label">Piloto Retado</label>
            <input
              type="text"
              className="modal-input"
              value={challengedUsername}
              disabled
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Tipo de Carrera</label>
            <select
              className="modal-select"
              value={raceType}
              onChange={(e) => setRaceType(e.target.value)}
            >
              <option value="quarter_mile">Cuarto de Milla (1/4)</option>
              <option value="half_mile">Media Milla (1/2)</option>
              <option value="full_mile">Milla Completa (1)</option>
              <option value="circuit">Circuito Cerrado</option>
              <option value="street">Carrera Callejera (A a B)</option>
            </select>
          </div>

          <div className="modal-field">
            <label className="modal-label">Ubicación (Acordada)</label>
            <input
              type="text"
              className="modal-input"
              placeholder="Ej: Puente de la 4 Sur..."
              value={agreedLocation}
              onChange={(e) => setAgreedLocation(e.target.value)}
              required
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Fecha y Hora</label>
            <input
              type="datetime-local"
              className="modal-input"
              value={agreedDate}
              onChange={(e) => setAgreedDate(e.target.value)}
              required
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Notas o Reglas (Opcional)</label>
            <textarea
              className="modal-textarea"
              placeholder="Ej: Sin óxido nitroso, llantas de calle..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="modal-submit-btn"
            disabled={loading}
            style={{ marginTop: "10px" }}
          >
            {loading ? "Enviando..." : "ENVIAR RETO"}
          </button>
        </form>
      </div>
    </div>
  );
}

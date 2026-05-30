import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { challengeService } from "../../services/challengeService";
import type { Challenge } from "../../types/dashboard.types";
import rataRetosIcon from "../../assets/icons/IconoRataRetos.png";

interface RataRetosPanelProps {
  challenges: Challenge[];
  onRefresh: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  accepted: "Aceptado",
  rejected: "Rechazado",
  completed: "Completado",
  canceled: "Cancelado",
  disputed: "En Disputa",
};

export default function RataRetosPanel({
  challenges,
  onRefresh,
}: RataRetosPanelProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const recentChallenges = challenges
    .filter((c) => c.status !== "in_progress")
    .sort((a, b) => {
      const aIsReceived = a.challengedId === user?.id && a.status === "pending";
      const bIsReceived = b.challengedId === user?.id && b.status === "pending";
      if (aIsReceived && !bIsReceived) return -1;
      if (!aIsReceived && bIsReceived) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, 7);

  const getRivalName = (challenge: Challenge): string => {
    if (!user) return "";
    return challenge.challengerId === user.id
      ? challenge.challengedName || "Rival"
      : challenge.challengerName || "Rival";
  };

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
    });
  };

  const handleAction = async (
    action: "accept" | "reject" | "cancel" | "start",
    id: string
  ) => {
    setLoading(id);
    try {
      await challengeService[action](id);
      onRefresh();
    } catch {
      // ignore
    } finally {
      setLoading(null);
    }
  };

  const renderActions = (challenge: Challenge) => {
    if (!user) return null;
    const isChallenged = challenge.challengedId === user.id;

    if (challenge.status === "pending" && isChallenged) {
      return (
        <div className="challenge-actions">
          <button
            className="challenge-btn challenge-btn--accept"
            onClick={() => handleAction("accept", challenge.id)}
            disabled={loading === challenge.id}
          >
            Aceptar
          </button>
          <button
            className="challenge-btn challenge-btn--reject"
            onClick={() => handleAction("reject", challenge.id)}
            disabled={loading === challenge.id}
          >
            Rechazar
          </button>
        </div>
      );
    }

    if (challenge.status === "pending" && !isChallenged) {
      return (
        <div className="challenge-actions">
          <button
            className="challenge-btn challenge-btn--cancel"
            onClick={() => handleAction("cancel", challenge.id)}
            disabled={loading === challenge.id}
          >
            Cancelar
          </button>
        </div>
      );
    }

    if (challenge.status === "accepted") {
      return (
        <div className="challenge-actions">
          <button
            className="challenge-btn challenge-btn--start"
            onClick={() => handleAction("start", challenge.id)}
            disabled={loading === challenge.id}
          >
            Iniciar
          </button>
          <button
            className="challenge-btn challenge-btn--cancel"
            onClick={() => handleAction("cancel", challenge.id)}
            disabled={loading === challenge.id}
          >
            Cancelar
          </button>
        </div>
      );
    }

    if (challenge.status === "completed" && user) {
      const won = challenge.winnerId === user.id;
      return (
        <div className={`challenge-result ${won ? "challenge-result--won" : "challenge-result--lost"}`}>
          {won ? "🏆 Victoria" : "💀 Derrota"}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="dashboard-panel center-bottom" id="rata-retos-panel">
      <div className="panel-header">
        <img src={rataRetosIcon} alt="RataRetos" className="panel-icon" />
        <span className="panel-title">Rata Retos</span>
      </div>

      <div className="panel-body">
        {recentChallenges.length === 0 && (
          <div className="panel-empty">
            <span className="panel-empty-text">
              No tienes retos recientes
            </span>
          </div>
        )}

        {recentChallenges.map((challenge) => (
          <div key={challenge.id} className="challenge-card">
            <div className="challenge-top-row">
              <span className="challenge-rival">
                vs {getRivalName(challenge)}
              </span>
              <span className={`challenge-status status-${challenge.status}`}>
                {STATUS_LABELS[challenge.status] || challenge.status}
              </span>
            </div>

            <div className="challenge-details">
              <span className="challenge-detail">
                🏁 {challenge.raceType.replace(/_/g, " ")}
              </span>
              {challenge.agreedLocation && (
                <span className="challenge-detail">
                  📍 {challenge.agreedLocation}
                </span>
              )}
              {challenge.agreedDate && (
                <span className="challenge-detail">
                  📅 {formatDate(challenge.agreedDate)}
                </span>
              )}
            </div>

            {challenge.status === "disputed" && (
              <div style={{
                fontSize: "0.75rem",
                color: "#ef4444",
                marginTop: "8px",
                background: "rgba(239, 68, 68, 0.05)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "4px",
                padding: "6px 8px"
              }}>
                ⚠️ Desacuerdo: El retador reclamó ganador a <strong>{challenge.challengerClaim === challenge.challengerId ? challenge.challengerName : challenge.challengedName}</strong> y el retado a <strong>{challenge.challengedClaim === challenge.challengedId ? challenge.challengedName : challenge.challengerName}</strong>. Un administrador deberá resolverlo.
              </div>
            )}

            {renderActions(challenge)}
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { challengeService } from "../../services/challengeService";
import type { Challenge } from "../../types/dashboard.types";
import retoProgresoIcon from "../../assets/icons/RetoEnProgresoIcono.png";

interface RetosEnProgresoPanelProps {
  challenges: Challenge[];
  onRefresh: () => void;
}

export default function RetosEnProgresoPanel({
  challenges,
  onRefresh,
}: RetosEnProgresoPanelProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const inProgress = challenges.filter((c) => c.status === "in_progress");

  const handleWin = async (challenge: Challenge) => {
    if (!user) return;
    setLoading(challenge.id);
    try {
      await challengeService.complete(challenge.id, user.id);
      onRefresh();
    } catch {
      // ignore
    } finally {
      setLoading(null);
    }
  };

  const handleLose = async (challenge: Challenge) => {
    if (!user) return;
    setLoading(challenge.id);
    const rivalId =
      challenge.challengerId === user.id
        ? challenge.challengedId
        : challenge.challengerId;
    try {
      await challengeService.complete(challenge.id, rivalId);
      onRefresh();
    } catch {
      // ignore
    } finally {
      setLoading(null);
    }
  };

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

  return (
    <div className="dashboard-panel center-top" id="retos-progreso-panel">
      <div className="panel-header">
        <img src={retoProgresoIcon} alt="En Progreso" className="panel-icon" />
        <span className="panel-title">Retos en Progreso</span>
      </div>

      <div className="panel-body">
        {inProgress.length === 0 && (
          <div className="panel-empty">
            <span className="panel-empty-text">
              No tienes retos en progreso
            </span>
          </div>
        )}

        {inProgress.map((challenge) => (
          <div key={challenge.id} className="challenge-card">
            <div className="challenge-top-row">
              <span className="challenge-rival">
                vs {getRivalName(challenge)}
              </span>
              <span className="challenge-status status-in_progress">
                En Progreso
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

            {(() => {
              const isChallenger = challenge.challengerId === user?.id;
              const myClaim = isChallenger ? challenge.challengerClaim : challenge.challengedClaim;
              const hasClaimed = myClaim !== null && myClaim !== undefined && myClaim !== "";

              if (hasClaimed) {
                return (
                  <div className="challenge-waiting" style={{ 
                    textAlign: "center", 
                    padding: "8px", 
                    fontSize: "0.8rem", 
                    color: "#ff6b35",
                    background: "rgba(255, 107, 53, 0.05)",
                    border: "1px dashed rgba(255, 107, 53, 0.3)",
                    borderRadius: "6px",
                    width: "100%",
                    fontWeight: 500,
                    marginTop: "8px"
                  }}>
                    ⏳ Reclamaste {myClaim === user?.id ? "victoria" : "derrota"}. Esperando al rival...
                  </div>
                );
              }

              return (
                <div className="challenge-actions">
                  <button
                    className="challenge-btn challenge-btn--win"
                    onClick={() => handleWin(challenge)}
                    disabled={loading === challenge.id}
                  >
                    🏆 Gané
                  </button>
                  <button
                    className="challenge-btn challenge-btn--lose"
                    onClick={() => handleLose(challenge)}
                    disabled={loading === challenge.id}
                  >
                    💀 Perdí
                  </button>
                </div>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  );
}

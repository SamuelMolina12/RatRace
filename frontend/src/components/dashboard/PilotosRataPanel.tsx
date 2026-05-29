import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { userService } from "../../services/userService";
import type { DiscoverPilot } from "../../types/dashboard.types";
import pilotosIcon from "../../assets/icons/PilotosRataIcono.png";

interface PilotosRataPanelProps {
  onChallenge: (pilot: DiscoverPilot) => void;
  onMessage: (pilot: DiscoverPilot) => void;
}

export default function PilotosRataPanel({
  onChallenge,
  onMessage,
}: PilotosRataPanelProps) {
  const [pilots, setPilots] = useState<DiscoverPilot[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPilots = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const response = await userService.discoverPilots({ page: p, limit: 10 });
      if (response.success && response.data) {
        setPilots(response.data.items);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPilots(page);
  }, [page, fetchPilots]);

  const handleRefresh = () => {
    setRefreshing(true);
    setPage((prev) => prev + 1);
  };

  return (
    <div className="dashboard-panel" id="pilotos-rata-panel">
      <div className="panel-header">
        <img src={pilotosIcon} alt="Pilotos" className="panel-icon" />
        <span className="panel-title">Pilotos Rata</span>
        <button
          className={`panel-action-btn ${refreshing ? "spinning" : ""}`}
          onClick={handleRefresh}
          title="Refrescar pilotos"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
        </button>
      </div>

      <div className="panel-body">
        {loading && (
          <div className="panel-loading">
            <div className="panel-spinner" />
          </div>
        )}

        {!loading && pilots.length === 0 && (
          <div className="panel-empty">
            <span className="panel-empty-text">
              No hay pilotos disponibles en tu rango
            </span>
          </div>
        )}

        {!loading &&
          pilots.map((pilot) => {
            const activeVehicle = pilot.vehicles.find((v) => v.active);

            return (
              <div key={pilot.id} className="pilot-card">
                {pilot.profilePhoto ? (
                  <img
                    src={pilot.profilePhoto}
                    alt={pilot.username}
                    className="pilot-avatar"
                  />
                ) : (
                  <div className="pilot-avatar-placeholder">
                    {pilot.username.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="pilot-info">
                  <div className="pilot-name">{pilot.username}</div>
                  <div className="pilot-meta">
                    <span className={`header-rank rank-${pilot.rank}`}>
                      {pilot.rank}
                    </span>
                    <span className="pilot-wins">W:{pilot.wins}</span>
                  </div>
                  {activeVehicle && (
                    <div className="pilot-vehicle">
                      {activeVehicle.brand} {activeVehicle.model}
                    </div>
                  )}
                </div>

                <div className="pilot-actions">
                  <button
                    className="pilot-btn pilot-btn--challenge"
                    onClick={() => onChallenge(pilot)}
                  >
                    Retar
                  </button>
                  <button
                    className="pilot-btn pilot-btn--message"
                    onClick={() => onMessage(pilot)}
                  >
                    Mensaje
                  </button>
                  <Link
                    to={`/profile/${pilot.id}`}
                    className="pilot-btn pilot-btn--profile"
                  >
                    Perfil
                  </Link>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

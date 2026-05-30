import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminService } from "../services/adminService";
import type {
  AdminChallenge,
  AdminChallengesResponse,
} from "../types/admin.types";
import Button from "../components/Button";
import AdminSectionNav from "../components/admin/AdminSectionNav";
import fondoPagina from "../assets/backgrounds/fondoPagina.png";
import logoRatRace from "../assets/logos/logoRatRace.png";
import "./DashboardPage.css";
import "./ProfilePage.css";
import "./AdminPage.css";

const PAGE_SIZE = 10;

export default function AdminChallengesPage() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<AdminChallengesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selectedChallenge, setSelectedChallenge] =
    useState<AdminChallenge | null>(null);
  const [winnerId, setWinnerId] = useState("");
  const [saving, setSaving] = useState(false);

  const loadChallenges = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await adminService.getChallenges({
        page,
        pageSize: PAGE_SIZE,
        status: status || undefined,
      });

      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || "No se pudieron cargar los retos");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "No se pudieron cargar los retos",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, [page, status]);

  const canChooseWinner = (challenge: AdminChallenge) =>
    (challenge.status === "completed" || challenge.status === "disputed") &&
    !challenge.winnerId;

  const openResolve = (challenge: AdminChallenge) => {
    setSelectedChallenge(challenge);
    setWinnerId(challenge.challengerId);
  };

  const closeResolve = () => {
    if (saving) return;
    setSelectedChallenge(null);
    setWinnerId("");
  };

  const confirmResolve = async () => {
    if (!selectedChallenge || !winnerId) return;

    setSaving(true);
    try {
      const response = await adminService.resolveChallenge(
        selectedChallenge.id,
        {
          action: "set_winner",
          winnerId,
        },
      );

      if (response.success) {
        setSelectedChallenge(null);
        setWinnerId("");
        await loadChallenges();
      }
    } finally {
      setSaving(false);
    }
  };

  const statusLabel = useMemo(
    () => ({
      pending: "Pendiente",
      accepted: "Aceptado",
      rejected: "Rechazado",
      in_progress: "En curso",
      completed: "Completado",
      canceled: "Cancelado",
      disputed: "En disputa",
    }),
    [],
  );

  return (
    <div className="admin-page">
      <div
        className="admin-bg"
        style={{ backgroundImage: `url(${fondoPagina})` }}
      >
        <div className="admin-bg-overlay" />
      </div>

      <nav className="profile-topbar">
        <div className="profile-topbar-left">
          <img
            src={logoRatRace}
            alt="RatRace"
            className="profile-topbar-logo"
          />
        </div>

        <div className="admin-topbar-actions">
          <span className="admin-role-badge">Admin</span>
          <Link to={`/profile/${user?.id}`} className="admin-topbar-link">
            Mi perfil
          </Link>
          <button
            className="pilot-btn pilot-btn--message"
            onClick={logout}
            style={{ padding: "8px 12px", fontSize: "0.7rem" }}
          >
            Salir
          </button>
        </div>
      </nav>

      <div className="admin-content">
        <AdminSectionNav />

        <section className="admin-hero">
          <span className="profile-rank-label">Gestión de retos</span>
          <h1 className="profile-username">Retos registrados</h1>
          <p className="admin-hero-copy">
            Revisa los retos y asigna ganador cuando corresponda.
          </p>
        </section>

        <div className="admin-toolbar">
          <div
            className="admin-filter-grid"
            style={{ gridTemplateColumns: "1fr auto" }}
          >
            <div className="admin-filter-field">
              <label
                className="admin-filter-label"
                htmlFor="admin-challenge-status"
              >
                Estado
              </label>
              <select
                id="admin-challenge-status"
                className="admin-filter-select"
                value={status}
                onChange={(e) => {
                  setPage(1);
                  setStatus(e.target.value);
                }}
              >
                <option value="">Todos</option>
                <option value="pending">Pendiente</option>
                <option value="accepted">Aceptado</option>
                <option value="in_progress">En curso</option>
                <option value="completed">Completado</option>
                <option value="disputed">En disputa</option>
                <option value="canceled">Cancelado</option>
              </select>
            </div>

            <div className="admin-filter-actions">
              <Button
                type="button"
                variant="secondary"
                fullWidth={false}
                onClick={() => {
                  setPage(1);
                  setStatus("");
                }}
              >
                Limpiar
              </Button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="dashboard-panel admin-users-panel">
            <div className="panel-loading">
              <div className="panel-spinner" />
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="dashboard-panel admin-users-panel">
            <div className="panel-body">
              <div className="panel-empty">
                <span className="panel-empty-text">{error}</span>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && data && (
          <>
            <div className="dashboard-panel admin-users-panel">
              <div className="panel-header">
                <span className="panel-title">Listado de retos</span>
              </div>
              <div className="panel-body">
                {data.challenges.length === 0 ? (
                  <div className="panel-empty">
                    <span className="panel-empty-text">
                      No hay retos para mostrar
                    </span>
                  </div>
                ) : (
                  <div className="admin-user-list">
                    {data.challenges.map((challenge) => (
                      <div
                        key={challenge.id}
                        className="admin-user-row"
                        style={{ gridTemplateColumns: "1.6fr auto auto" }}
                      >
                        <div className="admin-user-main">
                          <div className="admin-user-avatar-placeholder">⚑</div>
                          <div style={{ minWidth: 0 }}>
                            <div className="admin-user-name">
                              {challenge.challenger.username} vs{" "}
                              {challenge.challenged.username}
                            </div>
                            <div className="admin-user-email">
                              {challenge.raceType}
                            </div>
                            {challenge.status === "disputed" && (
                              <div style={{
                                fontSize: "0.75rem",
                                color: "#ef4444",
                                marginTop: "6px",
                                background: "rgba(239, 68, 68, 0.05)",
                                border: "1px solid rgba(239, 68, 68, 0.2)",
                                borderRadius: "4px",
                                padding: "6px 8px",
                                display: "inline-block",
                                lineHeight: "1.4"
                              }}>
                                ⚠️ Conflicto: 
                                <strong> {challenge.challenger.username}</strong> reclamó ganador a <em>{challenge.challengerClaim === challenge.challengerId ? challenge.challenger.username : challenge.challenged.username}</em> | 
                                <strong> {challenge.challenged.username}</strong> reclamó ganador a <em>{challenge.challengedClaim === challenge.challengedId ? challenge.challenged.username : challenge.challenger.username}</em>
                              </div>
                            )}
                            <div
                              className="admin-user-meta"
                              style={{ marginTop: "8px" }}
                            >
                              <span className="admin-chip admin-chip--role">
                                {statusLabel[
                                  challenge.status as keyof typeof statusLabel
                                ] || challenge.status}
                              </span>
                              <span className="admin-user-rank">
                                Ganador:{" "}
                                {challenge.winnerId
                                  ? challenge.winnerId === challenge.challengerId
                                    ? challenge.challenger.username
                                    : challenge.challenged.username
                                  : "Sin definir"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="admin-user-actions">
                          <Link
                            to={`/admin/users/${challenge.challengerId}`}
                            className="admin-user-link"
                          >
                            Retador
                          </Link>
                          <Link
                            to={`/admin/users/${challenge.challengedId}`}
                            className="admin-user-link"
                          >
                            Retado
                          </Link>
                        </div>

                        <div className="admin-user-actions">
                          {canChooseWinner(challenge) ? (
                            <Button
                              type="button"
                              fullWidth={false}
                              onClick={() => openResolve(challenge)}
                            >
                              Elegir ganador
                            </Button>
                          ) : (
                            <span className="admin-state-badge admin-state-ACTIVO">
                              Cerrado
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="admin-pagination">
              <div className="admin-pagination-info">
                Mostrando {data.challenges.length} de {data.pagination.total}{" "}
                retos
              </div>
              <div className="admin-pagination-actions">
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth={false}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page <= 1}
                >
                  Anterior
                </Button>
                <span className="admin-role-badge">
                  Página {data.pagination.page} de {data.pagination.pages || 1}
                </span>
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth={false}
                  onClick={() =>
                    setPage((prev) =>
                      Math.min(prev + 1, data.pagination.pages || 1),
                    )
                  }
                  disabled={page >= (data.pagination.pages || 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedChallenge && (
        <div className="p-modal-overlay" onClick={closeResolve}>
          <div className="p-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-modal-header">
              <span className="p-modal-title">Elegir ganador</span>
              <button className="p-modal-close-btn" onClick={closeResolve}>
                ✕
              </button>
            </div>

            <p className="admin-confirm-text">
              Selecciona al piloto ganador para este reto.
            </p>

            <div className="admin-confirm-summary">
              <span>Reto</span>
              <strong>
                {selectedChallenge.challenger.username} vs{" "}
                {selectedChallenge.challenged.username}
              </strong>
              <span>{selectedChallenge.raceType}</span>
            </div>

            <div className="admin-filter-field">
              <label className="admin-filter-label" htmlFor="winner-select">
                Ganador
              </label>
              <select
                id="winner-select"
                className="admin-filter-select"
                value={winnerId}
                onChange={(e) => setWinnerId(e.target.value)}
              >
                <option value={selectedChallenge.challengerId}>
                  {selectedChallenge.challenger.username}
                </option>
                <option value={selectedChallenge.challengedId}>
                  {selectedChallenge.challenged.username}
                </option>
              </select>
            </div>

            <div className="admin-confirm-actions">
              <Button
                type="button"
                variant="secondary"
                fullWidth={false}
                onClick={closeResolve}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                fullWidth={false}
                isLoading={saving}
                onClick={confirmResolve}
              >
                Confirmar ganador
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

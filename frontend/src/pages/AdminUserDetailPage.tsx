import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminService } from "../services/adminService";
import type { AdminUser } from "../types/admin.types";
import Button from "../components/Button";
import AdminSectionNav from "../components/admin/AdminSectionNav";
import fondoPagina from "../assets/backgrounds/fondoPagina.png";
import logoRatRace from "../assets/logos/logoRatRace.png";
import "./DashboardPage.css";
import "./ProfilePage.css";
import "./AdminPage.css";

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "suspend" | "activate" | null
  >(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;

      setLoading(true);
      setError("");

      try {
        const response = await adminService.getUserById(id);
        if (response.success && response.data) {
          setProfile(response.data);
        } else {
          setError(response.error || "No se pudo cargar el usuario");
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "No se pudo cargar el usuario",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const refreshUser = async () => {
    if (!id) return;
    const response = await adminService.getUserById(id);
    if (response.success && response.data) {
      setProfile(response.data);
    }
  };

  const openAction = (action: "suspend" | "activate") => {
    setPendingAction(action);
  };

  const closeAction = () => {
    if (actionLoading) return;
    setPendingAction(null);
  };

  const confirmAction = async () => {
    if (!pendingAction || !profile) return;

    setActionLoading(true);
    try {
      const response =
        pendingAction === "suspend"
          ? await adminService.suspendUser(profile.id)
          : await adminService.activateUser(profile.id);

      if (response.success) {
        await refreshUser();
        setPendingAction(null);
      }
    } catch {
      // ignore
    } finally {
      setActionLoading(false);
    }
  };

  const stats = profile
    ? [
        { label: "Victorias", value: profile.wins, tone: "wins" },
        { label: "Derrotas", value: profile.losses, tone: "losses" },
        {
          label: "Racha actual",
          value: profile.consecutiveWins,
          tone: "streak",
        },
        { label: "Rango", value: profile.rank, tone: "winrate" },
      ]
    : [];

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

        {loading && (
          <div className="admin-loading-state dashboard-panel">
            <div className="panel-loading">
              <div className="panel-spinner" />
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="admin-error-state dashboard-panel">
            <div className="panel-body">
              <div className="panel-empty">
                <span className="panel-empty-text">{error}</span>
              </div>
            </div>
          </div>
        )}

        {!loading && profile && (
          <>
            <section className="admin-hero">
              <span className="profile-rank-label">Detalle de usuario</span>
              <h1 className="profile-username">{profile.username}</h1>
              <p className="admin-hero-copy">
                Información completa del usuario con estado, rango y acciones de
                administración.
              </p>
            </section>

            <section className="profile-hero">
              <div className="profile-avatar-container">
                <div className="profile-avatar-ring">
                  {profile.profilePhoto ? (
                    <img
                      src={profile.profilePhoto}
                      alt={profile.username}
                      className="profile-avatar-img"
                    />
                  ) : (
                    <div className="profile-avatar-fallback">
                      {profile.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div
                  className={`profile-rank-badge-floating profile-rank-badge-${profile.rank}`}
                >
                  {profile.rank}
                </div>
              </div>

              <span
                className={`profile-rank-label profile-rank-${profile.rank}`}
              >
                Rango {profile.rank}
              </span>

              <div className="admin-user-meta">
                <span className="admin-chip admin-chip--role">
                  {profile.role}
                </span>
                <span
                  className={`admin-state-badge admin-state-${profile.estado}`}
                >
                  {profile.estado}
                </span>
              </div>

              <div className="admin-confirm-actions">
                {profile.estado === "ACTIVO" ? (
                  <Button
                    type="button"
                    variant="secondary"
                    fullWidth={false}
                    onClick={() => openAction("suspend")}
                  >
                    Suspender usuario
                  </Button>
                ) : (
                  <Button
                    type="button"
                    fullWidth={false}
                    onClick={() => openAction("activate")}
                  >
                    Activar usuario
                  </Button>
                )}
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth={false}
                  onClick={() => navigate(`/profile/${profile.id}`)}
                >
                  Ver perfil público
                </Button>
              </div>
            </section>

            <div className="admin-stats-grid">
              {stats.map((stat) => (
                <div key={stat.label} className="profile-stat-card">
                  <div className={`profile-stat-value ${stat.tone}`}>
                    {stat.value}
                  </div>
                  <div className="profile-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="dashboard-panel">
              <div className="panel-header">
                <span className="panel-title">Información general</span>
              </div>
              <div className="panel-body">
                <div className="admin-detail-grid">
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Email</span>
                    <div className="admin-detail-value">{profile.email}</div>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Estado de cuenta</span>
                    <div className="admin-detail-value">{profile.estado}</div>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Localidad</span>
                    <div className="admin-detail-value">
                      {profile.locality || "No registrada"}
                    </div>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Ciudad</span>
                    <div className="admin-detail-value">
                      {profile.city || "No registrada"}
                    </div>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">
                      Departamento / Estado
                    </span>
                    <div className="admin-detail-value">
                      {profile.state || "No registrado"}
                    </div>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">País</span>
                    <div className="admin-detail-value">
                      {profile.country || "No registrado"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {pendingAction && profile && (
        <div className="p-modal-overlay" onClick={closeAction}>
          <div className="p-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-modal-header">
              <span className="p-modal-title">
                {pendingAction === "suspend"
                  ? "Suspender usuario"
                  : "Activar usuario"}
              </span>
              <button className="p-modal-close-btn" onClick={closeAction}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <p className="admin-confirm-text">
              {pendingAction === "suspend"
                ? "El usuario quedará suspendido desde esta pantalla hasta que se reactive."
                : "El usuario volverá a quedar habilitado para administración."}
            </p>

            <div className="admin-confirm-summary">
              <span>Usuario</span>
              <strong>{profile.username}</strong>
              <span>{profile.email}</span>
            </div>

            <div className="admin-confirm-actions">
              <Button
                type="button"
                variant="secondary"
                fullWidth={false}
                onClick={closeAction}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                fullWidth={false}
                isLoading={actionLoading}
                onClick={confirmAction}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

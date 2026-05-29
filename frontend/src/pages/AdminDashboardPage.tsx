import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminService } from "../services/adminService";
import type { AdminDashboard } from "../types/admin.types";
import Button from "../components/Button";
import AdminSectionNav from "../components/admin/AdminSectionNav";
import fondoPagina from "../assets/backgrounds/fondoPagina.png";
import logoRatRace from "../assets/logos/logoRatRace.png";
import "./DashboardPage.css";
import "./ProfilePage.css";
import "./AdminPage.css";

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await adminService.getDashboard();
        if (response.success && response.data) {
          setDashboard(response.data);
        } else {
          setError(response.error || "No se pudo cargar el dashboard");
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "No se pudo cargar el dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = dashboard
    ? [
        { label: "Total usuarios", value: dashboard.totalUsers },
        { label: "Usuarios activos", value: dashboard.activeUsers },
        { label: "Usuarios suspendidos", value: dashboard.suspendedUsers },
        { label: "Total vehículos", value: dashboard.totalVehicles },
        { label: "Total retos", value: dashboard.totalChallenges },
        { label: "Retos completados", value: dashboard.completedChallenges },
        { label: "Retos pendientes", value: dashboard.pendingChallenges },
        { label: "Rangos registrados", value: dashboard.usersByRank.length },
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

        <section className="admin-hero">
          <span className="profile-rank-label">Panel Administrativo</span>
          <h1 className="profile-username">Vista general</h1>
          <p className="admin-hero-copy">
            Consulta los indicadores principales y entra a la gestión de
            usuarios desde esta pantalla.
          </p>
        </section>

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

        {!loading && dashboard && (
          <>
            <div className="admin-stats-grid">
              {stats.map((stat) => (
                <div key={stat.label} className="profile-stat-card">
                  <div className="profile-stat-value winrate">{stat.value}</div>
                  <div className="profile-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="admin-panels-grid">
              <div className="dashboard-panel">
                <div className="panel-header">
                  <span className="panel-title">Usuarios por rango</span>
                </div>
                <div className="panel-body">
                  {dashboard.usersByRank.length === 0 ? (
                    <div className="panel-empty">
                      <span className="panel-empty-text">
                        No hay datos de rangos disponibles
                      </span>
                    </div>
                  ) : (
                    <div className="admin-rank-list">
                      {dashboard.usersByRank.map((item) => {
                        const maxCount = Math.max(
                          ...dashboard.usersByRank.map((rank) => rank.count),
                          1,
                        );
                        const width = `${(item.count / maxCount) * 100}%`;

                        return (
                          <div key={item.rank} className="admin-rank-item">
                            <div className="admin-rank-row">
                              <span className="admin-rank-label">
                                Rango {item.rank}
                              </span>
                              <span className="admin-rank-value">
                                {item.count} usuarios
                              </span>
                            </div>
                            <div className="admin-rank-bar">
                              <div
                                className="admin-rank-bar-fill"
                                style={{ width }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="dashboard-panel">
                <div className="panel-header">
                  <span className="panel-title">Acciones rápidas</span>
                </div>
                <div className="panel-body">
                  <div className="admin-quick-actions">
                    <p className="admin-quick-copy">
                      Accede a la gestión de usuarios para revisar información,
                      suspender o reactivar cuentas desde esta vista.
                    </p>
                    <div className="admin-quick-links">
                      <Link to="/admin/users" className="admin-link-pill">
                        Gestionar usuarios
                      </Link>
                      <Link to="/admin/challenges" className="admin-link-pill">
                        Revisar retos
                      </Link>
                      <Button
                        type="button"
                        variant="secondary"
                        fullWidth={false}
                        onClick={() => navigate("/dashboard")}
                      >
                        Volver al dashboard
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminService } from "../services/adminService";
import type { AdminUser, AdminUsersResponse } from "../types/admin.types";
import Input from "../components/Input";
import Button from "../components/Button";
import AdminSectionNav from "../components/admin/AdminSectionNav";
import fondoPagina from "../assets/backgrounds/fondoPagina.png";
import logoRatRace from "../assets/logos/logoRatRace.png";
import "./DashboardPage.css";
import "./ProfilePage.css";
import "./AdminPage.css";

type PendingAction = {
  user: AdminUser;
  action: "suspend" | "activate";
};

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const { user, logout } = useAuth();

  const [data, setData] = useState<AdminUsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [estado, setEstado] = useState("");
  const [role, setRole] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedEstado, setAppliedEstado] = useState("");
  const [appliedRole, setAppliedRole] = useState("");
  const [page, setPage] = useState(1);

  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await adminService.getUsers({
          page,
          pageSize: PAGE_SIZE,
          search: appliedSearch || undefined,
          estado: appliedEstado || undefined,
          role: appliedRole || undefined,
        });

        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.error || "No se pudieron cargar los usuarios");
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar los usuarios",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, appliedSearch, appliedEstado, appliedRole]);

  const applyFilters = (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    setAppliedSearch(searchInput.trim());
    setAppliedEstado(estado);
    setAppliedRole(role);
  };

  const clearFilters = () => {
    setSearchInput("");
    setEstado("");
    setRole("");
    setAppliedSearch("");
    setAppliedEstado("");
    setAppliedRole("");
    setPage(1);
  };

  const openAction = (
    selectedUser: AdminUser,
    action: "suspend" | "activate",
  ) => {
    setPendingAction({ user: selectedUser, action });
  };

  const closeAction = () => {
    if (actionLoading) return;
    setPendingAction(null);
  };

  const confirmAction = async () => {
    if (!pendingAction) return;

    setActionLoading(true);
    try {
      const response =
        pendingAction.action === "suspend"
          ? await adminService.suspendUser(pendingAction.user.id)
          : await adminService.activateUser(pendingAction.user.id);

      if (response.success) {
        setPendingAction(null);
        const refreshed = await adminService.getUsers({
          page,
          pageSize: PAGE_SIZE,
          search: appliedSearch || undefined,
          estado: appliedEstado || undefined,
          role: appliedRole || undefined,
        });

        if (refreshed.success && refreshed.data) {
          setData(refreshed.data);
        }
      }
    } catch {
      // ignore
    } finally {
      setActionLoading(false);
    }
  };

  const total = data?.pagination.total ?? 0;

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
          <span className="profile-rank-label">Gestión de usuarios</span>
          <h1 className="profile-username">Usuarios registrados</h1>
          <p className="admin-hero-copy">
            Busca, filtra y administra cuentas desde esta pantalla.
          </p>
        </section>

        <div className="admin-toolbar">
          <form className="admin-filter-grid" onSubmit={applyFilters}>
            <Input
              label="Buscar"
              type="text"
              id="admin-user-search"
              placeholder="Username o email"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />

            <div className="admin-filter-field">
              <label
                className="admin-filter-label"
                htmlFor="admin-estado-filter"
              >
                Estado
              </label>
              <select
                id="admin-estado-filter"
                className="admin-filter-select"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="ACTIVO">ACTIVO</option>
                <option value="SUSPENDIDO">SUSPENDIDO</option>
              </select>
            </div>

            <div className="admin-filter-field">
              <label className="admin-filter-label" htmlFor="admin-role-filter">
                Rol
              </label>
              <select
                id="admin-role-filter"
                className="admin-filter-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="PILOT">PILOT</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div className="admin-filter-actions">
              <Button type="submit" fullWidth={false}>
                Buscar
              </Button>
              <Button
                type="button"
                variant="secondary"
                fullWidth={false}
                onClick={clearFilters}
              >
                Limpiar
              </Button>
            </div>
          </form>
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
                <span className="panel-title">Listado de usuarios</span>
              </div>
              <div className="panel-body">
                {data.users.length === 0 ? (
                  <div className="panel-empty">
                    <span className="panel-empty-text">
                      No se encontraron usuarios con esos filtros
                    </span>
                  </div>
                ) : (
                  <div className="admin-user-list">
                    {data.users.map((adminUser) => (
                      <div key={adminUser.id} className="admin-user-row">
                        <div className="admin-user-main">
                          {adminUser.profilePhoto ? (
                            <img
                              src={adminUser.profilePhoto}
                              alt={adminUser.username}
                              className="admin-user-avatar"
                            />
                          ) : (
                            <div className="admin-user-avatar-placeholder">
                              {adminUser.username.charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div style={{ minWidth: 0 }}>
                            <div className="admin-user-name">
                              {adminUser.username}
                            </div>
                            <div className="admin-user-email">
                              {adminUser.email}
                            </div>
                            <div
                              className="admin-user-meta"
                              style={{ marginTop: "8px" }}
                            >
                              <span className="admin-chip admin-chip--role">
                                {adminUser.role}
                              </span>
                              <span
                                className={`admin-chip admin-chip--estado-${adminUser.estado}`}
                              >
                                {adminUser.estado}
                              </span>
                              <span className="admin-user-rank">
                                Rango {adminUser.rank}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="admin-user-actions">
                          <Link
                            to={`/admin/users/${adminUser.id}`}
                            className="admin-user-link"
                          >
                            Ver detalle
                          </Link>
                        </div>

                        <div className="admin-user-actions">
                          {adminUser.estado === "ACTIVO" ? (
                            <Button
                              type="button"
                              variant="secondary"
                              fullWidth={false}
                              onClick={() => openAction(adminUser, "suspend")}
                            >
                              Suspender
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              fullWidth={false}
                              onClick={() => openAction(adminUser, "activate")}
                            >
                              Activar
                            </Button>
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
                Mostrando {data.users.length} de {total} usuarios
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

      {pendingAction && (
        <div className="p-modal-overlay" onClick={closeAction}>
          <div className="p-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-modal-header">
              <span className="p-modal-title">
                {pendingAction.action === "suspend"
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
              {pendingAction.action === "suspend"
                ? "El usuario quedará suspendido hasta que lo actives nuevamente desde esta pantalla."
                : "El usuario volverá a estar disponible para las acciones de administración."}
            </p>

            <div className="admin-confirm-summary">
              <span>Usuario</span>
              <strong>{pendingAction.user.username}</strong>
              <span>{pendingAction.user.email}</span>
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

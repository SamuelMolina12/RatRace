import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logoRatRace from "../../assets/logos/logoRatRace.png";
import iconoCampana from "../../assets/icons/IconoCampana.png";

interface DashboardHeaderProps {
  unreadCount: number;
  onToggleNotifications: () => void;
}

export default function DashboardHeader({
  unreadCount,
  onToggleNotifications,
}: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-left">
        <img src={logoRatRace} alt="RatRace" className="dashboard-logo" />
      </div>

      <div className="dashboard-header-right">
        <div className="dashboard-header-action-group">
          <button
            className="header-icon-btn"
            onClick={onToggleNotifications}
            id="notification-bell-btn"
          >
            <img src={iconoCampana} alt="Notificaciones" />
            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {isAdmin && (
            <Link to="/admin/dashboard" className="header-admin-btn">
              Admin
            </Link>
          )}
        </div>

        <Link
          to={`/profile/${user?.id}`}
          className="header-profile"
          id="profile-link"
        >
          {user?.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt={user.username}
              className="header-avatar"
            />
          ) : (
            <div className="header-avatar-placeholder">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="header-username">{user?.username}</div>
            <span className={`header-rank rank-${user?.rank}`}>
              Rango {user?.rank}
            </span>
          </div>
        </Link>

        <button
          className="pilot-btn pilot-btn--message"
          onClick={logout}
          style={{ padding: "8px 12px", fontSize: "0.7rem" }}
        >
          Salir
        </button>
      </div>
    </header>
  );
}

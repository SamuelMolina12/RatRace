import { useState } from "react";
import type { Notification } from "../../types/dashboard.types";
import { notificationService } from "../../services/notificationService";
import { challengeService } from "../../services/challengeService";

interface NotificationDropdownProps {
  notifications: Notification[];
  onClose: () => void;
  onRefresh: () => void;
}

function getNotifIcon(type: string): string {
  if (type.includes("challenge")) return "⚔️";
  if (type.includes("chat")) return "💬";
  if (type.includes("rank")) return "🏆";
  return "🔔";
}

function getNotifTypeClass(type: string): string {
  if (type.includes("challenge")) return "notif-type-challenge";
  if (type.includes("chat")) return "notif-type-chat";
  if (type.includes("rank")) return "notif-type-rank";
  return "notif-type-challenge";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function NotificationDropdown({
  notifications,
  onClose,
  onRefresh,
}: NotificationDropdownProps) {
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = showAll
    ? notifications
    : notifications.filter((n) => !n.read);

  const handleMarkRead = async (id: string) => {
    await notificationService.markAsRead(id);
    onRefresh();
  };

  const handleAcceptChallenge = async (referenceId: string, notifId: string) => {
    setLoading(notifId);
    try {
      await challengeService.accept(referenceId);
      await notificationService.markAsRead(notifId);
      onRefresh();
    } finally {
      setLoading(null);
    }
  };

  const handleRejectChallenge = async (referenceId: string, notifId: string) => {
    setLoading(notifId);
    try {
      await challengeService.reject(referenceId);
      await notificationService.markAsRead(notifId);
      onRefresh();
    } finally {
      setLoading(null);
    }
  };

  const handleStartChallenge = async (referenceId: string, notifId: string) => {
    setLoading(notifId);
    try {
      await challengeService.start(referenceId);
      await notificationService.markAsRead(notifId);
      onRefresh();
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="notification-dropdown" id="notification-dropdown">
      <div className="notification-dropdown-header">
        <span className="notification-dropdown-title">Notificaciones</span>
        <button className="notification-close-btn" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="notification-toggle-row">
        <span className={`notification-toggle-label ${!showAll ? "active" : ""}`}>
          No leídas
        </span>
        <button
          className={`notification-toggle-switch ${showAll ? "on" : ""}`}
          onClick={() => setShowAll(!showAll)}
        >
          <div className="notification-toggle-knob" />
        </button>
        <span className={`notification-toggle-label ${showAll ? "active" : ""}`}>
          Todas
        </span>
      </div>

      <div className="notification-list">
        {filtered.length === 0 && (
          <div className="panel-empty">
            <span className="panel-empty-text">
              {showAll ? "Sin notificaciones" : "Sin notificaciones nuevas"}
            </span>
          </div>
        )}

        {filtered.map((notif) => (
          <div
            key={notif.id}
            className={`notification-item ${!notif.read ? "unread" : ""}`}
            onClick={() => !notif.read && handleMarkRead(notif.id)}
          >
            <div className={`notification-type-icon ${getNotifTypeClass(notif.type)}`}>
              {getNotifIcon(notif.type)}
            </div>

            <div className="notification-content">
              <div className="notification-message">{notif.message}</div>
              <div className="notification-time">{timeAgo(notif.createdAt)}</div>

              {notif.type === "challenge_received" && notif.referenceId && !notif.read && (
                <div className="notification-actions">
                  <button
                    className="notif-action-btn challenge-btn--accept"
                    disabled={loading === notif.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcceptChallenge(notif.referenceId!, notif.id);
                    }}
                  >
                    Aceptar
                  </button>
                  <button
                    className="notif-action-btn challenge-btn--reject"
                    disabled={loading === notif.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRejectChallenge(notif.referenceId!, notif.id);
                    }}
                  >
                    Rechazar
                  </button>
                </div>
              )}

              {notif.type === "challenge_accepted" && notif.referenceId && !notif.read && (
                <div className="notification-actions">
                  <button
                    className="notif-action-btn challenge-btn--start"
                    disabled={loading === notif.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartChallenge(notif.referenceId!, notif.id);
                    }}
                  >
                    Iniciar Reto
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

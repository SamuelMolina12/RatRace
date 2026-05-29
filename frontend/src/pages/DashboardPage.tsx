import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { notificationService } from "../services/notificationService";
import { challengeService } from "../services/challengeService";
import { SOCKET_EVENT } from "../sockets/socketEvents";

import type { Notification, Challenge, DiscoverPilot } from "../types/dashboard.types";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import NotificationDropdown from "../components/dashboard/NotificationDropdown";
import PilotosRataPanel from "../components/dashboard/PilotosRataPanel";
import RetosEnProgresoPanel from "../components/dashboard/RetosEnProgresoPanel";
import RataRetosPanel from "../components/dashboard/RataRetosPanel";
import ChatPanel from "../components/dashboard/ChatPanel";
import CreateChallengeModal from "../components/dashboard/CreateChallengeModal";

import fondoPagina from "../assets/backgrounds/fondoPagina.png";
import "./DashboardPage.css";

export default function DashboardPage() {
  const { user, refreshProfile } = useAuth();
  const { socket } = useSocket();
  const location = useLocation();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  const [openChatUserId, setOpenChatUserId] = useState<string | null>(null);

  const [challengeTarget, setChallengeTarget] = useState<{ id: string; username: string } | null>(null);

  useEffect(() => {
    if (location.state) {
      const state = location.state as { openChatUserId?: string; challengeTarget?: { id: string; username: string } };
      if (state.openChatUserId) {
        setOpenChatUserId(state.openChatUserId);
      }
      if (state.challengeTarget) {
        setChallengeTarget(state.challengeTarget);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const loadNotifications = useCallback(async () => {
    try {
      const response = await notificationService.getMyNotifications();
      if (response.success && response.data) {
        setNotifications(response.data);
      }
    } catch {
      // ignore
    }
  }, []);

  const loadChallenges = useCallback(async () => {
    try {
      const response = await challengeService.getMyChallenges();
      if (response.success && response.data) {
        setChallenges(response.data);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    loadChallenges();
    refreshProfile();
  }, [loadNotifications, loadChallenges, refreshProfile]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = () => {
      loadNotifications();
    };

    const handleChallengeUpdate = () => {
      loadChallenges();
      loadNotifications(); 
    };

    const handleRankUpgraded = () => {
      refreshProfile();
      loadNotifications();
    };

    socket.on(SOCKET_EVENT.NOTIFICATION_NEW, handleNewNotification);
    socket.on(SOCKET_EVENT.CHALLENGE_RECEIVED, handleChallengeUpdate);
    socket.on(SOCKET_EVENT.CHALLENGE_ACCEPTED, handleChallengeUpdate);
    socket.on(SOCKET_EVENT.CHALLENGE_REJECTED, handleChallengeUpdate);
    socket.on(SOCKET_EVENT.CHALLENGE_CANCELLED, handleChallengeUpdate);
    socket.on(SOCKET_EVENT.CHALLENGE_STARTED, handleChallengeUpdate);
    socket.on(SOCKET_EVENT.CHALLENGE_COMPLETED, handleChallengeUpdate);
    socket.on(SOCKET_EVENT.RANK_UPGRADED, handleRankUpgraded);

    return () => {
      socket.off(SOCKET_EVENT.NOTIFICATION_NEW, handleNewNotification);
      socket.off(SOCKET_EVENT.CHALLENGE_RECEIVED, handleChallengeUpdate);
      socket.off(SOCKET_EVENT.CHALLENGE_ACCEPTED, handleChallengeUpdate);
      socket.off(SOCKET_EVENT.CHALLENGE_REJECTED, handleChallengeUpdate);
      socket.off(SOCKET_EVENT.CHALLENGE_CANCELLED, handleChallengeUpdate);
      socket.off(SOCKET_EVENT.CHALLENGE_STARTED, handleChallengeUpdate);
      socket.off(SOCKET_EVENT.CHALLENGE_COMPLETED, handleChallengeUpdate);
      socket.off(SOCKET_EVENT.RANK_UPGRADED, handleRankUpgraded);
    };
  }, [socket, loadNotifications, loadChallenges, refreshProfile]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleChallengePilot = (pilot: DiscoverPilot) => {
    setChallengeTarget({ id: pilot.id, username: pilot.username });
  };

  const handleMessagePilot = (pilot: DiscoverPilot) => {
    setOpenChatUserId(pilot.id);
  };

  const handleChallengeFromChat = (userId: string, username: string) => {
    setChallengeTarget({ id: userId, username });
  };

  return (
    <div className="dashboard">
      <div 
        className="dashboard-bg" 
        style={{ backgroundImage: `url(${fondoPagina})` }}
      >
        <div className="dashboard-bg-overlay" />
      </div>

      <DashboardHeader
        unreadCount={unreadCount}
        showNotifications={showNotifications}
        onToggleNotifications={() => setShowNotifications(!showNotifications)}
      />

      {showNotifications && (
        <NotificationDropdown
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onRefresh={loadNotifications}
        />
      )}

      <div className="dashboard-body">
        <PilotosRataPanel
          onChallenge={handleChallengePilot}
          onMessage={handleMessagePilot}
        />

        <div className="dashboard-center">
          <RetosEnProgresoPanel
            challenges={challenges}
            onRefresh={loadChallenges}
          />
          <RataRetosPanel
            challenges={challenges}
            onRefresh={loadChallenges}
          />
        </div>

        <ChatPanel
          onChallenge={handleChallengeFromChat}
          openChatUserId={openChatUserId !== "focus" ? openChatUserId : null}
          onClearOpenChat={() => setOpenChatUserId(null)}
        />
      </div>

      {challengeTarget && (
        <CreateChallengeModal
          challengedId={challengeTarget.id}
          challengedUsername={challengeTarget.username}
          onClose={() => setChallengeTarget(null)}
          onSuccess={() => {
            setChallengeTarget(null);
            loadChallenges();
          }}
        />
      )}
    </div>
  );
}

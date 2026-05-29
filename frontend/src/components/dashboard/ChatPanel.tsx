import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { chatService } from "../../services/chatService";
import { userService } from "../../services/userService";
import { SOCKET_EVENT } from "../../sockets/socketEvents";
import type { Conversation, Message, UserProfile } from "../../types/dashboard.types";
import iconoChat from "../../assets/icons/iconoChat.png";

interface ChatPanelProps {
  onChallenge: (userId: string, username: string) => void;
  openChatUserId?: string | null;
  onClearOpenChat: () => void;
}

export default function ChatPanel({
  onChallenge,
  openChatUserId,
  onClearOpenChat,
}: ChatPanelProps) {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [participantProfiles, setParticipantProfiles] = useState<Record<string, UserProfile>>({});
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      const response = await chatService.getConversations();
      if (response.success && response.data) {
        setConversations(response.data);

        const profiles: Record<string, UserProfile> = {};
        for (const conv of response.data) {
          const otherUserId = conv.participants.find((p) => p !== user?.id);
          if (otherUserId && !participantProfiles[otherUserId]) {
            try {
              const profileRes = await userService.getUserProfile(otherUserId);
              if (profileRes.success && profileRes.data) {
                profiles[otherUserId] = profileRes.data;
              }
            } catch {
              // ignore
            }
          }
        }
        setParticipantProfiles((prev) => ({ ...prev, ...profiles }));
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (openChatUserId && user) {
      const existingConv = conversations.find((c) =>
        c.participants.includes(openChatUserId)
      );
      if (existingConv) {
        setActiveConversation(existingConv.id);
        onClearOpenChat();
      } else {
        const fetchProfileAndCreateTemp = async () => {
          if (!participantProfiles[openChatUserId]) {
            try {
              const profileRes = await userService.getUserProfile(openChatUserId);
              if (profileRes.success && profileRes.data) {
                setParticipantProfiles((prev) => ({
                  ...prev,
                  [openChatUserId]: profileRes.data!,
                }));
              }
            } catch {
              // ignore
            }
          }

          const tempConvId = `temp_${openChatUserId}`;
          const newTempConv: Conversation = {
            id: tempConvId,
            participants: [user.id, openChatUserId],
            lastMessage: "",
            lastMessageAt: new Date().toISOString(),
            unreadCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          setConversations((prev) => {
            if (prev.some((c) => c.id === tempConvId)) return prev;
            return [newTempConv, ...prev];
          });
          setActiveConversation(tempConvId);
          onClearOpenChat();
        };

        fetchProfileAndCreateTemp();
      }
    }
  }, [openChatUserId, conversations, user, onClearOpenChat, participantProfiles]);

  useEffect(() => {
    if (!activeConversation) return;

    if (activeConversation.startsWith("temp_")) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        const response = await chatService.getMessages(activeConversation);
        if (response.success && response.data) {
          setMessages(response.data);
        }
      } catch {
        // ignore
      }
    };

    loadMessages();
  }, [activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: { conversation: Conversation; message: Message }) => {
      const otherId = data.conversation.participants.find((p) => p !== user?.id) || "";
      const isTempMatch = activeConversation?.startsWith("temp_") && activeConversation.endsWith(otherId);

      if (data.message.conversationId === activeConversation || isTempMatch) {
        if (isTempMatch) {
          setActiveConversation(data.conversation.id);
        }
        setMessages((prev) => [...prev, data.message]);
      }
      loadConversations();
    };

    const handleMessageSent = (data: { conversation: Conversation; message: Message }) => {
      const otherId = data.conversation.participants.find((p) => p !== user?.id) || "";
      const isTempMatch = activeConversation?.startsWith("temp_") && activeConversation.endsWith(otherId);

      if (data.message.conversationId === activeConversation || isTempMatch) {
        if (isTempMatch) {
          setActiveConversation(data.conversation.id);
        }
        setMessages((prev) => [...prev, data.message]);
      }
      loadConversations();
    };

    const handleTyping = ({ senderId }: { senderId: string }) => {
      setIsTyping(senderId);
    };

    const handleStopTyping = () => {
      setIsTyping(null);
    };

    socket.on(SOCKET_EVENT.CHAT_MESSAGE_RECEIVED, handleNewMessage);
    socket.on(SOCKET_EVENT.CHAT_MESSAGE_SENT, handleMessageSent);
    socket.on(SOCKET_EVENT.CHAT_TYPING, handleTyping);
    socket.on(SOCKET_EVENT.CHAT_STOP_TYPING, handleStopTyping);

    return () => {
      socket.off(SOCKET_EVENT.CHAT_MESSAGE_RECEIVED, handleNewMessage);
      socket.off(SOCKET_EVENT.CHAT_MESSAGE_SENT, handleMessageSent);
      socket.off(SOCKET_EVENT.CHAT_TYPING, handleTyping);
      socket.off(SOCKET_EVENT.CHAT_STOP_TYPING, handleStopTyping);
    };
  }, [socket, activeConversation, loadConversations, user]);

  const getOtherUserId = (conv: Conversation): string => {
    return conv.participants.find((p) => p !== user?.id) || "";
  };

  const getOtherProfile = (conv: Conversation): UserProfile | undefined => {
    const otherId = getOtherUserId(conv);
    return participantProfiles[otherId];
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !socket || !user || !activeConversation) return;

    const conv = conversations.find((c) => c.id === activeConversation);
    if (!conv) return;

    const receiverId = getOtherUserId(conv);

    socket.emit(SOCKET_EVENT.CHAT_MESSAGE, {
      senderId: user.id,
      receiverId,
      content: messageInput.trim(),
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit(SOCKET_EVENT.CHAT_STOP_TYPING, {
      senderId: user.id,
      receiverId,
    });

    setMessageInput("");
  };

  const handleInputChange = (value: string) => {
    setMessageInput(value);

    if (!socket || !user || !activeConversation) return;

    const conv = conversations.find((c) => c.id === activeConversation);
    if (!conv) return;

    const receiverId = getOtherUserId(conv);

    socket.emit(SOCKET_EVENT.CHAT_TYPING, {
      senderId: user.id,
      receiverId,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(SOCKET_EVENT.CHAT_STOP_TYPING, {
        senderId: user.id,
        receiverId,
      });
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateStr: string): string => {
    return new Date(dateStr).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatConvTime = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "ahora";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    return new Date(dateStr).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
  };

  if (activeConversation) {
    const conv = conversations.find((c) => c.id === activeConversation);
    const otherProfile = conv ? getOtherProfile(conv) : undefined;
    const otherUserId = conv ? getOtherUserId(conv) : "";
    const isOnline = onlineUsers.has(otherUserId);

    return (
      <div className="dashboard-panel" id="chat-panel">
        <div className="chat-active-view">
          <div className="chat-active-header">
            <button
              className="chat-back-btn"
              onClick={() => {
                setActiveConversation(null);
                setMessages([]);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {otherProfile?.profilePhoto ? (
              <img src={otherProfile.profilePhoto} alt="" className="header-avatar" />
            ) : (
              <div className="header-avatar-placeholder">
                {otherProfile?.username?.charAt(0).toUpperCase() || "?"}
              </div>
            )}

            <div style={{ flex: 1 }}>
              <div className="chat-active-name">
                {otherProfile?.username || "Piloto"}
              </div>
              <div className={`chat-active-status ${!isOnline ? "offline" : ""}`}>
                {isOnline ? "En línea" : "Desconectado"}
              </div>
            </div>

            {otherProfile && (
              <button
                className="chat-challenge-btn"
                onClick={() =>
                  onChallenge(otherUserId, otherProfile.username)
                }
              >
                Retar
              </button>
            )}
          </div>

          <div className="chat-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble ${
                  msg.senderId === user?.id
                    ? "chat-bubble--mine"
                    : "chat-bubble--theirs"
                }`}
              >
                {msg.content}
                <div className="chat-bubble-time">
                  {formatTime(msg.createdAt)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {isTyping && isTyping !== user?.id && (
            <div className="chat-typing-indicator">
              <div className="typing-dots">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
              <span>escribiendo...</span>
            </div>
          )}

          <div className="chat-input-area">
            <input
              className="chat-input"
              placeholder="Escribe un mensaje..."
              value={messageInput}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              id="chat-message-input"
            />
            <button
              className="chat-send-btn"
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-panel" id="chat-panel">
      <div className="panel-header">
        <img src={iconoChat} alt="Chat" className="panel-icon" />
        <span className="panel-title">Chat</span>
      </div>

      <div className="panel-body">
        {loading && (
          <div className="panel-loading">
            <div className="panel-spinner" />
          </div>
        )}

        {!loading && conversations.length === 0 && (
          <div className="panel-empty">
            <span className="panel-empty-text">
              Aún no tienes conversaciones
            </span>
          </div>
        )}

        {!loading && (
          <div className="chat-conversation-list">
            {conversations.map((conv) => {
              const otherProfile = getOtherProfile(conv);
              const otherUserId = getOtherUserId(conv);
              const isOnline = onlineUsers.has(otherUserId);

              return (
                <div
                  key={conv.id}
                  className="chat-conversation-item"
                  onClick={() => setActiveConversation(conv.id)}
                >
                  <div className="chat-avatar-wrapper">
                    {otherProfile?.profilePhoto ? (
                      <img
                        src={otherProfile.profilePhoto}
                        alt=""
                        className="chat-avatar"
                      />
                    ) : (
                      <div className="chat-avatar-placeholder">
                        {otherProfile?.username?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                    <div
                      className={isOnline ? "chat-online-dot" : "chat-offline-dot"}
                    />
                  </div>

                  <div className="chat-conversation-info">
                    <div className="chat-conversation-name">
                      {otherProfile?.username || "Piloto"}
                    </div>
                    <div className="chat-conversation-last">
                      {conv.lastMessage}
                    </div>
                  </div>

                  <span className="chat-conversation-time">
                    {formatConvTime(conv.lastMessageAt)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

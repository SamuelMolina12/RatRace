export const SOCKET_EVENT = {
  USER_REGISTER: "user:register",
  USER_ONLINE: "user:online",
  USER_OFFLINE: "user:offline",
  USERS_ONLINE_LIST: "users:online_list",

  CHAT_MESSAGE: "chat:message",
  CHAT_MESSAGE_RECEIVED: "chat:message:received",
  CHAT_MESSAGE_SENT: "chat:message:sent",
  CHAT_TYPING: "chat:typing",
  CHAT_STOP_TYPING: "chat:stop_typing",
  CHAT_READ: "chat:read",
  CHAT_ERROR: "chat:error",

  CHALLENGE_RECEIVED: "challenge:received",
  CHALLENGE_ACCEPTED: "challenge:accepted",
  CHALLENGE_REJECTED: "challenge:rejected",
  CHALLENGE_CANCELLED: "challenge:cancelled",
  CHALLENGE_STARTED: "challenge:started",
  CHALLENGE_COMPLETED: "challenge:completed",

  RANK_UPGRADED: "rank:upgraded",

  NOTIFICATION_NEW: "notification:new",
} as const;

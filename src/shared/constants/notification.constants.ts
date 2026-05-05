export const NOTIFICATION_TYPE = {
    CHALLENGE_RECEIVED: "challenge_received",
    CHALLENGE_ACCEPTED: "challenge_accepted",
    CHALLENGE_REJECTED: "challenge_rejected",
    CHALLENGE_CANCELLED: "challenge_cancelled",
    CHALLENGE_STARTED: "challenge_started",
    CHALLENGE_COMPLETED: "challenge_completed",
    RANK_UPGRADED: "rank_upgraded",
    CHAT_MESSAGE: "chat_message",
} as const;

export type NotificationType =
    (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];
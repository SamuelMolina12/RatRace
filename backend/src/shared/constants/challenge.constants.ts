export const CHALLENGE_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const ACTIVE_CHALLENGE_STATUSES = [
  CHALLENGE_STATUS.PENDING,
  CHALLENGE_STATUS.ACCEPTED,
  CHALLENGE_STATUS.IN_PROGRESS,
];

export const RACE_TYPES = {
  QUARTER_MILE: "quarter_mile",
  LAPS: "laps",
  DRIFT: "drift",
} as const;
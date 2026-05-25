export const USER_RANK = {
  D: "D",
  C: "C",
  B: "B",
  A: "A",
  S: "S",
} as const;

export type UserRank = (typeof USER_RANK)[keyof typeof USER_RANK];

export const RANK_ORDER: UserRank[] = [
  USER_RANK.D,
  USER_RANK.C,
  USER_RANK.B,
  USER_RANK.A,
  USER_RANK.S,
];

export const REQUIRED_CONSECUTIVE_WINS_TO_RANK_UP = 2;

export const MAX_RANK = USER_RANK.S;
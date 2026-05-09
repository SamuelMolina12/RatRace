export const ROLES = {
  PILOT: "PILOT",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const ALL_ROLES: UserRole[] = [ROLES.PILOT, ROLES.ADMIN];

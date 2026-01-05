import { Document } from "mongoose";

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  status: boolean;
  access_token_secret: string;
  refresh_token_secret: string;
  tokenVersion: number;

  omitField(field: string): any;
  regenerateJwtSecret(): Promise<void>;
  regenerateRefreshSecret(): Promise<void>;
  regenerateAllSecrets(): Promise<void>;
  invalidateAllTokens(): Promise<void>;
}

import mongoose from "mongoose";
import type { UserRole } from "../users/user.types.js";

export interface TokenPayload {
  id: mongoose.Types.ObjectId;
  role: UserRole;
  tokenVersion: number;
}

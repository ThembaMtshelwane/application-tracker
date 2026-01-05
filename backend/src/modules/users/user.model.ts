import { Schema, Model, model } from "mongoose";
import crypto from "crypto";
import { USER_ROLES, type IUser } from "./user.types.js";

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.USER,
  },
  status: { type: Boolean, default: true },
  access_token_secret: {
    type: String,
    required: true,
    select: false,
  },
  refresh_token_secret: {
    type: String,
    required: true,
    select: false,
  },
  tokenVersion: {
    type: Number,
    default: 0,
    select: false,
  },
});

// Method to omit sensitive fields
userSchema.methods.omitFields = function (...fields: string[]) {
  const obj = this.toObject();

  fields.forEach((field) => {
    delete obj[field];
  });

  return obj;
};

// Regenerate access token secret only
userSchema.methods.regenerateAccessJwtSecret = async function () {
  this.access_token_secret = crypto.randomBytes(32).toString("hex");
  await this.save();
};

// Regenerate refresh token secret only
userSchema.methods.regenerateRefreshSecret = async function () {
  this.refresh_token_secret = crypto.randomBytes(32).toString("hex");
  await this.save();
};

// Regenerate both secrets (nuclear option)
userSchema.methods.regenerateAllSecrets = async function () {
  this.access_token_secret = crypto.randomBytes(32).toString("hex");
  this.refresh_token_secret = crypto.randomBytes(32).toString("hex");
  this.tokenVersion = 0;
  await this.save();
};

// Increment token version (soft invalidation)
userSchema.methods.invalidateAllTokens = async function () {
  this.tokenVersion += 1;
  await this.save();
};

const User: Model<IUser> = model<IUser>("User", userSchema);

export default User;

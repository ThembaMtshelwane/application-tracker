import ENV_VARS from "../consts/env.consts.js";
import type { TokenPayload } from "../modules/auth/auth.types.js";
import type { IUser } from "../modules/users/user.types.js";
import jwt from "jsonwebtoken";

export const generateAccessToken = (user: IUser): string => {
  const secret = (user.access_token_secret +
    ENV_VARS.GLOBAL_ACCESS_SECRET) as string;
  const payload: TokenPayload = {
    id: user._id,
    role: user.role,
    tokenVersion: user.tokenVersion,
  };
  return jwt.sign(payload, secret, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (user: IUser): string => {
  const secret = (user.refresh_token_secret +
    ENV_VARS.GLOBAL_REFRESH_SECRET) as string;
  const payload: TokenPayload = {
    id: user._id,
    role: user.role,
    tokenVersion: user.tokenVersion,
  };
  return jwt.sign(payload, secret, {
    expiresIn: "7d",
  });
};

import asyncHandler from "express-async-handler";
import type { Request, Response, NextFunction } from "express";
import { HttpError } from "./error.middleware.js";
import { HTTP_CODES } from "../consts/http.consts.js";
import { verifyToken } from "../modules/token/token.service.js";
import ENV_VARS from "../consts/env.consts.js";
import type { UserRole } from "../modules/users/user.types.js";

export const authenticate = asyncHandler(
  async (req: Request, _: Response, next: NextFunction) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw new HttpError(HTTP_CODES.UNAUTHORIZED, "Access token required");
    }
    const user = await verifyToken(accessToken, {
      userSecretField: "access_token_secret",
      globalSecret: ENV_VARS.GLOBAL_ACCESS_SECRET as string,
    });
    req.user = user;
    next();
  }
);

// Authorization: Checks if the user has the specific role required
export const authorize = (role: UserRole[]) => {
  return (req: Request, _: Response, next: NextFunction) => {
    if (!role.includes(req.user.role)) {
      throw new HttpError(HTTP_CODES.UNAUTHORIZED, "Permission denied");
    }
    next();
  };
};

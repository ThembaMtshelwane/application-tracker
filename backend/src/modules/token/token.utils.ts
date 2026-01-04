import { HTTP_CODES } from "../../consts/http.consts.js";
import { HttpError } from "../../middleware/error.middleware.js";
import { type TokenPayload } from "../auth/auth.types.js";
import jwt from "jsonwebtoken";

/**
 * Decodes JWT token without verification
 * @param token - JWT token string
 * @throws {HttpError} If token structure is invalid
 */
export const decodeToken = (token: string): TokenPayload => {
  const decoded = jwt.decode(token, { complete: true });

  if (!decoded || !decoded.payload || typeof decoded.payload === "string") {
    throw new HttpError(HTTP_CODES.UNAUTHORIZED, "Invalid token structure");
  }
  return decoded.payload as TokenPayload;
};

/**
 * Validates token payload structure
 * @param payload - Token payload to validate
 * @throws {HttpError} If payload is invalid
 */
export const validateTokenPayload = (payload: TokenPayload): void => {
  if (!payload.id || typeof payload.id !== "string") {
    throw new HttpError(HTTP_CODES.UNAUTHORIZED, "Invalid token structure");
  }

  // if (!payload.tokenVersion || typeof payload.tokenVersion !== "number") {
  //   throw new HttpError(HTTP_CODES.UNAUTHORIZED, "Invalid token structure");
  // }
};

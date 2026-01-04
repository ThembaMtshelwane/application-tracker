import jwt from "jsonwebtoken";
import { decodeToken, validateTokenPayload } from "./token.utils.js";
import User from "../users/user.model.js";
import { HttpError } from "../../middleware/error.middleware.js";
import { HTTP_CODES } from "../../consts/http.consts.js";
import type { TokenPayload } from "../auth/auth.types.js";

type TokenVerificationConfig = {
  userSecretField: "access_token_secret" | "refresh_token_secret";
  globalSecret: string;
};

/**
 * Generic token verification function
 * Handles the complete verification flow for any token type
 */
export const verifyToken = async (
  token: string,
  config: TokenVerificationConfig
) => {
  // Step 1: Decode token without verification
  const payload = decodeToken(token);

  // Step 2: Validate payload structure
  validateTokenPayload(payload);

  // Step 3: Fetch user with secrets from database
  const user = await User.findById(payload.id).select(
    "+access_token_secret +refresh_token_secret +tokenVersion"
  );

  if (!user || !user[config.userSecretField]) {
    throw new HttpError(HTTP_CODES.NOT_FOUND, "Not authorized, user not found");
  }

  // Step 4: Verify token signature with combined secret
  const combinedSecret = user[config.userSecretField] + config.globalSecret;

  let verified: TokenPayload;
  try {
    verified = jwt.verify(token, combinedSecret) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new HttpError(HTTP_CODES.UNAUTHORIZED, error.message);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new HttpError(HTTP_CODES.UNAUTHORIZED, error.message);
    }
    throw error;
  }

  // Step 5: Verify payload consistency
  if (verified.id !== payload.id) {
    throw new HttpError(HTTP_CODES.UNAUTHORIZED, "Token mismatch");
  }

  return user;
};

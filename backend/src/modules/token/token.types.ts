export type TokenType = "accessToken" | "refreshToken";

export type TokenVerificationConfig = {
  userSecretField: "access_token_secret" | "refresh_token_secret";
  globalSecret: string;
};

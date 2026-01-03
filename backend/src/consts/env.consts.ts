const ENV_VARS = {
  PORT: process.env.PORT ?? 5000,
  DEV_CLIENT_URL: process.env.DEV_CLIENT_URL ?? "http://localhost:3000",
  CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV,
};

export default ENV_VARS;

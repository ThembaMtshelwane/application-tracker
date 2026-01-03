const ENV_VARS = {
  PORT: process.env.PORT ?? 5000,
  DEV_CLIENT_URL: process.env.DEV_CLIENT_URL ?? "http://localhost:3000",
  CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV ?? "development",
  MONGO_URI:
    process.env.MONGO_URI ?? "mongodb://localhost:27017/application-tracker",
};

export default ENV_VARS;

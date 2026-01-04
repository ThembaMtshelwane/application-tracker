import express, { type Application } from "express";
import { corsMiddleware } from "./middleware/cors.middleware.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import routes from "./router/index.js";

export const createApp = () => {
  const app: Application = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(corsMiddleware);

  app.use("/api", routes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
};

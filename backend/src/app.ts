import express, { type Application } from "express";
import { corsMiddleware } from "./middleware/cors.middleware.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

const app: Application = express();

app.use(corsMiddleware);

app.use(notFound);
app.use(errorHandler);
export default app;

import express, { type Application } from "express";
import { corsMiddleware } from "./middleware/cors.middleware.js";

const app: Application = express();

app.use(corsMiddleware)

export default app;

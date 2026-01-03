import app from "./app.js";
import { type Request, type Response } from "express";
import ENV_VARS from "./consts/env.consts.js";

app.get("/", (_: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(ENV_VARS.PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${ENV_VARS.PORT}`);
});

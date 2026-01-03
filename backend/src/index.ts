import app from "./app.js";
import { type Request, type Response } from "express";
import { PORT } from "./consts/env.consts.js";

app.get("/", (_: Request, res: Response) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});

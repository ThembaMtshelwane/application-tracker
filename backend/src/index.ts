import type { Application } from "express";
import { createApp } from "./app.js";
import ENV_VARS from "./consts/env.consts.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";

const startServer = async () => {
  try {
    await connectDatabase(ENV_VARS.MONGO_URI);
    const app: Application = createApp();

    const server = app.listen(ENV_VARS.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${ENV_VARS.PORT}`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n⚡ Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        console.log("🔒 HTTP server closed");
        await disconnectDatabase();
        process.exit(0);
      });

      // Force exit after 10 seconds
      setTimeout(() => {
        console.error(
          "⚠️ Could not close connections in time, forcing shutdown"
        );
        process.exit(1);
      }, 10000);
    };

    process.on("SIGINT", () => shutdown("SIGINT")); // Ctrl+C
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

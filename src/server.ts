import http from "http";
import { Server } from "socket.io";

import app from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import { errorHandler } from "./infrastructure/http/middlewares/errorHandler";
import { connectMongo } from "./infrastructure/database/mongo/mongo.connection";
import { initializeSocketServer } from "./infrastructure/websocket/socket.server";

const startServer = async () => {
  await connectDatabase();
  await connectMongo();

  app.use(errorHandler);

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  app.set("io", io);

  initializeSocketServer(io);

  server.listen(env.PORT, () => {
    console.log(`Server en puerto ${env.PORT}`);
  });
};

startServer();
import app from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import { errorHandler } from "./infrastructure/http/middlewares/errorHandler";

const startServer = async () => {
  await connectDatabase();
  app.use(errorHandler);

  app.listen(env.PORT, () => {
    console.log(`Server en puerto ${env.PORT}`);
  });
};

startServer();
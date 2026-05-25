import express from "express";
import cors from "cors";
import routes from "./infrastructure/http/routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./infrastructure/http/swagger/swagger.config";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", routes);

export default app;
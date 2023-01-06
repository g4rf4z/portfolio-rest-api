import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import deserializeToken from "../middlewares/deserializeToken";
import routes from "../routes";

const createServer = () => {
  const app = express();

  app.use(helmet({ expectCt: false }));
  app.use(
    cors({
      credentials: true,
      origin: ["http://127.0.0.1:5173", "http://localhost:3000"],
      methods: ["GET", "POST", "PATCH", "DELETE"],
    })
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use(deserializeToken);

  routes(app);
  return app;
};

export default createServer;

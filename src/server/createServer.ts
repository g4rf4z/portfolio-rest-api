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
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST", "PATCH", "DELETE"],
    })
  );
  app.use(express.json({ limit: "5MB" }));
  app.use(cookieParser());
  app.use(deserializeToken);

  routes(app);
  return app;
};

export default createServer;

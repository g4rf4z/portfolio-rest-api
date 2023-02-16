import express from "express";
import helmet from "helmet";
import config from "config";
import cors from "cors";
import cookieParser from "cookie-parser";

import deserializeToken from "../middlewares/deserializeToken";
import routes from "../routes";

const createServer = () => {
  const app = express();
  const clientUri = config.get<string>("clientUri");
  app.use(helmet({ expectCt: false }));
  app.use(
    cors({
      credentials: true,
      origin: [clientUri],
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

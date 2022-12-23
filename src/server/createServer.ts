import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import deserializeToken from "../middlewares/deserializeToken";
import routes from "../routes";

const createServer = () => {
  const app = express();

  app.use(
    helmet({
      expectCt: false,
    })
  );
  app.use(
    cors({
      credentials: true,
      origin: ["http://localhost:3333", "http://localhost:4444"],
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

import dotenv from "dotenv";
dotenv.config();

import config from "config";
import createServer from "./server/createServer";

const port = config.get<number>("port");
const rootUrl = config.get<string>("domainUri");
const app = createServer();

app.listen(port, async () => {
  console.info(`API is running on ${rootUrl}`);
});

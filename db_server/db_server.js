const http = require("http");
const app = require("./app");
const Logger = require("../winston");
const logger = new Logger(app);
const path = require("path");
const root = require("../Util/path");
const config = require(path.join(root, "Util", "config"));
const port = config.db_server_port;

const server = http.createServer(app);

let listener = server.listen(port, () => {
  logger.info(
    "HTTP DB_Server listening on port " +
      listener.address().port +
      ". Environment: " +
      process.env.NODE_ENV +
      "."
  );
});

module.exports = server;

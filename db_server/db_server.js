const http = require("http");
const app = require("./app");
const Logger = require("../winston");
const logger = new Logger(app);

const port = process.env.PORT || 3000;

const server = http.createServer(app);

let listener = server.listen(port, () => {
  logger.info(
    "DB_Server listening on port " +
      listener.address().port +
      ". Environment: " +
      process.env.NODE_ENV +
      "."
  );
});

module.exports = server;

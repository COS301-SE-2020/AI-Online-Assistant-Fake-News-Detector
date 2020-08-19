const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const port = 8080;
const helmet = require("helmet");
const morgan = require("morgan");
const Logger = require("../winston");
const logger = new Logger(server);
const cors = require("cors");
const API = require("./routes/APIv1");
const fs = require("fs");
const ExternalDocs = require(__dirname +
  "/routes/ExternalDocs").getAbsoluteFSPath();
const InternalDocs = require(__dirname +
  "/routes/InternalDocs").getAbsoluteFSPath();
const path = require("path");
const root = require("../Util/path");
const cron = require("node-cron");
const http = require("http");
const morganFormat =
  "[:date] :remote-addr - :remote-user :method :url HTTP/:http-version :status :response-time ms";
require("dotenv").config({ path: path.join(root, ".env") });

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(bodyParser.text());
server.use(bodyParser.json({ type: "application/json" }));
server.use(helmet());
server.use(cors());

const getRequest = (_host, _path, _port, callBack) => {
  const request = http
    .request(
      {
        host: _host,
        port: _port,
        path: _path,
        method: "GET",
      },
      (response) => {
        response.setEncoding("utf-8");
        let responseString = "";
        response.on("data", (chunk) => {
          responseString += chunk;
        });

        response.on("end", () => {
          if (responseString === "") responseString = "{}";
          callBack(response.statusCode, JSON.parse(responseString));
        });
      }
    )
    .on("error", (err) => {
      morgan(":date[clf] :method :url :status :response-time ms", {
        stream: fs.createWriteStream(path.join(root, "logfiles", "error.log"), {
          flags: "a",
        }),
      });
      callBack(500, err);
    });

  request.end();
};

cron.schedule("55 23 * * *", () => {
  getRequest("localhost", "/api/reports/update", 8080, () =>
    logger.info("Cron job for updating reports ran.")
  );
});

morgan.token("date", (req, res, tz) => {
  const date = new Date();
  const format = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const [
    { value: month },
    ,
    { value: day },
    ,
    { value: year },
    ,
    { value: hour },
    ,
    { value: minute },
    ,
    { value: second },
  ] = format.formatToParts(date);
  return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
});

if (process.env.NODE_ENV === "production") {
  const accessLog = fs.createWriteStream(
    path.join(root, "logfiles", "access.log"),
    {
      flags: "a",
    }
  );

  const errorLog = fs.createWriteStream(
    path.join(root, "logfiles", "error.log"),
    {
      flags: "a",
    }
  );

  server.use(
    morgan(morganFormat, {
      skip: (req, res) => {
        return res.statusCode < 400;
      },
      stream: errorLog,
    })
  );

  server.use(
    morgan(morganFormat, {
      skip: (req, res) => {
        return res.statusCode >= 400;
      },
      stream: accessLog,
    })
  );
} else server.use(morgan("dev"));

server.use("/API-Documents", express.static(ExternalDocs));
server.use("/API-Internal-Documents", express.static(InternalDocs));
server.use("/API", API);
server.use("/", express.static(path.join(root, "frontend", "dist", "AiNews")));
server.use("*", (req, res, next) => {
  res
    .status(404)
    .sendFile(path.join(root, "frontend", "dist", "AiNews", "index.html"));
});

const listener = server.listen(port, () => {
  logger.info(
    "API_Server listening on port " +
      listener.address().port +
      ". Environment: " +
      process.env.NODE_ENV +
      "."
  );
  if (process.env.NODE_ENV === "production")
    [8090, 8091, 8092].forEach((e) =>
      getRequest(
        "localhost",
        "/api/start/" + e,
        8080,
        (statusCode, response) => {}
      )
    );
});

module.exports = server;

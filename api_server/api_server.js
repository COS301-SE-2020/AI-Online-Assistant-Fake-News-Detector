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
const SwaggerUi = require(__dirname +
  "/routes/swagger-ui-dist").getAbsoluteFSPath();
const path = require("path");
const root = require("../Util/path");
const cron = require("node-cron");
const http = require("http");
const morganFormat =
  "[:date] :remote-addr - :remote-user :method :url HTTP/:http-version :status :response-time ms";
const uri =
  process.env.NODE_ENV != "dev"
    ? process.env.production_uri
    : process.env.development_uri;

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(bodyParser.text());
server.use(bodyParser.json({ type: "application/json" }));
server.use(helmet());
server.use(cors());

const getRequest = (url, callBack) => {
  http.get(url, (resp) => {
    let data = "";
    resp.on("data", (chunk) => {
      data += chunk;
    });
    resp
      .on("end", () => {
        return callBack(data);
      })
      .on("error", (err) => {
        morgan(morganFormat, {
          stream: fs.createWriteStream(
            path.join(root, "logfiles", "error.log"),
            {
              flags: "a",
            }
          ),
        });
      });
  });
};

cron.schedule("55 23 * * *", () => {
  getRequest("localhost", "/api/reports/update", (data) => console.log(data));
  logger.info("Cron job for updating reports ran.");
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

server.use("/API-Documents", express.static(SwaggerUi));
server.use("/API", API);
server.use("/", express.static(path.join(root, "frontend", "dist", "AiNews")));
server.use("*", (req, res, next) => {
  res
    .status(404)
    .sendFile(path.join(root, "frontend", "dist", "AiNews", "index.html"));
});

let listener = server.listen(port, () =>
  logger.info("API_Server listening on port " + listener.address().port)
);

module.exports = server;

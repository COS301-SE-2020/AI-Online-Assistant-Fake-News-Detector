const express = require("express");
const server = express();
const bodyParser = require("body-parser");
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
const config = require(path.join(root, "Util", "config"));
const port = config.api_server_port;
const cron = require("node-cron");
const https = require("https");
const http = require("http");
const morganFormat =
  "[:date] :remote-addr - :remote-user :method :url HTTP/:http-version :status :response-time ms";

require("dotenv").config({ path: path.join(root, ".env") });
const production = process.env.NODE_ENV === "production" ? true : false;
const hostURL = production
  ? process.env.productionURI
  : process.env.devlopmentURI;
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(bodyParser.text());
server.use(bodyParser.json({ type: "application/json" }));
server.use(helmet());
server.use(cors());

const getRequest = production ? config.HTTPSGetRequest : config.HTTPGetRequest;

cron.schedule("55 23 * * *", () => {
  getRequest(hostURL, "/api/reports/update", 8080, () =>
    logger.info("Cron job for updating reports ran.")
  );
});

cron.schedule("58 23 * * 0", () => {
  // cron.schedule("55 * * * * * ", () => {
  getRequest(hostURL, "/api/reports/active/1", 8080, (statusCode, response) => {
    response.response.Reports.forEach((ele) => {
      console.log(ele.Type);
    });
  });
  /**
   * 1. Fetch all active reports
   * 2. Send email to notification all provided emails
   * 3. Add reported item to main fact/source table if count > 3
   * 4. Reset count to 1 and deactivate
   */
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

if (production) {
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

  cron.schedule("55 * * * * *", () => {
    getRequest(hostURL, "/api/active", 8080, (statusCode, response) => {
      if (response.servers > 0) {
        let active = "Active Servers - ";
        response.servers.forEach((e) => {
          active += "Port " + e.port + ", ";
        });
        active = active.substring(0, active.length - 2);
        logger.info(active);
      }
    });
  });
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

try {
  const Certificates = {
    key: fs.readFileSync(
      path.join(root, "Util", "ProductionCertificates", "privkey.pem"),
      "utf8"
    ),
    cert: fs.readFileSync(
      path.join(root, "Util", "ProductionCertificates", "cert.pem"),
      "utf8"
    ),
  };
  const httpsServer = production
    ? https.createServer(Certificates, server)
    : http.createServer(server);

  httpsServer.listen(port, () => {
    logger.info(
      "API_Server listening on port " +
        port +
        ". Environment: " +
        process.env.NODE_ENV +
        "."
    );

    if (production) {
      [8090].forEach((e) => {
        getRequest(
          "artifacts.live",
          "/api/start/" + e,
          8080,
          (statusCode, response) => {
            if (statusCode === 500)
              logger.info("S - " + statusCode + ", R - " + response);
          }
        );
      });
    }
  });
} catch (error) {
  logger.info(error);
}

module.exports = server;

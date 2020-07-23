const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const port = 8080;
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const SwaggerUi = require("./routes/swagger-ui-dist").getAbsoluteFSPath();
const API = require("./routes/APIv1");
const fs = require("fs");
const path = require("path");
const root = require("../Util/path");
const cron = require("node-cron");
const http = require("http");
const api = require("./routes/APIv1");

//Static files like css or js frontend.
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(bodyParser.text());
server.use(bodyParser.json({ type: "application/json" }));
// server.use(bodyParser.json({ type: "application/json" }));
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
        morgan(":date[clf] :method :url :status :response-time ms", {
          stream: fs.createWriteStream(path.join(root, "logs", "error.log"), {
            flags: "a",
          }),
        });
      });
  });
};

cron.schedule("59 23 * * *", () => {
  getRequest("localhost", "/api/reports/update", (data) => console.log(data));
});

// log all requests to access.log
server.use(
  morgan(":date[clf] :method :url :status :response-time ms", {
    stream: fs.createWriteStream(
      path.join(__dirname, "logfiles", "access.log"),
      {
        flags: "a",
      }
    ),
  })
);

server.use(morgan("dev"));
server.use("/API-Documents", express.static(SwaggerUi));
server.use("/API", API);
server.use("/", express.static(path.join(root, "frontend", "dist", "AiNews")));
server.use("*", (req, res, next) => {
  res
    .status(404)
    .sendFile(path.join(root, "frontend", "dist", "AiNews", "index.html"));
});

let listener = server.listen(port, () => {
  console.log("API_Server listening on port " + listener.address().port);
});

module.exports = server;

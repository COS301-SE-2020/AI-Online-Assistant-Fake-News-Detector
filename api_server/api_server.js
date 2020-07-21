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

//Static files like css or js frontend.
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
        morgan(":date[clf] :method :url :status :response-time ms", {
          stream: fs.createWriteStream(path.join(root, "logs", "error.log"), {
            flags: "a",
          }),
        });
      });
  });
};

const putRequest = (_host, _path, params) => {
  let req = http.request(
    {
      host: _host,
      port: 8080,
      path: _path,
      method: "PUT",
      headers: {
        "Content-Length": Buffer.byteLength(JSON.stringify(params)),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
    (resp) => {
      let data = "";
      resp.on("data", (chunk) => {
        data += chunk;
      });
      resp.on("error", (err) => {
        morgan(":date[clf] :method :url :status :response-time ms", {
          stream: fs.createWriteStream(path.join(root, "logs", "error.log"), {
            flags: "a",
          }),
        });
      });
    }
  );
  req.write(params);
  req.end();
};

cron.schedule("2 * * * * *", () => {
  // Fetch all reports with a active status of 1 status and order by description trimmed
  // If the previous entity is the same as current, take previous counter add 1 and remove current by setting active = 0
  getRequest("http://localhost:8080/api/reports/active/1", (data) => {
    data = JSON.parse(data);
    let prevReport = data.reports[0];
    for (report of data.reports) {
      if (
        report["Report Data"].toLowerCase() ===
          prevReport["Report Data"].toLowerCase() &&
        report["_id"] !== prevReport["_id"]
      ) {
        ++prevReport["Report Count"];
        putRequest(
          "localhost",
          "/api/reports/id/" + prevReport["_id"],
          JSON.stringify({
            reportCount: prevReport["Report Count"],
          })
        );
        putRequest(
          "localhost",
          "/api/reports/id/" + report["_id"],
          JSON.stringify({
            bActive: 0,
          })
        );
        console.log("equal", report["_id"], prevReport["_id"]);
      } else {
        prevReport = report;
      }
    }
  });
});

// log all requests to access.log
server.use(
  morgan(":date[clf] :method :url :status :response-time ms", {
    stream: fs.createWriteStream(path.join(root, "logs", "access.log"), {
      flags: "a",
    }),
  })
);
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

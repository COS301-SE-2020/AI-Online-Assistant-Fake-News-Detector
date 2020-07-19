const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const port = 8080;
const helmet = require("helmet");
const morgan = require("morgan");
var cors = require("cors");
const SwaggerUi = require("./routes/swagger-ui-dist").getAbsoluteFSPath();
const API = require("./routes/APIv1");
const fs = require("fs");
const path = require("path");

//Static files like css or js frontend.
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(bodyParser.text());
server.use(bodyParser.json({ type: "application/json" }));
server.use(helmet());
server.use(cors());

// log all requests to access.log
server.use(
  morgan(":date[clf] :method :url :status :response-time ms", {
    stream: fs.createWriteStream(path.join(__dirname, "access.log"), {
      flags: "a",
    }),
  })
);
server.use("/API-Documents", express.static(SwaggerUi));
server.use("/API", API);
server.use("/", express.static("../frontend/dist/AiNews"));

let listener = server.listen(port, () => {
  console.log("API_Server listening on port " + listener.address().port);
});

module.exports = server;

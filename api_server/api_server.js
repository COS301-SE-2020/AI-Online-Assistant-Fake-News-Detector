const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const port = 8080;
const helmet = require("helmet");
const morgan = require("morgan");
var cors = require("cors");
const SwaggerUi = require("./routes/swagger-ui-dist").getAbsoluteFSPath();
const API = require("./routes/APIv1");

//Static files like css or js frontend.
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(bodyParser.text());
server.use(bodyParser.json({ type: "application/json" }));
server.use(helmet());
server.use(cors());
server.use(morgan("combined"));
server.use("/API-Documents", express.static(SwaggerUi));
server.use("/API", API);
server.use("/", express.static("../frontend/dist/AiNews"));

let listener = server.listen(port, () => {
  console.log("API_Server listening on port " + listener.address().port);
});

module.exports = server;

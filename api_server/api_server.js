const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const path = require("path");
const port = 8080;
const helmet = require("helmet");
const morgan = require("morgan");
var cors = require("cors");
// Root path of server
const root = require("./Util/path");
const pathToSwaggerUi = require("swagger-ui-dist").getAbsoluteFSPath();
const API = require("./routes/APIv1");

//Static files like css or js frontend.
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(bodyParser.text());
server.use(bodyParser.json({ type: "application/json" }));
server.use(express.static(path.join(root, "Content")));
server.use(express.static(path.join(root, "/node_modules/bootstrap/dist")));
server.use(
  "/jquery",
  express.static(path.join(root, "/node_modules/jquery/dist/"))
);
server.use("/API-Documents", express.static(pathToSwaggerUi));
server.use(helmet());
server.use(cors());
server.use(morgan("combined"));
server.use("/API", API);

server.get("/", (req, res, next) => {
  res.status(200).sendFile(path.join(root, "Views", "index.html"));
});

server.get("/ProjectGuide", (req, res, next) => {
  res.status(200).sendFile(path.join(root, "Views", "ProjectGuide.html"));
});

server.get("/TheTeam", (req, res, next) => {
  res.status(200).sendFile(path.join(root, "Views", "TheTeam.html"));
});

server.use((req, res, next) => {
  res.status(404).sendFile(path.join(root, "views", "404.html"));
});

let listener = server.listen(port, () => {
  console.log("API_Server listening on port " + listener.address().port);
});

module.exports = server;

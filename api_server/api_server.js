const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const path = require("path");
const port = 8080;
var cors = require("cors");
// Root path of server
const root = require("./Util/path");

const APIRoutes = require("./routes/api");

//Static files like css or js frontend.
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static(path.join(root, "Content")));
server.use(express.static(path.join(root, "/node_modules/bootstrap/dist")));
server.use(express.static(path.join(root, "Content")));
server.use(express.static(path.join(root, "Content")));

server.use("/API", APIRoutes);

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
  console.log("Server listening on port " + listener.address().port);
});

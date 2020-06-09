const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const path = require("path");
// Root path of server
const root = require("./Util/path");

//Static files like css or js frontend.
server.use(express.static(path.join(root, "Content")));

server.get("/", (req, res, next) => {
  res.status(200).sendFile(path.join(root, "views", "index.html"));
});

server.use((req, res, next) => {
  res.status(404).sendFile(path.join(root, "views", "404.html"));
});

let listener = server.listen(8080, () => {
  console.log("Server listening on port " + listener.address().port);
});

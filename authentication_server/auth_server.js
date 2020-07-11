const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const path = require("path");
const port = 8081;
const helmet = require("helmet");
const morgan = require("morgan");
var cors = require("cors");

//Static files like css or js frontend.
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(bodyParser.text());
server.use(bodyParser.json({ type: "application/json" }));
server.use(helmet());
server.use(cors());
server.use(morgan("combined"));

let listener = server.listen(port, () => {
  console.log("AUTH_Server listening on port " + listener.address().port);
});

module.exports = server;

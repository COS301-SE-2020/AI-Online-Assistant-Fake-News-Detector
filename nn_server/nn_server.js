// Regex
const sentenceRegex = /[^\.\!\?]*[\.\!\?]/g;

// Precision for calculations
const precision = 8;

// Port to listen on
const port = 8082;

// Neural network, procesing modules
const core_nn = require("./core_nn/core_nn.js");
const nn_spelling_input = require("./nn_spelling_input/nn_spelling_input.js");
const nn_verbose_input = require("./nn_verbose_input/nn_verbose_input.js");

// HTTP modules
const express = require("express");
const bodyParser = require("body-parser");

const server = express();

// neural network for processing, currently mocked
let core = new core_nn("mockModel");

// add input processing methods
core.addInput(new nn_spelling_input());
core.addInput(new nn_verbose_input());

// configure express to use body-parser as middle-ware
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// API implementation
server.post("/API/Check", (req, res) => {
  if (
    req.body.hasOwnProperty("type") &&
    req.body.type === "text" &&
    req.body.hasOwnProperty("content") &&
    typeof req.body.content === "string"
  ) {
    let sentences = req.body.content.match(sentenceRegex); // splits text into array of sentences
    let result = core.processText(sentences);
    if (!isNaN(parseFloat(result))) {
      // check if result is float to avoid returing internal errors to clients
      res.status(200).json({ result: parseFloat(result.toFixed(precision)) });
    } else {
      console.log(result);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(400);
  }
});

server.listen(port, () => {
  console.log("NN_Server listening on port " + port);
});

module.exports = server;

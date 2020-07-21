// HTTP modules
const express = require("express");
const server = express();
const bodyParser = require("body-parser");

// Regex
const sentenceRegex = /[^\.\!\?]*[\.\!\?]/g;

// Precision for calculations
const precision = 8;

// Port to listen on
const port = 8082;

// Python
const pythonShell = require('python-shell', {mode: 'text'});

// Neural network, procesing modules
const core_nn = require("./core_nn/core_nn.js");
const nn_spelling_input = require("./nn_spelling_input/nn_spelling_input.js");
const nn_verbose_input = require("./nn_verbose_input/nn_verbose_input.js");

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
	// python shell for nn_fact_input
	let text = req.body.content.toLowerCase();
	let pyShell = new pythonShell.PythonShell(__dirname + '/nn_fact_input/nn_fact_input.py');
	pyShell.on('message', function (message) {	   
	    let sentences = req.body.content.match(sentenceRegex); // splits text into array of sentences	    
	    let result = Math.max(core.processText(sentences), parseFloat(message));
	    if (!isNaN(parseFloat(result))) {
		// check if result is float to avoid returing internal errors to clients
		res.status(200).json({ result: parseFloat(result.toFixed(precision)) });
	    } else {
		console.log(result);
		res.sendStatus(500);
	    }
	});
	pyShell.send(text.replace(/\n/g, " ")); // remove line breaks because using stdin to send to python
	pyShell.end(function (err, code, signal) {
	    if (err) throw err;
	});    
    } else {
	res.sendStatus(400);
    }
});

server.listen(port, () => {
    console.log("NN_Server listening on port " + port);
});

module.exports = server;

// Neural network, procesing modules
const core_nn = require('./core_nn/core_nn.js');
const nn_spelling_input = require('./core_nn/nn_spelling_input/nn_spelling_input.js');
const nn_verbose_input = require('./core_nn/nn_verbose_input/nn_verbose_input.js');

// HTTP modules
const express = require('express');
const bodyParser = require('body-parser');

const port = 8082;

const server = express();

// neural network for processing, currently mocked
let core = new core_nn("mockModel");

// neural network inputs processing classes being used
let spellingInput = new nn_spelling_input();
let verboseInput = new nn_verbose_input();

// add input processing methods
core.addInputMethod(spellingInput.process);
core.addInputMethod(verboseInput.process);

// configure express to use body-parser as middle-ware
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());

// API implementation
server.post('/api/check', (req, res) => {
    if (req.body.hasOwnProperty('type') &&
	req.body.type === 'text' &&
	req.body.hasOwnProperty('content') &&
	typeof req.body.content === 'string')
    {
	res.status(200).send(
	    '{"result":' + core.processText(req.body.content) + '}'
	);
    } else {
	res.sendStatus(400);
    }
});

server.listen(port, ()=>{console.log("nn_server listening at http://localhost:" + port)});

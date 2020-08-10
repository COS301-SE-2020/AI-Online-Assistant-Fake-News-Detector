import flask
import sys
import os
import json
import urllib.parse
from flask import request, jsonify
from flask_api import status
dirname = os.path.dirname(__file__)
sys.path.append(os.path.join(dirname, 'classifier_utilities'))
sys.path.append(os.path.join(dirname, 'core_nn'))
sys.path.append(os.path.join(dirname, 'nn_fact_input'))
sys.path.append(os.path.join(dirname, 'nn_spelling_input'))
from core_nn import CoreNN
from nn_spelling_input import NNSpellingInput
from nn_fact_input import NNFactInput
from combined_classifier import CombinedClassifier

sys.path.append(os.path.join(dirname, 'classifier_utilities'))
sys.path.append(os.path.join(dirname, 'core_nn'))
sys.path.append(os.path.join(dirname, 'nn_fact_input'))
sys.path.append(os.path.join(dirname, 'nn_spelling_input'))

dirname = os.path.dirname(os.path.realpath(__file__))
factInputModelPath = os.path.join(
    dirname, "trained_models/nn_fact_input.model")
coreNNModelPath = os.path.join(dirname, "trained_models/core_nn.model")

factInput = NNFactInput()
factInput.importModelFromFile(factInputModelPath)
spellingInput = NNSpellingInput()
coreNN = CoreNN()
coreNN.importModelFromFile(coreNNModelPath)
coreNN.addInput(factInput)
# coreNN.addInput(spellingInput) # very slow, need another method

app = flask.Flask(__name__)

# route for supported requests


def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()


@app.route('/shutdown', methods=['POST'])
def shutdown():
    shutdown_server()
    return 'Server shutting down...'


@app.route('/verify', methods=['POST'])
def check():
    body = request.get_json(force=True, silent=True)
    if body:
        if 'type' in body.keys():
            if 'content' in body.keys():
                if body['type'] == 'text':
                    response = coreNN.process(body['content'].lower())
                    return jsonify({"response": {"result": response, "success": True, "message": "Processed Input"}}), status.HTTP_200_OK
                    # {"result":  "message": "Processed input", "success" : True}
    return jsonify({"response": {"message": "Bad request body.", "success": False}}), status.HTTP_400_BAD_REQUEST


# route for unsupported requests


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return "Bad request.", status.HTTP_400_BAD_REQUEST


if __name__ == '__main__':
    app.run(port=sys.argv[1])

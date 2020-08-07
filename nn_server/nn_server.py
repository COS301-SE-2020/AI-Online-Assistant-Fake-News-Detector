import flask
from flask import request, jsonify
from flask_api import status

import sys, os
dirname = os.path.dirname(__file__)
sys.path.append(os.path.join(dirname, 'classifier_utilities'))
sys.path.append(os.path.join(dirname, 'core_nn'))
sys.path.append(os.path.join(dirname, 'nn_fact_input'))
sys.path.append(os.path.join(dirname, 'nn_spelling_input'))
from combined_classifier import CombinedClassifier
from core_nn import CoreNN
from nn_fact_input import NNFactInput
from nn_spelling_input import NNSpellingInput

dirname = os.path.dirname(os.path.realpath(__file__))
factInputModelPath = os.path.join(dirname, "trained_models/nn_fact_input.model")
coreNNModelPath = os.path.join(dirname, "trained_models/core_nn.model")

factInput = NNFactInput()
factInput.importModelFromFile(factInputModelPath)
spellingInput = NNSpellingInput()

coreNN = CoreNN()
coreNN.importModelFromFile(coreNNModelPath)
coreNN.addInput(factInput)
#coreNN.addInput(spellingInput) # very slow, need another method

app = flask.Flask(__name__)

# route for supported requests
@app.route('/verify', methods=['POST'])
def check():
    body = request.get_json(force=True, silent=True)
    if body:
        if 'type' in body.keys():
            if 'content' in body.keys():
                if body['type'] == 'text':
                    response = coreNN.process(body['content'].lower())
                    return jsonify({"result" : response})
    return "Bad request body.", status.HTTP_400_BAD_REQUEST

# route for unsupported requests
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return "Bad request.", status.HTTP_400_BAD_REQUEST

if __name__ == '__main__':
    app.run(port=8082)


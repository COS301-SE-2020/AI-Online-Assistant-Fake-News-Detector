import flask
import sys
import os
import json
import urllib.parse
import requests
from flask import request, jsonify
from flask_api import status
import math
import sys
import os
import pathlib
dirname = pathlib.Path(__file__).parent.absolute()
sys.path.append(os.path.join(dirname, 'neural_network_utilities'))
from preprocessing import LexicalVectorizationFilter, GrammaticalVectorizationFilter, RawFakeNewsDataFilterAdapter, ParallelPreprocessor, RealOrFakeLabels
from postprocessing import postprocess, mergeOutputs
from dataset_manager import DatasetManager
from stacked_bidirectional_lstm import StackedBidirectionalLSTM
from deep_stacked_bidirectional_lstm import DeepStackedBidirectionalLSTM
from shallow_stack_lstm import ShallowStackedBidirectionalLSTM
from default_configs import DEFAULT_DATASETS_PATH, DEFAULT_MODELS_PATH, DEFAULT_GRAMMATICAL_SAMPLE_LENGTH, DEFAULT_LEXICAL_SAMPLE_LENGTH, DEFAULT_CORE_SAMPLE_LENGTH
from labels import RealOrFakeLabels

trained_models = os.path.join(dirname, 'trained_models')
grammaticalModel = os.path.join(trained_models, "grammatical_model.hdf5")
lexicalModel = os.path.join(trained_models, "lexical_model.hdf5")
coreModel = os.path.join(trained_models, "core_model.hdf5")

grammaticalFilter = GrammaticalVectorizationFilter()
grammaticalLSTM = DeepStackedBidirectionalLSTM(outputUnits=RealOrFakeLabels.getOutputUnits(), sampleLength=DEFAULT_GRAMMATICAL_SAMPLE_LENGTH, modelName="GrammaticalNN")
grammaticalLSTM.importModel(grammaticalModel)

lexicalFilter = LexicalVectorizationFilter()
lexicalLSTM = StackedBidirectionalLSTM(outputUnits=RealOrFakeLabels.getOutputUnits(), sampleLength=DEFAULT_LEXICAL_SAMPLE_LENGTH, modelName="LexicalNN")
lexicalLSTM.importModel(lexicalModel)

coreLSTM = ShallowStackedBidirectionalLSTM(outputUnits=RealOrFakeLabels.getOutputUnits(), sampleLength=DEFAULT_CORE_SAMPLE_LENGTH, modelName="CoreNN")
coreLSTM.importModel(coreModel)

app = flask.Flask(__name__)


def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()


@app.route('/shutdown', methods=['POST'])
def shutdown():
    shutdown_server()
    return jsonify({"response": {"success": True, "message": "Server Shutting Down"}}), status.HTTP_200_OK


@app.route('/living', methods=['POST'])
def living():
    return jsonify({"response": {"success": True, "message": "Server Running On " + sys.argv[1]}}), status.HTTP_200_OK


@app.route("/register", methods=['POST'])
def register():
    requests.post("https://artifacts.live/api/register",
                  params={'port': sys.argv[1]})


@app.route('/verify', methods=['POST'])
def check():
    body = request.get_json(force=True, silent=True)
    if body:
        if 'type' in body.keys():
            if 'content' in body.keys():
                if body['type'] == 'text' and isinstance(body['content'], str) and len(body['content']) > 0:
                    text = body['content'][:80000].lower()
                    grammaticalOutput = grammaticalLSTM.process(preparedData=grammaticalFilter(text))
                    lexicalOutput = lexicalLSTM.process(preparedData=lexicalFilter(text))
                    coreOutput = coreLSTM.process(mergeOutputs([grammaticalOutput, lexicalOutput]))
                    result = postprocess([coreOutput], body['content'][:80000])
                    return jsonify({"response": {"result": result, "success": True, "message": "Processed Input"}}), status.HTTP_200_OK
    return jsonify({"response": {"message": "Bad request body.", "success": False}}), status.HTTP_400_BAD_REQUEST

# route for unsupported requests


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return "Bad request.", status.HTTP_400_BAD_REQUEST


if __name__ == '__main__':
    grammaticalInit = grammaticalLSTM.process(preparedData=grammaticalFilter("Initialize."))
    print("Initialize grammatical. " + str(grammaticalInit))
    lexicalInit = lexicalLSTM.process(preparedData=lexicalFilter("Initialize."))
    print("Initialize lexical. " + str(lexicalInit))
    coreInit = coreLSTM.process(mergeOutputs([grammaticalInit, lexicalInit]))
    print("Initialize core. " + str(coreInit))
    app.run(port=sys.argv[1])
    register()

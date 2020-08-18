import flask
from flask import request, jsonify
from flask_api import status

import sys, os, pathlib
dirname = pathlib.Path(__file__).parent.absolute()
sys.path.append(os.path.join(dirname, 'neural_network_utilities'))
from preprocessing import ComplexVectorizationFilter, GrammarVectorizationFilter, RawFakeNewsDataFilterAdapter, ParallelPreprocessor
from dataset_manager import DatasetManager
from stacked_bidirectional_lstm import StackedBidirectionalLSTM

trained_models = os.path.join(dirname, 'trained_models')
grammarModel = os.path.join(trained_models, "grammar_model.hdf5")
complexModel = os.path.join(trained_models, "complex_model.hdf5")

sampleLength = 360

grammarFilter = GrammarVectorizationFilter(sampleLength=sampleLength)
grammarLSTM = StackedBidirectionalLSTM(sampleLength=grammarFilter.getSampleLength(),
                                       maxWords=grammarFilter.getMaxWords(), outputUnits=2)
grammarLSTM.importModel(grammarModel)

complexFilter = ComplexVectorizationFilter(sampleLength=sampleLength, maxWords=80000)
complexLSTM = StackedBidirectionalLSTM(sampleLength=complexFilter.getSampleLength(),
                                       maxWords=complexFilter.getMaxWords(), outputUnits=2)
complexLSTM.importModel(complexModel)

app = flask.Flask(__name__)

# route for supported requests
@app.route('/verify', methods=['POST'])
def check():
    body = request.get_json(force=True, silent=True)
    if body:
        if 'type' in body.keys():
            if 'content' in body.keys():
                if body['type'] == 'text':
                    text = body['content'].lower()
                    complexResult = complexLSTM.process(preparedData=complexFilter(text))
                    grammarResult = grammarLSTM.process(preparedData=grammarFilter(text))
                    real = (complexResult[0] + grammarResult[0]) / 2
                    fake = (complexResult[1] + grammarResult[1]) / 2
                    label = "real"
                    value = real
                    if real < fake:
                        label = "fake"
                        value = fake                        
                    return jsonify({"response": {"result" : {"prediction": label, "confidence": value}, "success": True, "message": "Processed Input."})
    return "Bad request body.", status.HTTP_400_BAD_REQUEST

# route for unsupported requests
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return "Bad request.", status.HTTP_400_BAD_REQUEST

if __name__ == '__main__':
    app.run(port=8082)


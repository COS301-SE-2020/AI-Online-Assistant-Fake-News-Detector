import requests

API = "http://54.172.96.111:8080/api"

def uploadModel(id, model):
    return 0

def downloadTrainingDataset():
    request = requests.get(url=API + "/training")
    data = request.json()
    trainingData = []
    if 'response' in data:
        if 'success' in data['response']:
            if data['response']['success'] == True:
                trainingData = data['response']['TrainingData']
    return trainingData

def downloadModels():
    request = requests.get(url=API + "/nnmodels")
    data = request.json()
    models = []
    if 'request' in data:
        if 'success' in data['request']:
            if data['request']['success'] == True:
                models = data['request']['Models']
    return models
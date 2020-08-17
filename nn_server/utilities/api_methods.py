import requests
API = "http://54.172.96.111:8080/api"


def downloadRawJSONFile(filePath):
    raise Exception("Not implemented.")


def uploadModel(id, model):
    return 0


def downloadTrainingDataset(datasetPath):
    return 0


def downloadModels():
    request = requests.get(url=API + "/nnmodels")
    data = request.json()
    models = []
    if 'request' in data:
        if 'success' in data['request']:
            if data['request']['success'] == True:
                models = data['request']['Models']
    return models
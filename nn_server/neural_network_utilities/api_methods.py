import requests
import os
import errno
import base64

API = "https://artifacts.live/API/"


def downloadTrainingDataset():
    request = requests.get(url=API + "/training")
    data = request.json()
    trainingData = []
    if 'response' in data:
        if 'success' in data['response']:
            if data['response']['success'] == True:
                trainingData = data['response']['TrainingData']
                for data in trainingData:
                    data['text'] = data['Article']
                    data['id'] = data['ID']
                    if 'Fake' == True:
                        data['label'] = 'fake'
                    else:
                        data['label'] = 'real'
                    del data['Fake']
                    del data['Article']
                    del data['ID']
    return trainingData

def downloadTrainingDatasetRange(start, amount):
    request = requests.post(url=API + "/training/range", data={'start': start, 'amount': amount})
    data = request.json()
    trainingData = []
    if 'response' in data:
        if 'success' in data['response']:
            if data['response']['success'] == True:
                trainingData = data['response']['trainingData']
                for data in trainingData:
                    data['text'] = data['Article']
                    data['id'] = data['ID']
                    if 'Fake' == True:
                        data['label'] = 'fake'
                    else:
                        data['label'] = 'real'
                    del data['Fake']
                    del data['Article']
                    del data['ID']
    return trainingData

def downloadModels(downloadPath):
    try:
        os.makedirs(downloadPath)
    except OSError as e:
        if e.errno != errno.EEXIST:
            print("Error creating directory: " + str(e))
    request = requests.get(url=API + "/nnModels")
    data = request.json()
    modelNames = []
    if 'response' in data:
        if 'success' in data['response']:
            if data['response']['success'] == True:
                models = data['response']['Models']
                for model in models:
                    modelNames.append(model['Name'])
                    file = open(os.path.join(downloadPath, model['Name']), 'w')
                    file.write(model['Model'])
    return modelNames

def downloadModel(modelName, downloadPath):
    try:
        os.makedirs(downloadPath)
    except OSError as e:
        if e.errno != errno.EEXIST:
            print("Error creating directory: " + str(e))
    request = requests.get(url=API + "/nnModels/" + modelName)
    data = request.json()
    modelNames = []
    if 'response' in data:
        if 'success' in data['response']:
            if data['response']['success'] == True:
                model = data['response']['Model']
                modelNames.append(model['Name'])
                file = open(os.path.join(downloadPath, model['Name']), 'wb')
                file.write(base64.b64decode(model['Model']))
    return modelNames

def uploadModel(modelName, modelPath):
    file = open(modelPath, 'rb')
    model = base64.b64encode(file.read())
    data = {
        'name': modelName,
        'model': model
    }
    requests.post(url=API + "/nnModels", data=data)

def updateStats(totalTime, totalRecords, trainingRate):
    totalTimeHrs = totalTime / 3600
    #data = {
    #    'name': modelName,
    #    'model': model
    #}
    #requests.post(url=API + "/nnstats", data=data)
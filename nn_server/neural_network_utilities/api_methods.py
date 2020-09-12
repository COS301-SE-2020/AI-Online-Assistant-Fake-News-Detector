import requests
import os
import errno

API = "https://artifacts.live/API/"

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

def downloadTrainingDatasetRange(start, amount):
    request = requests.post(url=API + "/training/range", data={'start': start, 'amount': amount})
    data = request.json()
    trainingData = []
    if 'response' in data:
        if 'success' in data['response']:
            if data['response']['success'] == True:
                trainingData = data['response']['trainingData']
    return trainingData

def downloadModels(downloadPath):
    try:
        os.makedirs(downloadPath)
    except OSError as e:
        if e.errno != errno.EEXIST:
            print("Error creating directory: " + str(e))
    request = requests.get(url=API + "/nnModels")
    data = request.json()
    print(data)
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
    print(data)
    modelNames = []
    if 'response' in data:
        if 'success' in data['response']:
            if data['response']['success'] == True:
                model = data['response']['Model']
                modelNames.append(model['Name'])
                file = open(os.path.join(downloadPath, model['Name']), 'w')
                file.write(model['Model'])
    return modelNames

def uploadModel(modelName, modelPath):
    file = open(modelPath, 'rb')
    model = file.read()
    data = {
        'name': modelName,
        'model': model
    }
    requests.post(url=API + "/nnModels", data=data)

if __name__ == '__main__':
    print(downloadTrainingDataset())
    print(downloadTrainingDatasetRange(0, 2))
    uploadModel('test.txt', 'uploadTest/test.txt')
    print(downloadModels('downloadTest'))
    print(downloadModel('test.txt', 'downloadTest'))
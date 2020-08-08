import os
import errno
import pathlib
import json
import pickle
import tensorflow as tf


class DatasetManager:
    def __init__(self):
        self.__dataset = ([], [])
        self.__dataDir = os.path.join(pathlib.Path(__file__).parent.absolute(), "data")
        try:
            os.makedirs(self.__dataDir)
        except OSError as e:
            if e.errno != errno.EEXIST:
                raise

    def addToDataset(self, sampleList):
        if len(sampleList):
            for sample in sampleList:
                if len(sample['text']):
                    label = [0, 0]
                    if sample['label'] == 'real':
                        label = [1, 0]
                    elif sample['label'] == 'fake':
                        label = [0, 1]
                    for data in sample['text']:
                        self.__dataset[0].append(data)
                        self.__dataset[1].append(label)

    def writeDatasetToFile(self, filePath):
        file = open(filePath, 'wb')
        pickle.dump(self.__dataset, file)
        file.close()

    def readDatasetFromFile(self, filePath):
        file = open(filePath, 'rb')
        self.__dataset = pickle.load(file)
        file.close()

    def getDataset(self):
        return self.__dataset

    @staticmethod
    def loadRawJSONFile(filePath):
        jsonFile = open(filePath, 'r', encoding="utf8")
        jsonString = jsonFile.read()
        jsonFile.close()
        sampleList = list(json.loads(jsonString.lower()))
        return sampleList
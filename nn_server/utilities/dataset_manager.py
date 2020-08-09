import os
import errno
import pathlib
import json
import pickle
import tensorflow as tf


class DatasetManager:
    def __init__(self):
        self.__dataset = None
        self.__dataDir = os.path.join(pathlib.Path(__file__).parent.absolute(), "data")
        try:
            os.makedirs(self.__dataDir)
        except OSError as e:
            if e.errno != errno.EEXIST:
                raise

    def addToDataset(self, sampleList):
        if len(sampleList):
            dataX = []
            dataY = []
            for sample in sampleList:
                if len(sample['text']):
                    label = sample['label']
                    for data in sample['text']:
                        dataX.append(data)
                        dataY.append(label)
                if self.__dataset is None:
                    print("create")
                    self.__dataset = tf.data.Dataset.from_tensors((dataX, dataY))
                else:
                    print("concat")
                    data = tf.data.Dataset.from_tensors((dataX, dataY))
                    print(data)
                    self.__dataset = self.__dataset.concatenate(data)

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
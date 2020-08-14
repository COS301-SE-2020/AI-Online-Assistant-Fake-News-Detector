import os
import errno
import pathlib
import json
import numpy as np
import tensorflow as tf

class DatasetManager:
    def __init__(self, dirPath=pathlib.Path(__file__).parent.absolute()):
        self.__dataId = []
        self.__dataX = []
        self.__dataY = []
        self.__dataDir = os.path.join(dirPath, "data")
        self.__manifestPath = os.path.join(self.__dataDir, "manifest")
        self.__maxFileSize = 100000
        self.__dataFilePrefix = os.path.join(self.__dataDir, "dataset_")
        try:
            os.makedirs(self.__dataDir)
        except OSError as e:
            if e.errno != errno.EEXIST:
                raise

    def addToDataset(self, sampleList):
        if len(sampleList):
            for sample in sampleList:
                dataId = []
                dataX = []
                dataY = []
                if len(sample['text']):
                    label = sample['label']
                    id = sample['id']
                    for data in sample['text']:
                        self.__dataId.append(id)
                        self.__dataX.append(np.array(data, dtype=np.int64))
                        self.__dataY.append(np.array(label, dtype=np.int64))

    def clearDataset(self):
        try:
            manifestFile = open(self.__manifestPath, 'r')
            for datasetFile in manifestFile:
                try:
                    os.remove(datasetFile.rstrip('\n'))
                except OSError as e:
                    print("File in manifest already removed: " + str(e))
            manifestFile.close()
        except IOError:
            print("No manifest.")

    def saveDataset(self):
        self.clearDataset()
        try:
            manifestFile = open(self.__manifestPath, 'w')
            datasetFile = None
            fileSizeCounter = 0
            newFileCounter = 0
            newFile = self.__dataFilePrefix + str(newFileCounter)
            datasetFile = open(newFile, 'w')
            manifestFile.write(newFile + '\n')
            for i in range(len(self.__dataX)):
                if fileSizeCounter > self.__maxFileSize:
                    datasetFile.close()
                    newFileCounter += 1
                    newFile = self.__dataFilePrefix + str(newFileCounter)
                    datasetFile = open(newFile, 'w')
                    manifestFile.write(newFile + '\n')
                    fileSizeCounter = 0
                datasetFile.write(json.dumps({'id': self.__dataId[i], 'x': self.__dataX[i].tolist(), 'y': self.__dataY[i].tolist()}))
                datasetFile.write('\n')
                fileSizeCounter += 1
            datasetFile.close()
            manifestFile.close()
        except IOError as e:
            print("Error writing dataset: " + str(e))

    def loadDataset(self):
        self.__dataX = []
        self.__dataY = []
        try:
            manifestFile = open(self.__manifestPath, 'r')
            for datasetFile in manifestFile:
                file = open(datasetFile.rstrip('\n'), 'r')
                for line in file:
                    data = json.loads(line)
                    self.__dataId.append(data['id'])
                    self.__dataX.append(np.array(data['x'], dtype=np.int64))
                    self.__dataY.append(np.array(data['y'], dtype=np.int64))
                file.close()
            manifestFile.close()
        except IOError as e:
            print("Error reading dataset: " + str(e))

    def __generator(self):
        dataX = []
        dataY = []
        batchCount = 0
        batchSize = 1024
        while True:
            try:
                manifestFile = open(self.__manifestPath, 'r')
                for datasetFile in manifestFile:
                    file = open(datasetFile.rstrip('\n'), 'r')
                    for line in file:
                        data = json.loads(line)
                        dataX.append(np.array(data['x'], dtype=np.int64))
                        dataY.append(np.array(data['y'], dtype=np.int64))
                        batchCount += 1
                        if batchCount > batchSize:
                            yield (np.array(dataX, dtype=np.int64), np.array(dataY, dtype=np.int64))
                            dataX = []
                            dataY = []
                            batchCount = 0
                    file.close()
                manifestFile.close()
            except IOError as e:
                print("Error reading dataset: " + str(e))

    def generator(self):
        return tf.data.Dataset.from_generator(self.__generator, output_types=(np.int64, np.int64), output_shapes=((None, 120), (None, 2)))

    def getDataX(self):
        return np.array(self.__dataX, dtype=np.int64)

    def getDataY(self):
        return np.array(self.__dataY, dtype=np.int64)

    @staticmethod
    def downloadRawJSONFile(url):
        return 0

    @staticmethod
    def loadRawJSONFile(filePath):
        jsonFile = open(filePath, 'r', encoding="utf8")
        jsonString = jsonFile.read()
        jsonFile.close()
        sampleList = list(json.loads(jsonString.lower()))
        return sampleList
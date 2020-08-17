import os
import errno
import json
import random
import numpy as np
import tensorflow as tf

DEFAULT_MAX_FILE_SIZE = 2560


class DatasetManager:
    def __init__(self, datasetPath):
        self.__datasetPath = datasetPath
        try:
            os.makedirs(self.__datasetPath)
        except OSError as e:
            if e.errno != errno.EEXIST:
                print("Error creating directory: " + str(e))

    def __loadManifest(self):
        manifest = {'datasetSize': 0, 'maxFileSize': DEFAULT_MAX_FILE_SIZE, 'sampleLength': 0, 'outputUnits': 0,
                    'rawFileCounter': 0, 'rawFiles': [], 'preparedFileCounter': 0,'preparedFiles': []}
        try:
            file = open(os.path.join(self.__datasetPath, "manifest.json"), 'r')
            manifest = json.loads(file.read())
            file.close()
        except IOError:
            print("Created new manifest.")
        return manifest

    def __saveManifest(self, manifest):
        try:
            file = open(os.path.join(self.__datasetPath, "manifest.json"), 'w')
            file.write(json.dumps(manifest))
            file.close()
        except IOError as e:
            print("Error saving manifest: " + str(e))

    def addRawData(self, dataList):
        try:
            manifest = self.__loadManifest()
            fileSizeCounter = 0
            newFile = "raw_data_" + str(manifest['rawFileCounter'])
            datasetFile = open(os.path.join(self.__datasetPath, newFile), 'w')
            manifest['rawFileCounter'] += 1
            manifest['rawFiles'].append(newFile)
            for sample in dataList:
                if fileSizeCounter > manifest['maxFileSize']:
                    datasetFile.close()
                    newFile = "raw_data_" + str(manifest['rawFileCounter'])
                    datasetFile = open(os.path.join(self.__datasetPath, newFile), 'w')
                    manifest['rawFileCounter'] += 1
                    manifest['rawFiles'].append(newFile)
                    fileSizeCounter = 0
                datasetFile.write(json.dumps(sample))
                datasetFile.write('\n')
                fileSizeCounter += 1
            datasetFile.close()
            self.__saveManifest(manifest)
        except IOError as e:
            print("Error writing dataset: " + str(e))

    def addRawDataFiles(self, fileList):
        for file in fileList:
            self.addRawData(self.loadRawJSONFile(file))

    def getRawDataGenerator(self):
        dataList = []
        batchCount = 0
        batchSize = 10000
        try:
            manifest = self.__loadManifest()
            files = manifest['rawFiles']
            random.shuffle(files)
            for datasetFile in manifest['rawFiles']:
                file = open(os.path.join(self.__datasetPath, datasetFile), 'r')
                for line in file:
                    dataList.append(json.loads(line))
                    batchCount += 1
                    if batchCount >= batchSize:
                        yield dataList
                        dataList = []
                        batchCount = 0
                file.close()
            if len(dataList) > 0:
                yield dataList
        except IOError as e:
            print("Error reading dataset: " + str(e))

    def prepareRawData(self, preprocessor):
        for dataList in self.getRawDataGenerator():
            self.addPreparedData(preprocessor(dataList))

    def addPreparedData(self, sampleList):
        try:
            manifest = self.__loadManifest()
            fileSizeCounter = 0
            newFile = "prepared_data_" + str(manifest['preparedFileCounter'])
            datasetFile = open(os.path.join(self.__datasetPath, newFile), 'w')
            manifest['preparedFileCounter'] += 1
            manifest['preparedFiles'].append(newFile)
            for sample in sampleList:
                if len(sample['text']):
                    manifest['sampleLength'] = len(sample['text'][0])
                    manifest['outputUnits'] = len(sample['label'])
                    label = sample['label']
                    id = sample['id']
                    for data in sample['text']:
                        if fileSizeCounter > manifest['maxFileSize']:
                            datasetFile.close()
                            newFile = "prepared_data_" + str(manifest['preparedFileCounter'])
                            datasetFile = open(os.path.join(self.__datasetPath, newFile), 'w')
                            manifest['preparedFileCounter'] += 1
                            manifest['preparedFiles'].append(newFile)
                            fileSizeCounter = 0
                        datasetFile.write(json.dumps({'id': id, 'x': np.array(data, dtype=np.int64).tolist(), 'y': np.array(label, dtype=np.int64).tolist()}))
                        manifest['datasetSize'] += 1
                        datasetFile.write('\n')
                        fileSizeCounter += 1
            datasetFile.close()
            self.__saveManifest(manifest)
        except IOError as e:
            print("Error writing dataset: " + str(e))

    def __preparedDataGenerator(self):
        dataX = []
        dataY = []
        batchCount = 0
        batchSize = 256
        while True:
            try:
                manifest = self.__loadManifest()
                files = manifest['preparedFiles']
                random.shuffle(files)
                for datasetFile in manifest['preparedFiles']:
                    file = open(os.path.join(self.__datasetPath, datasetFile), 'r')
                    for line in file:
                        data = json.loads(line)
                        dataX.append(np.array(data['x'], dtype=np.int64))
                        dataY.append(np.array(data['y'], dtype=np.int64))
                        batchCount += 1
                        if batchCount >= batchSize:
                            yield (np.array(dataX, dtype=np.int64), np.array(dataY, dtype=np.int64))
                            dataX = []
                            dataY = []
                            batchCount = 0
                    file.close()
            except IOError as e:
                print("Error reading dataset: " + str(e))

    def getPreparedDataGenerator(self):
        manifest = self.__loadManifest()
        return tf.data.Dataset.from_generator(self.__preparedDataGenerator, output_types=(np.int64, np.int64),
                                                 output_shapes=((None, manifest['sampleLength']), (None, manifest['outputUnits'])))

    def getDatasetSize(self):
        manifest = self.__loadManifest()
        return manifest['datasetSize']



    @staticmethod
    def loadRawJSONFile(filePath):
        jsonFile = open(filePath, 'r', encoding="utf8")
        jsonString = jsonFile.read()
        jsonFile.close()
        sampleList = list(json.loads(jsonString.lower()))
        return sampleList[:1000]



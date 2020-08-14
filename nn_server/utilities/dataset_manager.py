import os
import errno
import json
import numpy as np
import tensorflow as tf

class DatasetManager:
    def __init__(self, datasetPath):
        self.__datasetPath = datasetPath
        try:
            os.makedirs(self.__datasetPath)
        except OSError as e:
            if e.errno != errno.EEXIST:
                print("Error creating directory: " + str(e))

    def __loadManifest(self):
        manifest = {'datasetSize': 0, 'maxFileSize': 100000, 'sampleLength': 0, 'fileCounter': 0, 'files': []}
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

    def addToDataset(self, sampleList):
        try:
            manifest = self.__loadManifest()
            fileSizeCounter = 0
            newFile = "dataset_" + str(manifest['fileCounter'])
            datasetFile = open(os.path.join(self.__datasetPath, newFile), 'w')
            manifest['fileCounter'] += 1
            manifest['files'].append(newFile)
            for sample in sampleList:
                if len(sample['text']):
                    manifest['sampleLength'] = len(sample['text'][0])
                    manifest['outputUnits'] = len(sample['label'])
                    label = sample['label']
                    id = sample['id']
                    for data in sample['text']:
                        if fileSizeCounter > manifest['maxFileSize']:
                            datasetFile.close()
                            newFile = "dataset_" + str(manifest['fileCounter'])
                            datasetFile = open(os.path.join(self.__datasetPath, newFile), 'w')
                            manifest['fileCounter'] += 1
                            manifest['files'].append(newFile)
                            fileSizeCounter = 0
                        datasetFile.write(json.dumps({'id': id, 'x': np.array(data, dtype=np.int64).tolist(), 'y': np.array(label, dtype=np.int64).tolist()}))
                        manifest['datasetSize'] += 1
                        datasetFile.write('\n')
                    fileSizeCounter += 1
            datasetFile.close()
            self.__saveManifest(manifest)
        except IOError as e:
            print("Error writing dataset: " + str(e))

    def __generator(self):
        dataX = []
        dataY = []
        batchCount = 0
        batchSize = 1024
        while True:
            try:
                manifest = self.__loadManifest()
                for datasetFile in manifest['files']:
                    file = open(os.path.join(self.__datasetPath, datasetFile), 'r')
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
            except IOError as e:
                print("Error reading dataset: " + str(e))

    def getGenerator(self):
        manifest = self.__loadManifest()
        return tf.data.Dataset.from_generator(self.__generator, output_types=(np.int64, np.int64),
                                                 output_shapes=((None, manifest['sampleLength']), (None, manifest['outputUnits'])))

    def getDatasetSize(self):
        manifest = self.__loadManifest()
        return manifest['datasetSize']

    @staticmethod
    def downloadRawJSONFile(url):
        raise Exception("Not implemented.")

    @staticmethod
    def loadRawJSONFile(filePath):
        jsonFile = open(filePath, 'r', encoding="utf8")
        jsonString = jsonFile.read()
        jsonFile.close()
        sampleList = list(json.loads(jsonString.lower()))
        return sampleList
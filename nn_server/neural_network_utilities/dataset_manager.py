import os
import errno
import json
import math
import random
import pathlib
import numpy as np
import tensorflow as tf
from api_methods import downloadTrainingDatasetRange
from default_configs import DEFAULT_MAX_FILE_SIZE, DEFAULT_BATCH_SIZE

class DatasetManager:
    def __init__(self, datasetPath):
        """
        @author: AlistairPaynUP
        @:param datasetPath: The full path to the dataset is located or should be created.
        """
        self.__datasetPath = datasetPath
        self.__batchSize = DEFAULT_BATCH_SIZE
        self.__tensorType = np.int64
        try:
            os.makedirs(self.__datasetPath)
            self.__loadManifest()
        except OSError as e:
            if e.errno != errno.EEXIST:
                print("Error creating directory: " + str(e))

    def __loadManifest(self):
        """
        @author: AlistairPaynUP
        Loads the dataset manifest or creates one if it does not exist.
        """
        manifest = {'maxFileSize': DEFAULT_MAX_FILE_SIZE, 'sampleLength': 0, 'outputUnits': 0,
                    'rawDatasetSize': 0, 'rawFileCounter': 0, 'rawFiles': [],
                    'preparedDatasetSize': 0, 'preparedFileCounter': 0, 'preparedFiles': []}
        try:
            file = open(os.path.join(self.__datasetPath, "manifest.json"), 'r')
            manifest = json.loads(file.read())
            file.close()
        except IOError:
            file = open(os.path.join(self.__datasetPath, "manifest.json"), 'w')
            file.write(json.dumps(manifest))
            file.close()
            print("Created new manifest.")
        return manifest

    def __saveManifest(self, manifest):
        """
        @author: AlistairPaynUP
        @:param manifest: The manifest to be saved, formatted the same as DEFAULT_MANIFEST.
        """
        try:
            file = open(os.path.join(self.__datasetPath, "manifest.json"), 'w')
            file.write(json.dumps(manifest))
            file.close()
        except IOError as e:
            print("Error saving manifest: " + str(e))

    def addRawData(self, dataList):
        """
        @author: AlistairPaynUP
        @:param dataList: A list of raw data samples that has not yet been preprocessed.
        Creates raw data files and adds relevant info to the manifest.
        """
        if len(dataList):
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
                    manifest['rawDatasetSize'] += 1
                    fileSizeCounter += 1
                datasetFile.close()
                self.__saveManifest(manifest)
            except IOError as e:
                print("Error writing dataset: " + str(e))

    def addRawDataFiles(self, fileList):
        """
        @author: AlistairPaynUP
        @:param fileList: A list of files to add to the raw dataset.
        """
        for file in fileList:
            self.addRawData(self.loadRawJSONFile(file))

    def getRawDataGenerator(self):
        """
        @author: AlistairPaynUP
        @:return: A python generator that returns batch sized raw datasets.
        A raw data generator that can be used to stream raw data from disk during preprocessing. Randomizes file order when streaming.
        """
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
        """
        @author: AlistairPaynUP
        @:param preprocessor: The preprocessor to use to prepare each of the raw data files.
        """
        for dataList in self.getRawDataGenerator():
            self.addPreparedData(preprocessor(dataList))

    def addPreparedData(self, sampleList):
        """
        @author: AlistairPaynUP
        @:param sampleList: The sample list of prepared data to be added to the prepared dataset.
        Adds a prepared list of samples to the prepared dataset, updates the relevant manifest properties.
        """
        try:
            manifest = self.__loadManifest()
            fileSizeCounter = 0
            newFile = "prepared_data_" + str(manifest['preparedFileCounter'])
            datasetFile = open(os.path.join(self.__datasetPath, newFile), 'w')
            manifest['preparedFileCounter'] += 1
            manifest['preparedFiles'].append(newFile)
            for sample in sampleList:
                if len(sample['data']):
                    manifest['sampleLength'] = len(sample['data'][0])
                    manifest['outputUnits'] = len(sample['label'])
                    label = sample['label']
                    id = sample['id']
                    for data in sample['data']:
                        if fileSizeCounter > manifest['maxFileSize']:
                            datasetFile.close()
                            newFile = "prepared_data_" + str(manifest['preparedFileCounter'])
                            datasetFile = open(os.path.join(self.__datasetPath, newFile), 'w')
                            manifest['preparedFileCounter'] += 1
                            manifest['preparedFiles'].append(newFile)
                            fileSizeCounter = 0
                        datasetFile.write(json.dumps({'id': id, 'data': data, 'label': label}))
                        manifest['preparedDatasetSize'] += 1
                        datasetFile.write('\n')
                        fileSizeCounter += 1
            datasetFile.close()
            self.__saveManifest(manifest)
        except IOError as e:
            print("Error writing dataset: " + str(e))

    def __preparedTensorGenerator(self):
        """
        @author: AlistairPaynUP
        @:return: A python generator which yields batch sized datasets.
        A prepared data generator that can be used to stream prepared data from disk during training.
        """
        dataX = []
        dataY = []
        buffer = []
        batchCount = 0
        while True:
            try:
                manifest = self.__loadManifest()
                files = manifest['preparedFiles']
                random.shuffle(files)
                for datasetFile in manifest['preparedFiles']:
                    file = open(os.path.join(self.__datasetPath, datasetFile), 'r')
                    for line in file:
                        data = json.loads(line)
                        dataX.append(np.array(data['data'], dtype=self.__tensorType))
                        dataY.append(np.array(data['label'], dtype=self.__tensorType))
                        batchCount += 1
                        if batchCount >= self.__batchSize:
                            buffer.append((np.array(dataX, dtype=self.__tensorType), np.array(dataY, dtype=self.__tensorType)))
                            dataX = []
                            dataY = []
                            batchCount = 0
                    for data in buffer:
                        yield data
                    file.close()
            except IOError as e:
                print("Error reading dataset: " + str(e))

    def getPreparedTensorGenerator(self, batchSize, tensorType=np.int64):
        """
        @author: AlistairPaynUP
        @:return: A TensorFlow dataset that uses __generator to stream data from disk during training.
        A TensorFlow dataset with an underlying generator, used to stream data when training.
        """
        self.__tensorType = tensorType
        self.__batchSize = batchSize
        manifest = self.__loadManifest()
        return tf.data.Dataset.from_generator(self.__preparedTensorGenerator, output_types=(self.__tensorType, self.__tensorType),
                                              output_shapes=((None, manifest['sampleLength']), (None, manifest['outputUnits'])))

    def getPreparedDataGenerator(self):
        """
        @author: AlistairPaynUP
        @:return: A python generator which yields batch sized datasets.
        A prepared data generator that can be used to stream prepared data from disk during training.
        """
        dataset = []
        batchCount = 0
        try:
            manifest = self.__loadManifest()
            for datasetFile in manifest['preparedFiles']:
                file = open(os.path.join(self.__datasetPath, datasetFile), 'r')
                for line in file:
                    data = json.loads(line)
                    dataset.append(data)
                    batchCount += 1
                    if batchCount >= manifest['maxFileSize']:
                        yield dataset
                        dataset = []
                        batchCount = 0
                file.close()
            if len(dataset) > 0:
                yield dataset
        except IOError as e:
            print("Error reading dataset: " + str(e))

    def getRawDatasetSize(self):
        """
        @author: AlistairPaynUP
        @:return: The size of the raw dataset.
        """
        manifest = self.__loadManifest()
        return manifest['rawDatasetSize']

    def getPreparedDatasetSize(self):
        """
        @author: AlistairPaynUP
        @:return: The size of the prepared dataset.
        """
        manifest = self.__loadManifest()
        return manifest['preparedDatasetSize']

    @staticmethod
    def loadRawJSONFile(filePath):
        """
        @author: AlistairPaynUP
        @:param filePath: The path to the file to be loaded.
        @return: The list of items in loaded file.
        """
        jsonFile = open(filePath, 'r', encoding="utf8")
        jsonString = jsonFile.read()
        jsonFile.close()
        sampleList = list(json.loads(jsonString.lower()))
        return sampleList

def loadJSONFile(filePath):
    """
    @author: AlistairPaynUP
    @:param filePath: The path to the file to be loaded.
    @return: The list of items in loaded file.
    """
    jsonFile = open(filePath, 'r', encoding="utf8")
    jsonString = jsonFile.read()
    jsonFile.close()
    return json.loads(jsonString)

def downloadAndCreateDatasets(trainDatasetPath, validationDatasetPath):
    trainDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), trainDatasetPath))
    validationDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), validationDatasetPath))
    start = 0
    step = 10000
    while True:
        dataList = downloadTrainingDatasetRange(start, start + step)
        parition = math.floor(len(dataList) * 0.8)
        if len(dataList) == 0:
            break
        else:
            trainDataset.addRawData(dataList[:parition])
            validationDataset.addRawData(dataList[parition:])
        start += step
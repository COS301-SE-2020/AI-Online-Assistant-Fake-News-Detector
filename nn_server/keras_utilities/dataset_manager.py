import os
import errno
import pathlib
import json
import tensorflow as tf
import numpy as np

class DatasetManager:
    def __init__(self):
        self.__TFRecordDatasets = []
        self.__dataDir = os.path.join(pathlib.Path(__file__).parent.absolute(), "data")
        try:
            os.makedirs(self.__dataDir)
        except OSError as e:
            if e.errno != errno.EEXIST:
                raise

    def addToDataset(self, sampleList):
        if len(sampleList):
            dataset = None
            for sample in sampleList:
                if len(sample[0]):
                    label = [0, 0]
                    if sample[1] == 'real':
                        label = [1, 0]
                    elif sample[1] == 'fake':
                        label = [0, 1]
                    record = tf.data.Dataset.from_tensors((sample[0], np.repeat(label, len(sample[0]))))
                    if dataset:
                        dataset.concatenate(record)
                    else:
                        dataset = record
            self.__TFRecordDatasets.append(dataset)

    def getTrainDataset(self):
        return self.__TFRecordDatasets


def loadTrainingFile(filePath):
    jsonFile = open(filePath, 'r', encoding="utf8")
    jsonString = jsonFile.read()
    jsonFile.close()
    sampleList = list(json.loads(jsonString.lower()))
    return sampleList

if __name__ == "__main__":
    data = []
    data.extend(loadTrainingFile("fake_or_real.json"))
    # data.extend(loadTrainingFile("data_file1.json"))
    # data.extend(loadTrainingFile("data_file2.json"))
    # data.extend(loadTrainingFile("data_file3.json"))
    # data.extend(loadTrainingFile("data_file4.json"))
    # data.extend(loadTrainingFile("data_file5.json"))
    # data.extend(loadTrainingFile("data_file6.json"))
    # data.extend(loadTrainingFile("data_file7.json"))
    # random.shuffle(data)
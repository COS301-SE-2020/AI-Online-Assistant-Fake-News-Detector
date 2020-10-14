import os
import sys
import pathlib
import errno
import time
import math
import multiprocessing as mp
dirname = pathlib.Path(__file__).parent.absolute()
sys.path.append(os.path.join(dirname, 'neural_network_utilities'))
from dataset_manager import DatasetManager
from train_grammatical_model import runGrammaticalTrain
from train_lexical_model import runLexicalTrain
from train_core_model import runCoreTrain
from default_configs import DEFAULT_DATASETS_PATH, DEFAULT_MODELS_PATH
from api_methods import updateStats, downloadTrainingDatasetRange

def loadAndInitializeDatasetsFromDatabase(trainDatasetPath, validationDatasetPath, trainProportion = 0.8):
    trainDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), trainDatasetPath))
    validationDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), validationDatasetPath))
    start = 0
    step = 10000
    while True:
        dataList = downloadTrainingDatasetRange(start, start + step)
        parition = math.floor(len(dataList) * trainProportion)
        if len(dataList) == 0:
            break
        else:
            trainDataset.addRawData(dataList[:parition])
            validationDataset.addRawData(dataList[parition:])
        start += step

def loadAndInitializeDatasetsFromLocal(trainDatasetPath, validationDatasetPath, rawFilePath, trainProportion = 0.8):
    trainDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), trainDatasetPath))
    validationDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), validationDatasetPath))
    dataList = DatasetManager.loadRawJSONFile(rawFilePath)
    parition = math.floor(len(dataList) * trainProportion)
    trainDataset.addRawData(dataList[:parition])
    validationDataset.addRawData(dataList[parition:])

if __name__ == "__main__":
    rawTrainFiles = ["training_data.json"]
    rawValidationFiles = ["validation_data.json"]

    TRAINING_PROPORTION = 0.8  # validation is 1 - TRAINING_PROPORTION

    RAW_TRAINING_PATH = os.path.join(DEFAULT_DATASETS_PATH, "raw_train_dataset")
    RAW_VALIDATION_PATH = os.path.join(DEFAULT_DATASETS_PATH, "raw_validation_dataset")

    if len(sys.argv) == 2:
        loadAndInitializeDatasetsFromLocal(RAW_TRAINING_PATH, RAW_VALIDATION_PATH, sys.argv[1], TRAINING_PROPORTION)
    else:
        loadAndInitializeDatasetsFromDatabase(RAW_TRAINING_PATH, RAW_VALIDATION_PATH, TRAINING_PROPORTION)

    GRAMMATICAL_MODEL_PATH = os.path.join(DEFAULT_MODELS_PATH, "grammatical_model.hdf5")
    GRAMMATICAL_TRAINING_PATH = os.path.join(DEFAULT_DATASETS_PATH, "grammatical_train_dataset")
    GRAMMATICAL_VALIDATION_PATH = os.path.join(DEFAULT_DATASETS_PATH, "grammatical_validation_dataset")

    LEXICAL_MODEL_PATH = os.path.join(DEFAULT_MODELS_PATH, "lexical_model.hdf5")
    LEXICAL_TRAINING_PATH = os.path.join(DEFAULT_DATASETS_PATH, "lexical_train_dataset")
    LEXICAL_VALIDATION_PATH = os.path.join(DEFAULT_DATASETS_PATH, "lexical_validation_dataset")

    CORE_MODEL_PATH = os.path.join(DEFAULT_MODELS_PATH, "core_model.hdf5")
    CORE_TRAINING_PATH = os.path.join(DEFAULT_DATASETS_PATH, "core_train_dataset")
    CORE_VALIDATION_PATH = os.path.join(DEFAULT_DATASETS_PATH, "core_validation_dataset")

    try:
        os.makedirs(DEFAULT_MODELS_PATH)
    except OSError as e:
        if e.errno != errno.EEXIST:
            print("Error creating directory: " + str(e))

    startTime = time.time()

    if True:
        tfProcess = mp.Process(target=runGrammaticalTrain, args=(GRAMMATICAL_MODEL_PATH,
                                                                 GRAMMATICAL_TRAINING_PATH,
                                                                 GRAMMATICAL_VALIDATION_PATH,
                                                                 RAW_TRAINING_PATH,
                                                                 RAW_VALIDATION_PATH))
        tfProcess.start()
        tfProcess.join()
        # uploadModel("grammatical_model.hdf5", GRAMMATICAL_MODEL_PATH)

    if True:
        tfProcess = mp.Process(target=runLexicalTrain, args=(LEXICAL_MODEL_PATH,
                                                             LEXICAL_TRAINING_PATH,
                                                             LEXICAL_VALIDATION_PATH,
                                                             RAW_TRAINING_PATH,
                                                             RAW_VALIDATION_PATH))
        tfProcess.start()
        tfProcess.join()
        # uploadModel("lexical_model.hdf5", LEXICAL_MODEL_PATH)

    if True:
        tfProcess = mp.Process(target=runCoreTrain, args=(CORE_MODEL_PATH,
                                                          CORE_TRAINING_PATH,
                                                          CORE_VALIDATION_PATH,
                                                          GRAMMATICAL_MODEL_PATH,
                                                          GRAMMATICAL_TRAINING_PATH,
                                                          GRAMMATICAL_VALIDATION_PATH,
                                                          LEXICAL_MODEL_PATH,
                                                          LEXICAL_TRAINING_PATH,
                                                          LEXICAL_VALIDATION_PATH))
        tfProcess.start()
        tfProcess.join()
        # uploadModel("core_model.hdf5", CORE_MODEL_PATH)

    endTime = time.time()
    totalTime = math.floor(endTime - startTime)
    if totalTime == 0:
        totalTime = 0.000001

    trainingDataset = DatasetManager(RAW_TRAINING_PATH)
    validationDataset = DatasetManager(RAW_VALIDATION_PATH)
    totalRecords = trainingDataset.getRawDatasetSize() + validationDataset.getRawDatasetSize()

    trainingRate = totalRecords / totalTime
    trainingRate = math.floor(trainingRate * 10000) / 10000.0

    updateStats(totalTime, totalRecords, trainingRate)

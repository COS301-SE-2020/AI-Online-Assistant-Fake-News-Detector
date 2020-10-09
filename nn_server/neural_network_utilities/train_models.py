import os
import errno
import time
import math
import multiprocessing as mp
from dataset_manager import DatasetManager
from train_grammatical_model import runGrammaticalTrain
from train_lexical_model import runLexicalTrain
from train_core_model import runCoreTrain
from default_configs import DEFAULT_DATASETS_PATH, DEFAULT_MODELS_PATH
from api_methods import updateStats

if __name__ == "__main__":
    rawTrainFiles = ["training_data.json"]
    rawValidationFiles = ["validation_data.json"]

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
                                                             GRAMMATICAL_VALIDATION_PATH))
                                                             #rawTrainFiles,
                                                             #rawValidationFiles))
        tfProcess.start()
        tfProcess.join()

    if True:
        tfProcess = mp.Process(target=runLexicalTrain, args=(LEXICAL_MODEL_PATH,
                                                             LEXICAL_TRAINING_PATH,
                                                             LEXICAL_VALIDATION_PATH))
                                                             #rawTrainFiles,
                                                             #rawValidationFiles))
        tfProcess.start()
        tfProcess.join()

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

    endTime = time.time()
    totalTime = math.floor(endTime - startTime)

    trainingDataset = DatasetManager(GRAMMATICAL_TRAINING_PATH)
    validationDataset = DatasetManager(GRAMMATICAL_VALIDATION_PATH)
    totalRecords = trainingDataset.getRawDatasetSize() + validationDataset.getRawDatasetSize()

    trainingRate = totalRecords / totalTime
    trainingRate = math.floor(trainingRate * 10000) / 10000.0

    updateStats(totalTime, totalRecords, trainingRate)
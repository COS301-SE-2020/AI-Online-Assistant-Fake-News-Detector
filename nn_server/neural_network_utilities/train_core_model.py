import pathlib
import sys
import os
import gc
import numpy as np
from dataset_manager import DatasetManager
dirname = pathlib.Path(__file__).parent.absolute()
sys.path.append(os.path.join(dirname, 'neural_network_utilities'))
from preprocessing import FilterMultiplexorAdapter
from deep_stacked_bidirectional_lstm import DeepStackedBidirectionalLSTM
from stacked_bidirectional_lstm import StackedBidirectionalLSTM
from shallow_stack_lstm import ShallowStackedBidirectionalLSTM
from default_configs import DEFAULT_DATASETS_PATH, DEFAULT_MODELS_PATH, DEFAULT_GRAMMATICAL_SAMPLE_LENGTH, DEFAULT_LEXICAL_SAMPLE_LENGTH, DEFAULT_CORE_SAMPLE_LENGTH
from labels import RealOrFakeLabels

CORE_MODEL_PATH = os.path.join(DEFAULT_MODELS_PATH, "core_model.hdf5")
CORE_TRAINING_PATH = os.path.join(DEFAULT_DATASETS_PATH, "core_train_dataset")
CORE_VALIDATION_PATH = os.path.join(DEFAULT_DATASETS_PATH, "core_validation_dataset")

LEXICAL_MODEL_PATH = os.path.join(DEFAULT_MODELS_PATH, "lexical_model.hdf5")
LEXICAL_TRAINING_PATH = os.path.join(DEFAULT_DATASETS_PATH, "lexical_train_dataset")
LEXICAL_VALIDATION_PATH = os.path.join(DEFAULT_DATASETS_PATH, "lexical_validation_dataset")

GRAMMATICAL_MODEL_PATH = os.path.join(DEFAULT_MODELS_PATH, "grammatical_model.hdf5")
GRAMMATICAL_TRAINING_PATH = os.path.join(DEFAULT_DATASETS_PATH, "grammatical_train_dataset")
GRAMMARATICAL_VALIDATION_PATH = os.path.join(DEFAULT_DATASETS_PATH, "grammatical_validation_dataset")

def trainCore(modelName, trainDatasetPath, validationDatasetPath):
    trainDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), trainDatasetPath))
    validationDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), validationDatasetPath))
    batchSize = 128
    model = ShallowStackedBidirectionalLSTM(outputUnits=RealOrFakeLabels.getOutputUnits(), sampleLength=4, modelName="CoreNN")
    model.trainModel(trainGenerator=trainDataset.getPreparedTensorGenerator(batchSize=batchSize, tensorType=np.float32),
                     validationGenerator=validationDataset.getPreparedTensorGenerator(batchSize=batchSize, tensorType=np.float32),
                     trainDatasetSize=trainDataset.getPreparedDatasetSize(),
                     validationDatasetSize=validationDataset.getPreparedDatasetSize(),
                     batchSize=batchSize, epochs=16, saveFilePath=modelName, saveCheckpoints=False)
    model.clear()
    gc.collect()

def preprocessDatasets(trainDatasetPath, validationDatasetPath):
    grammaticalLSTM = DeepStackedBidirectionalLSTM(outputUnits=RealOrFakeLabels.getOutputUnits(),
                                                   sampleLength=DEFAULT_GRAMMATICAL_SAMPLE_LENGTH)
    grammaticalLSTM.importModel(GRAMMATICAL_MODEL_PATH)

    lexicalLSTM = StackedBidirectionalLSTM(outputUnits=RealOrFakeLabels.getOutputUnits(),
                                           sampleLength=DEFAULT_LEXICAL_SAMPLE_LENGTH)
    lexicalLSTM.importModel(LEXICAL_MODEL_PATH)

    multiplexedFilter = FilterMultiplexorAdapter([grammaticalLSTM, lexicalLSTM])

    grammaticalTrainingDataset = DatasetManager(GRAMMATICAL_TRAINING_PATH)
    grammaticalValidationDataset = DatasetManager(GRAMMARATICAL_VALIDATION_PATH)

    lexicalTrainingDataset = DatasetManager(LEXICAL_TRAINING_PATH)
    lexicalValidationDataset = DatasetManager(LEXICAL_VALIDATION_PATH)

    trainDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), trainDatasetPath))
    validationDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), validationDatasetPath))

    assert grammaticalTrainingDataset.getPreparedDatasetSize() == lexicalTrainingDataset.getPreparedDatasetSize(), "Both datasets must be built from identical data for multiplexing."

    lexicalTrainGen = lexicalTrainingDataset.getPreparedDataGenerator()
    for grammaPrep in grammaticalTrainingDataset.getPreparedDataGenerator():
        lexicalPrep = next(lexicalTrainGen)
        trainDataset.addRawData([grammaPrep, lexicalPrep])
    trainDataset.prepareRawData(multiplexedFilter)

    lexicalValidGen = lexicalValidationDataset.getPreparedDataGenerator()
    for grammaPrep in grammaticalValidationDataset.getPreparedDataGenerator():
        lexicalPrep = next(lexicalValidGen)
        validationDataset.addRawData([grammaPrep, lexicalPrep])
    validationDataset.prepareRawData(multiplexedFilter)

def runCoreTrain():
    preprocessDatasets(CORE_TRAINING_PATH, CORE_VALIDATION_PATH)

    trainCore(CORE_MODEL_PATH, CORE_VALIDATION_PATH, CORE_TRAINING_PATH)

if __name__ == "__main__":
    runCoreTrain()
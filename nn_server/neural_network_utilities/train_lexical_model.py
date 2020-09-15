import os
import gc
import errno
import pathlib
from preprocessing import LexicalVectorizationFilter, RawFakeNewsDataFilterAdapter, ParallelPreprocessor
from dataset_manager import DatasetManager, downloadAndCreateDatasets
from stacked_bidirectional_lstm import StackedBidirectionalLSTM
from default_configs import DEFAULT_DATASETS_PATH, DEFAULT_MODELS_PATH, DEFAULT_LEXICAL_SAMPLE_LENGTH
from labels import RealOrFakeLabels


def trainLexical(modelName, trainDatasetPath, validationDatasetPath, rawTrainFiles=None, rawValidationFiles=None):
    # Lexical pipeline
    filter = LexicalVectorizationFilter(sampleLength=DEFAULT_LEXICAL_SAMPLE_LENGTH)
    preprocessor = ParallelPreprocessor(filter=RawFakeNewsDataFilterAdapter(filter=filter))

    trainDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), trainDatasetPath))
    if rawTrainFiles is not None:
        trainDataset.addRawDataFiles(rawTrainFiles)
        trainDataset.prepareRawData(preprocessor)
        gc.collect()
    validationDataset = DatasetManager(
        os.path.join(pathlib.Path(__file__).parent.absolute(), validationDatasetPath))
    if rawValidationFiles is not None:
        validationDataset.addRawDataFiles(rawValidationFiles)
        validationDataset.prepareRawData(preprocessor)
        gc.collect()
    if trainDataset.getPreparedDatasetSize() > 0 and validationDataset.getPreparedDatasetSize() > 0:
        batchSize = 128
        model = StackedBidirectionalLSTM(outputUnits=RealOrFakeLabels.getOutputUnits(), sampleLength=DEFAULT_LEXICAL_SAMPLE_LENGTH, modelName="LexicalNN")
        model.trainModel(trainGenerator=trainDataset.getPreparedTensorGenerator(batchSize=batchSize),
                         validationGenerator=validationDataset.getPreparedTensorGenerator(batchSize=batchSize),
                         trainDatasetSize=trainDataset.getPreparedDatasetSize(),
                         validationDatasetSize=validationDataset.getPreparedDatasetSize(),
                         batchSize=batchSize, epochs=2, saveFilePath=modelName, saveCheckpoints=False)
        model.clear()
        gc.collect()

def preprocessDatasets(trainDatasetPath, validationDatasetPath):
    print("Lexical preprocessing...")
    trainDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), trainDatasetPath))
    validationDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), validationDatasetPath))
    filter = LexicalVectorizationFilter(sampleLength=DEFAULT_LEXICAL_SAMPLE_LENGTH)
    preprocessor = ParallelPreprocessor(filter=RawFakeNewsDataFilterAdapter(filter=filter))
    trainDataset.prepareRawData(preprocessor)
    validationDataset.prepareRawData(preprocessor)

def runLexicalTrain(modelPath, trainingPath, validationPath, rawTrainFiles=None, rawValidationFiles=None):
    if rawTrainFiles is None and rawValidationFiles is None:
        downloadAndCreateDatasets(trainingPath, validationPath)

    preprocessDatasets(trainingPath, validationPath)

    trainLexical(modelName=modelPath, trainDatasetPath=trainingPath, validationDatasetPath=validationPath,
                 rawTrainFiles=rawTrainFiles, rawValidationFiles=rawValidationFiles)


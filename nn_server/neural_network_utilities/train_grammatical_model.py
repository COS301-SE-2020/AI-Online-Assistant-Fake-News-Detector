import os
import gc
import errno
import pathlib
from preprocessing import GrammaticalVectorizationFilter, RawFakeNewsDataFilterAdapter, ParallelPreprocessor
from dataset_manager import DatasetManager, downloadAndCreateDatasets
from deep_stacked_bidirectional_lstm import DeepStackedBidirectionalLSTM
from default_configs import DEFAULT_GRAMMATICAL_SAMPLE_LENGTH
from labels import RealOrFakeLabels


def trainGrammatical(modelName, trainDatasetPath, validationDatasetPath, rawTrainFiles=None, rawValidationFiles=None):
    # grammar pipeline
    filter = GrammaticalVectorizationFilter(sampleLength=DEFAULT_GRAMMATICAL_SAMPLE_LENGTH)
    preprocessor = ParallelPreprocessor(filter=RawFakeNewsDataFilterAdapter(filter=filter))

    trainDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), trainDatasetPath))
    if rawTrainFiles is not None:
        trainDataset.addRawDataFiles(rawTrainFiles)
        trainDataset.prepareRawData(preprocessor)
        gc.collect()
    validationDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), validationDatasetPath))
    if rawValidationFiles is not None:
        validationDataset.addRawDataFiles(rawValidationFiles)
        validationDataset.prepareRawData(preprocessor)
        gc.collect()
    assert trainDataset.getPreparedDatasetSize() > 0, "Training dataset must not be empty."
    assert validationDataset.getPreparedDatasetSize() > 0, "Validation dataset must not be empty."
    batchSize = 64
    model = DeepStackedBidirectionalLSTM(outputUnits=RealOrFakeLabels.getOutputUnits(), sampleLength=DEFAULT_GRAMMATICAL_SAMPLE_LENGTH, modelName="GrammaticalNN")
    model.trainModel(trainGenerator=trainDataset.getPreparedTensorGenerator(batchSize=batchSize),
                     validationGenerator=validationDataset.getPreparedTensorGenerator(batchSize=batchSize),
                     trainDatasetSize=trainDataset.getPreparedDatasetSize(), validationDatasetSize=validationDataset.getPreparedDatasetSize(),
                     batchSize=batchSize, epochs=8, saveFilePath=modelName, saveCheckpoints=False)
    model.clear()
    gc.collect()

def preprocessDatasets(trainDatasetPath, validationDatasetPath):
    print("Grammatical preprocessing...")
    trainDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), trainDatasetPath))
    validationDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), validationDatasetPath))
    filter = GrammaticalVectorizationFilter(sampleLength=DEFAULT_GRAMMATICAL_SAMPLE_LENGTH)
    preprocessor = ParallelPreprocessor(filter=RawFakeNewsDataFilterAdapter(filter=filter))
    trainDataset.prepareRawData(preprocessor)
    validationDataset.prepareRawData(preprocessor)

def runGrammaticalTrain(modelPath, trainingPath, validationPath, rawTrainFiles=None, rawValidationFiles=None):
    if rawTrainFiles is None and rawValidationFiles is None:
        downloadAndCreateDatasets(trainingPath, validationPath)

    preprocessDatasets(trainingPath, validationPath)

    trainGrammatical(modelName=modelPath, trainDatasetPath=trainingPath, validationDatasetPath=validationPath,
                 rawTrainFiles=rawTrainFiles, rawValidationFiles=rawValidationFiles)

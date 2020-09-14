import os
import gc
import pathlib
from preprocessing import LexicalVectorizationFilter, RawFakeNewsDataFilterAdapter, ParallelPreprocessor
from dataset_manager import DatasetManager, downloadAndCreateDatasets
from stacked_bidirectional_lstm import StackedBidirectionalLSTM

def trainLexical(modelName, sampleLength, maxWords, trainDatasetPath, validationDatasetPath, rawTrainFiles=None, rawValidationFiles=None):
    # Lexical pipeline
    filter = LexicalVectorizationFilter(sampleLength=sampleLength, maxWords=maxWords)
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
        model = StackedBidirectionalLSTM(sampleLength=filter.getSampleLength(), maxWords=filter.getMaxWords(),
                                         outputUnits=2)
        model.trainModel(trainGenerator=trainDataset.getPreparedTensorGenerator(batchSize=batchSize),
                         validationGenerator=validationDataset.getPreparedTensorGenerator(batchSize=batchSize),
                         trainDatasetSize=trainDataset.getPreparedDatasetSize(),
                         validationDatasetSize=validationDataset.getPreparedDatasetSize(),
                         batchSize=batchSize, epochs=2, saveFilePath=modelName, saveCheckpoints=False)
        model.clear()
        gc.collect()

def preprocessDatasets(trainDatasetPath, validationDatasetPath, sampleLength):
    trainDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), trainDatasetPath))
    validationDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), validationDatasetPath))
    filter = LexicalVectorizationFilter(sampleLength=sampleLength)
    preprocessor = ParallelPreprocessor(filter=RawFakeNewsDataFilterAdapter(filter=filter))
    trainDataset.prepareRawData(preprocessor)
    validationDataset.prepareRawData(preprocessor)

def runLexicalTrain():
    #rawTrainFiles = ["training_data.json"]
    #rawValidationFiles = ["validation_data.json"]

    maxWords = 80000
    sampleLength = 360

    model = "lexical_model.hdf5"
    trainDataset = "lexical_train_dataset"
    validationDataset = "lexical_validation_dataset"

    downloadAndCreateDatasets(trainDataset, validationDataset)

    preprocessDatasets(trainDataset, validationDataset, sampleLength)

    trainLexical(modelName=model, sampleLength=sampleLength, maxWords=maxWords,
                 trainDatasetPath=trainDataset, validationDatasetPath=validationDataset)
                 #rawTrainFiles=rawTrainFiles, rawValidationFiles=rawValidationFiles)

if __name__ == "__main__":
    runLexicalTrain()

import os
import gc
import pathlib
from preprocessing import LexicalVectorizationFilter, RawFakeNewsDataFilterAdapter, ParallelPreprocessor
from dataset_manager import DatasetManager
from stacked_bidirectional_lstm import StackedBidirectionalLSTM

def trainLexical(modelName, sampleLength, maxWords, trainDatasetPath, validationDatasetPath, rawTrainFiles=None, rawValidationFiles=None):
    # Lexical pipeline
    filter = LexicalVectorizationFilter(sampleLength=sampleLength, maxWords=maxWords)
    preprocessor = ParallelPreprocessor(filter=RawFakeNewsDataFilterAdapter(filter=filter))

    TrainDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), trainDatasetPath))
    if rawTrainFiles is not None:
        TrainDataset.addRawDataFiles(rawTrainFiles)
        TrainDataset.prepareRawData(preprocessor)
        gc.collect()
    ValidationDataset = DatasetManager(
        os.path.join(pathlib.Path(__file__).parent.absolute(), validationDatasetPath))
    if rawValidationFiles is not None:
        ValidationDataset.addRawDataFiles(rawValidationFiles)
        ValidationDataset.prepareRawData(preprocessor)
        gc.collect()

    batchSize = 128
    model = StackedBidirectionalLSTM(sampleLength=filter.getSampleLength(), maxWords=filter.getMaxWords(),
                                     outputUnits=2)
    model.trainModel(trainGenerator=TrainDataset.getPreparedTensorGenerator(batchSize=batchSize),
                     validationGenerator=ValidationDataset.getPreparedTensorGenerator(batchSize=batchSize),
                     trainDatasetSize=TrainDataset.getDatasetSize(),
                     validationDatasetSize=ValidationDataset.getDatasetSize(),
                     batchSize=batchSize, epochs=2, saveFilePath=modelName, saveCheckpoints=False)
    model.clear()
    gc.collect()

if __name__ == "__main__":
    rawTrainFiles = ["training_data.json"]
    rawValidationFiles = ["validation_data.json"]

    maxWords = 80000
    sampleLength = 360

    model = "lexical_model.hdf5"
    trainDataset = "lexical_train_dataset"
    validationDataset = "lexical_validation_dataset"
    trainLexical(modelName=model, sampleLength=sampleLength, maxWords=maxWords,
                 trainDatasetPath=trainDataset, validationDatasetPath=validationDataset,
                 rawTrainFiles=rawTrainFiles, rawValidationFiles=rawValidationFiles)


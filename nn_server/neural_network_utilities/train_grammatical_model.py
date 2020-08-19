import os
import gc
import pathlib
from preprocessing import GrammaticalVectorizationFilter, RawFakeNewsDataFilterAdapter, ParallelPreprocessor
from dataset_manager import DatasetManager
from stacked_bidirectional_lstm import StackedBidirectionalLSTM
from deep_stacked_bidirectional_lstm import DeepStackedBidirectionalLSTM

def trainGrammar(modelName, sampleLength, trainDatasetPath, validationDatasetPath, rawTrainFiles=None, rawValidationFiles=None):
    # grammar pipeline
    filter = GrammaticalVectorizationFilter(sampleLength=sampleLength)
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
    batchSize = 64
    model = DeepStackedBidirectionalLSTM(sampleLength=filter.getSampleLength(), maxWords=filter.getMaxWords(),
                                     outputUnits=2)
    model.trainModel(trainGenerator=trainDataset.getPreparedTensorGenerator(batchSize=batchSize),
                     validationGenerator=validationDataset.getPreparedTensorGenerator(batchSize=batchSize),
                     trainDatasetSize=trainDataset.getDatasetSize(), validationDatasetSize=validationDataset.getDatasetSize(),
                     batchSize=batchSize, epochs=8, saveFilePath=modelName, saveCheckpoints=False)
    model.clear()
    gc.collect()

if __name__ == "__main__":
    rawTrainFiles = ["training_data.json"]
    rawValidationFiles = ["validation_data.json"]

    sampleLength = 360

    model = "grammatical_model.hdf5"
    trainDataset = "grammatical_train_dataset"
    validationDataset = "grammatical_validation_dataset"
    trainGrammar(modelName=model, sampleLength=sampleLength,
                 trainDatasetPath=trainDataset, validationDatasetPath=validationDataset,
                 rawTrainFiles=rawTrainFiles, rawValidationFiles=rawValidationFiles)


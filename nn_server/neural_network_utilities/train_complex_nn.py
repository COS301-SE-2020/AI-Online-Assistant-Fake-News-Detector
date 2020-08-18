import os
import gc
import pathlib
from preprocessing import ComplexVectorizationFilter, GrammarVectorizationFilter, RawFakeNewsDataFilterAdapter, ParallelPreprocessor
from dataset_manager import DatasetManager
from stacked_bidirectional_lstm import StackedBidirectionalLSTM

def trainComplex(modelName, sampleLength, maxWords, trainDatasetPath, validationDatasetPath, rawTrainFiles=None, rawValidationFiles=None):
    # complex pipeline
    complexFilter = ComplexVectorizationFilter(sampleLength=sampleLength, maxWords=maxWords)
    complexPrep = ParallelPreprocessor(filter=RawFakeNewsDataFilterAdapter(filter=complexFilter))

    complexTrainDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), trainDatasetPath))
    if rawTrainFiles is not None:
        complexTrainDataset.addRawDataFiles(rawTrainFiles)
        complexTrainDataset.prepareRawData(complexPrep)
        gc.collect()
    complexValidationDataset = DatasetManager(
        os.path.join(pathlib.Path(__file__).parent.absolute(), validationDatasetPath))
    if rawValidationFiles is not None:
        complexValidationDataset.addRawDataFiles(rawValidationFiles)
        complexValidationDataset.prepareRawData(complexPrep)
        gc.collect()

    batchSize = 128
    model = StackedBidirectionalLSTM(sampleLength=complexFilter.getSampleLength(), maxWords=complexFilter.getMaxWords(),
                                     outputUnits=2)
    model.trainModel(trainGenerator=complexTrainDataset.getPreparedTensorGenerator(batchSize=batchSize),
                     validationGenerator=complexValidationDataset.getPreparedTensorGenerator(batchSize=batchSize),
                     trainDatasetSize=complexTrainDataset.getDatasetSize(),
                     validationDatasetSize=complexValidationDataset.getDatasetSize(),
                     batchSize=batchSize, epochs=2, saveFilePath=modelName, saveCheckpoints=False)
    model.clear()
    gc.collect()

if __name__ == "__main__":
    rawTrainFiles = ["training_data.json"]
    rawValidationFiles = ["validation_data.json"]

    maxWords = 80000
    sampleLength = 360

    complexModel = "complex_model.hdf5"
    complexTrainDataset = "complex_train_dataset"
    complexValidationDataset = "complex_validation_dataset"
    trainComplex(modelName=complexModel, sampleLength=sampleLength, maxWords=maxWords, 
                 trainDatasetPath=complexTrainDataset, validationDatasetPath=complexValidationDataset,
                 rawTrainFiles=rawTrainFiles, rawValidationFiles=rawValidationFiles)


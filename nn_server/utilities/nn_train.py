import os
import gc
import pathlib
from preprocessing import ComplexVectorizationFilter, GrammarVectorizationFilter, RawFakeNewsDataFilterAdapter, ParallelPreprocessor
from dataset_manager import DatasetManager
from stacked_bidirectional_lstm import StackedBidirectionalLSTM

def trainComplex(modelName, sampleLength, maxWords, datasetPath, rawFiles=None):
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

def trainGrammar(modelName, sampleLength, trainDatasetPath, validationDatasetPath, rawTrainFiles=None, rawValidationFiles=None):
    # grammar pipeline
    grammarFilter = GrammarVectorizationFilter(sampleLength=sampleLength)
    grammarPrep = ParallelPreprocessor(filter=RawFakeNewsDataFilterAdapter(filter=grammarFilter))

    grammarTrainDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), trainDatasetPath))
    if rawTrainFiles is not None:
        grammarTrainDataset.addRawDataFiles(rawTrainFiles)
        grammarTrainDataset.prepareRawData(grammarPrep)
        gc.collect()
    grammarValidationDataset = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), validationDatasetPath))
    if rawValidationFiles is not None:
        grammarValidationDataset.addRawDataFiles(rawValidationFiles)
        grammarValidationDataset.prepareRawData(grammarPrep)
        gc.collect()
    batchSize = 64
    model = StackedBidirectionalLSTM(sampleLength=grammarFilter.getSampleLength(), maxWords=grammarFilter.getMaxWords(),
                                     outputUnits=2)
    model.trainModel(trainGenerator=grammarTrainDataset.getPreparedTensorGenerator(batchSize=batchSize),
                     validationGenerator=grammarValidationDataset.getPreparedTensorGenerator(batchSize=batchSize),
                     trainDatasetSize=grammarTrainDataset.getDatasetSize(), validationDatasetSize=grammarValidationDataset.getDatasetSize(),
                     batchSize=batchSize, epochs=4, saveFilePath=modelName, saveCheckpoints=False)
    model.clear()
    gc.collect()

def trainCore():
    # core pipeline
    grammarFilter = GrammarVectorizationFilter(sampleLength=sampleLength)
    gnn = StackedBidirectionalLSTM(sampleLength=grammarFilter.getSampleLength(), maxWords=grammarFilter.getMaxWords(),
                                   outputUnits=2)
    gnn.importModel(grammarModel)

    complexFilter = ComplexVectorizationFilter(sampleLength=sampleLength, maxWords=maxWords)
    cnn = StackedBidirectionalLSTM(sampleLength=complexFilter.getSampleLength(), maxWords=complexFilter.getMaxWords(),
                                   outputUnits=2)
    cnn.importModel(complexModel)

    mgr = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), "core_data"))

    print(gnn.process(preparedData=grammarFilter("fake news text")))
    print(cnn.process(preparedData=complexFilter("fake news text")))

if __name__ == "__main__":
    rawTrainFiles = ["training_data.json"]
    rawValidationFiles = ["validation_data.json"]

    maxWords = 80000
    sampleLength = 360

    grammarModel = "grammar_model.hdf5"
    grammarTrainDataset = "grammar_train_dataset"
    grammarValidationDataset = "grammar_validation_dataset"
    trainGrammar(modelName=grammarModel, sampleLength=sampleLength,
                 trainDatasetPath=grammarTrainDataset, validationDatasetPath=grammarValidationDataset,
                 rawTrainFiles=rawTrainFiles, rawValidationFiles=rawValidationFiles)

    complexModel = "complex_model.hdf5"
    complexDataset = "complex_dataset"
    #trainComplex(modelName=grammarModel, sampleLength=sampleLength, maxWords=maxWords,
    #             trainDatasetPath=grammarTrainDataset, validationDatasetPath=grammarValidationDataset,
    #             rawTrainFiles=rawTrainFiles, rawValidationFiles=rawValidationFiles)


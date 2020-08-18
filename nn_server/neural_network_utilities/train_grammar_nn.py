import os
import gc
import pathlib
from preprocessing import ComplexVectorizationFilter, GrammarVectorizationFilter, RawFakeNewsDataFilterAdapter, ParallelPreprocessor
from dataset_manager import DatasetManager
from stacked_bidirectional_lstm import StackedBidirectionalLSTM

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
                     batchSize=batchSize, epochs=8, saveFilePath=modelName, saveCheckpoints=False)
    model.clear()
    gc.collect()

if __name__ == "__main__":
    rawTrainFiles = ["training_data.json"]
    rawValidationFiles = ["validation_data.json"]

    sampleLength = 360

    grammarModel = "grammar_model.hdf5"
    grammarTrainDataset = "grammar_train_dataset"
    grammarValidationDataset = "grammar_validation_dataset"
    trainGrammar(modelName=grammarModel, sampleLength=sampleLength, 
                 trainDatasetPath=grammarTrainDataset, validationDatasetPath=grammarValidationDataset, 
                 rawTrainFiles=rawTrainFiles, rawValidationFiles=rawValidationFiles)


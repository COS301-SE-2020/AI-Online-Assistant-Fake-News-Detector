import gc
from preprocessing import LexicalVectorizationFilter, RawFakeNewsDataFilterAdapter, ParallelPreprocessor
from dataset_manager import DatasetManager
from stacked_bidirectional_lstm import StackedBidirectionalLSTM
from default_configs import DEFAULT_LEXICAL_SAMPLE_LENGTH
from labels import RealOrFakeLabels
from callbacks import Callbacks

def trainLexical(modelName, trainDatasetPath, validationDatasetPath):
    # Lexical pipeline
    trainDataset = DatasetManager(trainDatasetPath)
    validationDataset = DatasetManager(validationDatasetPath)

    assert trainDataset.getPreparedDatasetSize() > 0, "Training dataset must not be empty."
    assert validationDataset.getPreparedDatasetSize() > 0, "Validation dataset must not be empty."

    batchSize = 128
    model = StackedBidirectionalLSTM(outputUnits=RealOrFakeLabels.getOutputUnits(), sampleLength=DEFAULT_LEXICAL_SAMPLE_LENGTH, modelName="LexicalNN")

    model.trainModel(trainGenerator=trainDataset.getPreparedTensorGenerator(batchSize=batchSize),
                     validationGenerator=validationDataset.getPreparedTensorGenerator(batchSize=batchSize),
                     trainDatasetSize=trainDataset.getPreparedDatasetSize(),
                     validationDatasetSize=validationDataset.getPreparedDatasetSize(),
                     batchSize=batchSize, epochs=8, saveFilePath=modelName, callbacks=Callbacks(name="lexical_nn", patience=4).getCallbacks())

    model.clear()
    gc.collect()

def preprocessDataset(preparedDatasetPath, rawDatasetPath):
    print("Lexical preprocessing...")
    rawDataset = DatasetManager(rawDatasetPath)
    preparedDataset = DatasetManager(preparedDatasetPath)

    filter = LexicalVectorizationFilter(sampleLength=DEFAULT_LEXICAL_SAMPLE_LENGTH)
    preprocessor = ParallelPreprocessor(filter=RawFakeNewsDataFilterAdapter(filter=filter))

    preparedDataset.prepareRawDataFromGenerator(preprocessor, rawDataset.getRawDataGenerator())
    gc.collect()

def runLexicalTrain(modelPath, trainingPath, validationPath, rawTrainingPath=None, rawValidationPath=None):
    if rawTrainingPath is not None:
        print("Preprocessing " + rawTrainingPath)
        preprocessDataset(trainingPath, rawTrainingPath)

    if rawValidationPath is not None:
        print("Preprocessing " + rawValidationPath)
        preprocessDataset(validationPath, rawValidationPath)

    trainLexical(modelName=modelPath, trainDatasetPath=trainingPath, validationDatasetPath=validationPath)



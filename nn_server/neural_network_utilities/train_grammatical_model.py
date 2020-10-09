import gc
from preprocessing import GrammaticalVectorizationFilter, RawFakeNewsDataFilterAdapter, ParallelPreprocessor
from dataset_manager import DatasetManager
from deep_stacked_bidirectional_lstm import DeepStackedBidirectionalLSTM
from default_configs import DEFAULT_GRAMMATICAL_SAMPLE_LENGTH
from labels import RealOrFakeLabels

def trainGrammatical(modelName, trainDatasetPath, validationDatasetPath):
    # grammar pipeline
    trainDataset = DatasetManager(trainDatasetPath)
    validationDataset = DatasetManager(validationDatasetPath)

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

def preprocessDataset(preparedDatasetPath, rawDatasetPath):
    print("Grammatical preprocessing...")
    rawDataset = DatasetManager(rawDatasetPath)
    preparedDataset = DatasetManager(preparedDatasetPath)

    filter = GrammaticalVectorizationFilter(sampleLength=DEFAULT_GRAMMATICAL_SAMPLE_LENGTH)
    preprocessor = ParallelPreprocessor(filter=RawFakeNewsDataFilterAdapter(filter=filter))

    preparedDataset.prepareRawDataFromGenerator(preprocessor, rawDataset.getRawDataGenerator())
    gc.collect()

def runGrammaticalTrain(modelPath, trainingPath, validationPath, rawTrainingPath=None, rawValidationPath=None):
    if rawTrainingPath is not None:
        print("Preprocessing " + rawTrainingPath)
        preprocessDataset(trainingPath, rawTrainingPath)

    if rawValidationPath is not None:
        print("Preprocessing " + rawValidationPath)
        preprocessDataset(validationPath, rawValidationPath)

    trainGrammatical(modelName=modelPath, trainDatasetPath=trainingPath, validationDatasetPath=validationPath)


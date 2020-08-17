import random
import os
import sys
import pathlib
from preprocessing import ComplexVectorizationFilter
from preprocessing import RawFakeNewsDataFilterAdapter
from preprocessing import ParallelPreprocessor
from dataset_manager import DatasetManager
from stacked_bidirectional_lstm import StackedBidirectionalLSTM

if __name__ == "__main__":
    rawFiles = ["training_data.json"]

    maxWords = 360000
    sampleLength = 360

    filter = ComplexVectorizationFilter(sampleLength=sampleLength, maxWords=maxWords)
    preprocessor = ParallelPreprocessor(filter=RawFakeNewsDataFilterAdapter(filter=filter))

    datasetManager = DatasetManager(os.path.join(pathlib.Path(__file__).parent.absolute(), "fake_news_dataset"))
    datasetManager.addRawDataFiles(rawFiles)
    datasetManager.prepareRawData(preprocessor)

    modelPath = "fakeNewsLSTM.hdf5"
    nn = StackedBidirectionalLSTM(sampleLength=sampleLength, maxWords=maxWords, outputUnits=2)
    #nn.trainModel(generator=datasetManager.getPreparedDataGenerator(), datasetSize=datasetManager.getDatasetSize(), saveFilePath=modelPath, saveCheckpoints=False)
    #nn.exportModel(filePath=modelPath)
    nn.importModel(filePath=modelPath)

    print("Enter a news article to check: ")
    for line in sys.stdin:
        prepData = filter(text=line)
        check = nn.process(preparedData=prepData)
        print(check)
        print("Enter a news article to check: ")
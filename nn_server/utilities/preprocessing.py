import math
import spacy as sp
import random
#import keras as ks # windwos
import tensorflow.keras as ks # linux
import multiprocessing as mp
import nltk
import tensorflow as tf
from dataset_manager import DatasetManager
#physical_devices = tf.config.list_physical_devices('GPU') # linux
#tf.config.experimental.set_memory_growth(physical_devices[0], enable=True) # linux

import stacked_bidirectional_lstm as sbl

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
sp.prefer_gpu()

DEFAULT_SAMPLE_LENGTH = 60
DEFAULT_MAX_WORDS = 1200000


class Filter:
    """
    @author: AlistairPaynUP
    Interface used when implementing filter.
    """

    def __init__(self):
        super().__init__()

    def __call__(self, text):
        """
        @author: AlistairPaynUP
        @:param text: A string of lowercase text to be processed.
        @:return A list of features extracted from text.
        """
        raise Exception("__call__ not implemented!")

    def getFeatureCount(self):
        raise Exception("getFeatureCount not implemented!")


class FilterAdapter(Filter):
    """
    @author: AlistairPaynUP
    Interface used to adapt a Filter to use with another data format.
    """

    def __init__(self, filter):
        """
        @author: AlistairPaynUP
        @:param filter: The filter which is used to process each sample.
        """
        super().__init__()
        self._filter = filter

    def __call__(self, sample):
        """
        @author: AlistairPaynUP
        @:param sample: A dataset specific sample format. Used to decouple dataset specific sample format from filters.
        @:return (feature_list, label), e.g: (['text', 'pos', 'dep', 'text', 'pos', 'dep',...], 'some_label')
        """
        raise Exception("__call__ not implemented!")

    def getFeatureCount(self):
        return self._filter.getFeatureCount()


class FilterWrapper(Filter):
    """
    @author: AlistairPaynUP
    Interface used to wrap a Filter or FilterAdapter, Used to modify mode of execution to be parallel, or sequential, or network distributed.
    """

    def __init__(self, filter):
        """
        @author: AlistairPaynUP
        @:param filter: The filter which is used to process each sample.
        """
        super().__init__()
        self._filter = filter

    def __call__(self, sampleList):
        """
        @author: AlistairPaynUP
        @:param sampleList: A list of samples.
        @:return [(feature_list, label), (feature_list, label),...], e.g: [(['text', 'pos', 'dep', 'text', 'pos', 'dep',...], 'some_label'),...]
        """
        raise Exception("__call__ not implemented!")

    def getFeatureCount(self):
        return self._filter.getFeatureCount()


class SimpleFilter(Filter):
    """
    @author: AlistairPaynUP
    Faster but does not have word relationships and has less parts of speech, uses nltk at core.
    Wrap with TrainingFilterAdapter when working with training data.
    """

    def __init__(self):
        super().__init__()
        self.__featureCount = 2

    def __call__(self, text):
        """
        @author: AlistairPaynUP
        @:param text: A string of lowercase text to be processed.
        @:return A list of features extracted from text: ['text', 'pos', 'text', 'pos',...], where text=word, pos=word part of speech.
        """
        partsOfSpeech = ["PDT", "PRP", "FW", "JJ", "JJR", "JJS", "NN", "NNS",
                         "NNP", "NNPS", "POS", "RB", "RBR", "RBS", "VB",
                         "VBD", "VBG", "VBN", "VBP", "VBZ", "EX"]
        tokens = nltk.pos_tag(nltk.word_tokenize(text))
        results = []
        for token in tokens:
            if token[1] in partsOfSpeech:
                results.append(token[0])
                results.append(token[1])
        return results

    def getFeatureCount(self):
        return self.__featureCount


class ComplexFilter(Filter):
    """
    @author: AlistairPaynUP
    Slower but includes word relationships and more parts of speech, uses spacy at core.
    Wrap with TrainingFilterAdapter when working with training data.
    """

    def __init__(self):  # sampleLen should be multiple of 3
        super().__init__()
        self.__featureCount = 3
        self.__nlp = sp.load("en_core_web_lg")

    def __call__(self, text):
        """
       @author: AlistairPaynUP
       @:param text: A string of lowercase text to be processed.
       @:return A list of features extracted from text: ['text', 'pos', 'dep', 'text', 'pos', 'dep',...], where text=word, pos=word part of speech, dep=word contextual dependency.
       """
        results = []
        doc = self.__nlp(text)
        for token in doc:
            if not token.is_punct:
                if token.tag_ != "_SP":
                    results.append(token.text)
                    results.append(token.tag_)
                    results.append(token.dep_)
        return results

    def getFeatureCount(self):
        return self.__featureCount


class SimpleVectorizationFilter(Filter):
    """
    @author: AlistairPaynUP
    Slower but includes word relationships and many more parts of speech, uses spacy at core.
    Wrap with TrainingFilterAdapter when working with training data.
    This filter also vectorizes the dataset.
    """

    def __init__(self, sampleLength=DEFAULT_SAMPLE_LENGTH, maxWords=DEFAULT_MAX_WORDS):  # sampleLen should be multiple of 3
        super().__init__()
        self.__sampleLength = sampleLength
        self.__maxWords = maxWords
        self.__featureCount = 2
        if self.__sampleLength % self.__featureCount:
            raise Exception("Symmetry error: sampleLength must be a multiple of featureCount")

    def __call__(self, text):
        """
       @author: AlistairPaynUP
       @:param text: A string of lowercase text to be processed.
       @:return A list of features extracted from text: ['text', 'pos', 'dep', 'text', 'pos', 'dep',...], where text=word, pos=word part of speech, dep=word contextual dependency.
       """
        partsOfSpeech = ["PDT", "PRP", "FW", "JJ", "JJR", "JJS", "NN", "NNS",
                         "NNP", "NNPS", "POS", "RB", "RBR", "RBS", "VB",
                         "VBD", "VBG", "VBN", "VBP", "VBZ", "EX"]
        results = []
        sample = []
        doc = nltk.pos_tag(nltk.word_tokenize(text))
        for token in doc:
            if token[1] in partsOfSpeech:
                hot = ks.preprocessing.text.one_hot(token[0], self.__maxWords)
                if not len(hot):
                    hot = [0]
                sample.append(hot[0])
                hot = ks.preprocessing.text.one_hot(token[1], self.__maxWords)
                if not len(hot):
                    hot = [0]
                sample.append(hot[0])
                if len(sample) >= self.__sampleLength:
                    results.append(sample)
                    sample = []
        if len(sample):
            for i in range(len(sample), self.__sampleLength):
                sample.append(0)
            results.append(sample)
        return results

    def getFeatureCount(self):
        return self.__featureCount

    def getSampleLength(self):
        return self.__sampleLength

    def getMaxWords(self):
        return self.__maxWords


class ComplexVectorizationFilter(Filter):
    """
    @author: AlistairPaynUP
    This does the sample preprocessing as ComplexFilter but also vectorizes the result.
    Slower but includes word relationships and more parts of speech, uses spacy at core.
    Wrap with TrainingFilterAdapter when working with training data.
    This filter also vectorizes the dataset.
    """

    def __init__(self, sampleLength=DEFAULT_SAMPLE_LENGTH, maxWords=DEFAULT_MAX_WORDS):  # sampleLen should be multiple of 3
        super().__init__()
        self.__sampleLength = sampleLength
        self.__maxWords = maxWords
        self.__featureCount = 3
        self.__nlp = sp.load("en_core_web_lg")
        if self.__sampleLength % self.__featureCount:
            raise Exception("Symmetry error: sampleLength must be a multiple of featureCount")

    def __call__(self, text):
        """
       @author: AlistairPaynUP
       @:param text: A string of lowercase text to be processed.
       @:return A list of features extracted from text: ['text', 'pos', 'dep', 'text', 'pos', 'dep',...], where text=word, pos=word part of speech, dep=word contextual dependency.
       """
        results = []
        sample = []
        doc = self.__nlp(text)
        for token in doc:
            if not token.is_punct:
                if token.tag_ != "_SP":
                    hot = ks.preprocessing.text.one_hot(token.text, self.__maxWords)
                    if not len(hot):
                        hot = [0]
                    sample.append(hot[0])
                    hot = ks.preprocessing.text.one_hot(token.tag_, self.__maxWords)
                    if not len(hot):
                        hot = [0]
                    sample.append(hot[0])
                    hot = ks.preprocessing.text.one_hot(token.dep_, self.__maxWords)
                    if not len(hot):
                        hot = [0]
                    sample.append(hot[0])
                    if len(sample) >= self.__sampleLength:
                        results.append(sample)
                        sample = []
        if len(sample):
            for i in range(len(sample), self.__sampleLength):
                sample.append(0)
            results.append(sample)
        return results

    def getFeatureCount(self):
        return self.__featureCount

    def getSampleLength(self):
        return self.__sampleLength

    def getMaxWords(self):
        return self.__maxWords


class RawFakeNewsDataFilterAdapter(FilterAdapter):
    """
    @author: AlistairPaynUP
    Used to wrap raw JSON training data with the JSON format {'text': 'body of text', 'label': 'some_label'}
    """

    def __init__(self, filter):
        super().__init__(filter)

    def __call__(self, sample):
        """
        @author: AlistairPaynUP
        @:param sample: A dict with the format {'text': 'body of text', 'label': 'some_label'}
        @:return (feature_list, label), e.g: (['text', 'pos', 'dep', 'text', 'pos', 'dep',...], 'some_label')
        """
        filtered = self._filter(sample['text'])
        results = []
        for data in filtered:
            results.append(data)
        label = sample['label']
        if sample['label'] == 'real':
            label = [1, 0]
        elif sample['label'] == 'fake':
            label = [0, 1]
        return {'id': sample['id'], 'text': results, 'label': label}


class ParallelPreprocessor(FilterWrapper):
    """
    @author: AlistairPaynUP
    This doesn't work on Windows due to differences in python multiprocessing, works for unix OS.
    Used to wrap a Filter that can be run in parallel.
    """

    def __init__(self, filter):
        super().__init__(filter)

    def __processJob(self, sampleList, processGlobalResultsList, processGlobalResultsLock):
        """
        @author: AlistairPaynUP
        @:param sampleList: A list of samples for this process.
        @:param processGlobalResultsList: List where process specific results are aggregated.
        @:param processGlobalResultsLock: Lock to serialize access to the @param processGlobalResultsList.
        """
        processLocalResultsList = []
        for sample in sampleList:
            processLocalResultsList.append(self._filter(sample))  # [0] = text, [1] = label
        processGlobalResultsLock.acquire()
        processGlobalResultsList.extend(processLocalResultsList)
        processGlobalResultsLock.release()

    def __call__(self, sampleList):
        """
        @author: AlistairPaynUP
        @:param sampleList: A list of samples for this process.
        @:return [(feature_list, label), (feature_list, label),...], e.g: [(['text', 'pos', 'dep', 'text', 'pos', 'dep',...], 'some_label'),...]
        """
        # using multiprocessing instead of multithreading because CPU bound and python GIL prevents useful CPU bound threading
        manager = mp.Manager()
        processorCount = mp.cpu_count()
        segmentSize = math.floor(len(sampleList) / processorCount)
        processGlobalResultsList = manager.list()
        processGlobalResultsLock = manager.Lock()
        activeProcessList = []
        for p in range(processorCount):
            startSegment = p * segmentSize
            if processorCount == p + 1:
                endSegment = len(sampleList)
            else:
                endSegment = (p + 1) * segmentSize
            newProcess = mp.Process(target=self.__processJob, args=(
                sampleList[startSegment:endSegment], processGlobalResultsList,
                processGlobalResultsLock))  # create a copy of a specific range for the process
            newProcess.start()
            activeProcessList.append(newProcess)
        for process in activeProcessList:
            process.join()
        return processGlobalResultsList


class SequentialPreprocessor(FilterWrapper):
    """
    @author: AlistairPaynUP
    Use this if using Windows, or implement Windows compatible parallel processing.
    Used to wrap a Filter to run.
    """

    def __init__(self, filter):
        super().__init__(filter)

    def __call__(self, sampleList):
        results = []
        for sample in sampleList:
            results.append(self._filter(sample))
        return results


class VectorizationFilter(Filter):
    """
    @author: AlistairPaynUP
    Vectorizes text to fixed length vectors, and uses 0 as mask.
    Use this if you have implemented other filters which need to run after passing data through a ComplexOrSimple filter.
    """

    def __init__(self, featureCount, sampleLength=DEFAULT_SAMPLE_LENGTH, maxWords=DEFAULT_MAX_WORDS):
        super().__init__()
        self.__featureCount = featureCount
        self.__sampleLength = sampleLength
        self.__maxWords = maxWords
        self.__mask = 0
        if self.__sampleLength % self.__featureCount:
            raise Exception("sampleLength must be a multiple of featureCount")

    def __call__(self, filteredData):
        """
        @author: AlistairPaynUP
        @:param sampleList: A list of sample filtered by a Filter e.g: SimpleFilter or ComplexFilter.
        @:return A list of vectorized features extracted from text.
        """
        results = []
        sample = []
        for s in range(0, len(filteredData), self.__featureCount):
            for f in range(0, self.__featureCount):
                hot = ks.preprocessing.text.one_hot(filteredData[s + f], self.__maxWords)
                if not len(hot):
                    hot = [0]
                sample.append(hot[0])
            if len(sample) >= self.__sampleLength:
                results.append(sample)
                sample = []
        if len(sample):
            for i in range(len(sample), self.__sampleLength):
                sample.append(0)
            results.append(sample)
        return results

    def getFeatureCount(self):
        return self.__featureCount

    def getSampleLength(self):
        return self.__sampleLength

    def getMaxWords(self):
        return self.__maxWords


if __name__ == "__main__":
    maxWords = 1200000
    sampleLength = 120

    datasetManager = DatasetManager()

    rawFiles = ["./training_data/data_file0.json",
                "./training_data/data_file1.json"]
    """
                "./training_data/data_file2.json",
                "./training_data/data_file3.json",
                "./training_data/data_file4.json"]
    
                "./training_data/data_file5.json",
                "./training_data/data_file6.json",
                "./training_data/data_file7.json"]
    """
    """
    simplePrep = ParallelFilterWrapper(
        filter=RawDataFilterAdapter(filter=SimpleVectorizationFilter(sampleLength=sampleLength, maxWords=maxWords)))

    complexPrep = ParallelFilterWrapper(
        filter=RawDataFilterAdapter(filter=ComplexVectorizationFilter(sampleLength=sampleLength, maxWords=maxWords)))

    for file in rawFiles:
        print("Processing: " + str(file))
        data = DatasetManager.loadRawJSONFile(file)
        data = simplePrep(data)
        print("Adding...")
        datasetManager.addToDataset(data)
    print("Done processing, writing.")
    datasetManager.writeDatasetToFile("simple_prep.json")
    """


    #datasetManager.readDatasetFromFile("simple_prep.pickle")

    #data = (data[0][:1000], data[1][:1000])
    """
     print("Dataset size: " + str(len(data[0])))
    validPercent = 0.1
    validEnd = int(len(data[1]) * validPercent)
    valid = (data[0][:validEnd], data[1][:validEnd])
    train = (data[0][validEnd:], data[1][validEnd:])
    data = None   
    """

    data = DatasetManager.loadRawJSONFile("fake_or_real.json")
    filter = SimpleVectorizationFilter(sampleLength=sampleLength, maxWords=maxWords)
    preprocessor = SequentialPreprocessor(filter=RawFakeNewsDataFilterAdapter(filter=filter))
    data = preprocessor(data[:20])
    datasetManager.addToDataset(data)
    data = datasetManager.getDataset()
    print(data)
    for d in data:
        print(d)
    nn = sbl.StackedBidirectionalLSTM(filter=filter, outputCount=2)
    nn.trainModel(trainingDataset=data, saveFilePath="newModel.hdf5")
    prepData = filter(text="This is where the fakes news goes")
    check = nn.process(prepData)
    print(check)

import time
import random
import math
import json
import os
import errno
import pathlib
import multiprocessing
from multiprocessing import Process, Manager
import spacy
import nltk

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
from keras.preprocessing.text import Tokenizer
from keras.preprocessing import text_dataset_from_directory

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
        self.__nlp = spacy.load("en_core_web_sm")

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


class TrainingFilterAdapter(FilterAdapter):
    """
    @author: AlistairPaynUP
    Used to wrap training data with the format {'text': 'body of text', 'label': 'some_label'}
    """

    def __init__(self, filter):
        super().__init__(filter)

    def __call__(self, sample):
        """
        @author: AlistairPaynUP
        @:param sample: A dict with the format {'text': 'body of text', 'label': 'some_label'}
        @:return (feature_list, label), e.g: (['text', 'pos', 'dep', 'text', 'pos', 'dep',...], 'some_label')
        """
        samples = self._filter(sample['text'])
        label = sample['label']
        results = []
        for sample in samples:
            results.append(sample)
        return (results, label)


class ParallelFilterWrapper(FilterWrapper):
    """
    @author: AlistairPaynUP
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
        manager = Manager()
        processorCount = multiprocessing.cpu_count()
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
            newProcess = Process(target=self.__processJob, args=(
                sampleList[startSegment:endSegment], processGlobalResultsList,
                processGlobalResultsLock))  # create a copy of a specific range for the process
            newProcess.start()
            activeProcessList.append(newProcess)
        for process in activeProcessList:
            process.join()
        return processGlobalResultsList



class SequentialFilterWrapper(FilterWrapper):
    def __init__(self, filter):
        super().__init__(filter)

    def __call__(self, sampleList):
        results = []
        for sample in sampleList:
            results.append(self._filter(sample))
        return results



def loadTrainingFile(filePath):
    jsonFile = open(filePath, 'r', encoding="utf8")
    jsonString = jsonFile.read()
    jsonFile.close()
    sampleList = list(json.loads(jsonString.lower()))
    random.shuffle(sampleList)
    return sampleList[:50]

class VectorizeAndLabelFilter(Filter):
    def __init__(self, featureCount, sampleLength=30, maxWords=10000000000):
        super().__init__()
        self.__mask = 0
        self.__tokenizer = Tokenizer(num_words=maxWords, oov_token=self.__mask)
        self.__featureCount = featureCount
        self.__sampleLength = sampleLength
        if not sampleLength % featureCount:
            raise Exception("sampleLength must be a multiple of featureCount")

    def __call__(self, sampleList):
        """
        @author: AlistairPaynUP
        @:param sampleList: A list of samples filtered by a Filter.
        @:return A list of vectorized features extracted from text.
        """
        results = []
        for sample in sampleList:
            text = sample[0]
            label = sample[1]
            result = []
            self.__tokenizer.fit_on_texts(text)
            sequences = self.__tokenizer.texts_to_sequences(text)
            counter = 0
            vector = []
            for sequence in sequences:
                id = self.__mask
                if len(sequence):
                    id = sequence[0]
                if counter < self.__sampleLength:
                    vector.append(id)
                    counter += 1
                else:
                    result.append(vector)
                    vector = []
                    counter = 0
            if counter != self.__sampleLength:
                for pad in range(counter, self.__sampleLength):
                    vector.append(self.__mask)
                result.append(vector)
            results.append((result, label))
        return results


class VectorizeAndEncodeFilter(Filter):
    def __init__(self, featureCount, sampleLength=30, maxWords=10000000000):
        super().__init__()
        self.__mask = 0
        self.__tokenizer = Tokenizer(num_words=maxWords, oov_token=self.__mask)
        self.__featureCount = featureCount
        self.__sampleLength = sampleLength
        if not sampleLength % featureCount:
            raise Exception("sampleLength must be a multiple of featureCount")

    def __call__(self, sampleList):
        """
        @author: AlistairPaynUP
        @:param sampleList: A list of samples filtered by a Filter.
        @:return A list of vectorized features extracted from text.
        """
        results = []
        for sample in sampleList:
            text = sample[0]
            label = sample[1]
            result = []
            self.__tokenizer.fit_on_texts(text)
            sequences = self.__tokenizer.texts_to_sequences(text)
            counter = 0
            vector = []
            for sequence in sequences:
                id = self.__mask
                if len(sequence):
                    id = sequence[0]
                if counter < self.__sampleLength:
                    vector.append(id)
                    counter += 1
                else:
                    result.append(vector)
                    vector = []
                    counter = 0
            if counter != self.__sampleLength:
                for pad in range(counter, self.__sampleLength):
                    vector.append(self.__mask)
                result.append(vector)
            results.append((result, label))
        return results

class VectorizeFilter(Filter):
    def __init__(self, featureCount, sampleLength=30, maxWords=10000000000):
        super().__init__()
        self.__mask = 0
        self.__featureCount = featureCount
        self.__sampleLength = sampleLength
        if not sampleLength % featureCount:
            raise Exception("sampleLength must be a multiple of featureCount")

    def __call__(self, sampleList):
        """
        @author: AlistairPaynUP
        @:param sampleList: A list of samples filtered by a Filter.
        @:return A list of vectorized features extracted from text.
        """
        results = []
        for sample in sampleList:
            text = sample[0]
            label = sample[1]
            result = []
            counter = 0
            vector = []
            for word in text:
                if counter < self.__sampleLength:
                    vector.append(word)
                    counter += 1
                else:
                    result.append(vector)
                    vector = []
                    counter = 0
            if counter != self.__sampleLength:
                for pad in range(counter, self.__sampleLength):
                    vector.append(self.__mask)
                result.append(vector)
            results.append((result, label))
        return results

class DatasetDirectoryManager:
    def __init__(self):
        self.__realCounter = 0
        self.__fakeCounter = 0
        self.__rootDir = os.path.join(pathlib.Path(__file__).parent.absolute(), "data")
        self.__trainDir = os.path.join(self.__rootDir, "train")
        self.__realDir = os.path.join(self.__trainDir, "real")
        self.__fakeDir = os.path.join(self.__trainDir, "fake")
        try:
            os.makedirs(self.__rootDir)
            os.makedirs(self.__realDir)
            os.makedirs(self.__fakeDir)
        except OSError as e:
            if e.errno != errno.EEXIST:
                raise

    def addToDataset(self, sampleList):
        for sample in sampleList:
            file = None
            if sample[1] == "real":
                file = open(os.path.join(self.__realDir, "real_" + str(self.__realCounter) + ".txt"), 'w',
                            encoding="utf8")
                self.__realCounter += 1
            elif sample[1] == "fake":
                file = open(os.path.join(self.__fakeDir, "fake_" + str(self.__fakeCounter) + ".txt"), 'w',
                            encoding="utf8")
                self.__fakeCounter += 1
            if file:
                output = ""
                for vector in sample[0]:
                    first = True
                    for feature in vector:
                        if first:
                            first = False
                        else:
                            output += ","
                        output += str(feature)
                    output += "\n"
                file.write(output)
                file.close()

    def getTrainDataset(self):
        return text_dataset_from_directory(self.__trainDir)

class DatasetFileManager:
    def __init__(self):
        self.__realCounter = 0
        self.__fakeCounter = 0
        self.__rootDir = os.path.join(pathlib.Path(__file__).parent.absolute(), "data")
        self.__trainDir = os.path.join(self.__rootDir, "train")
        self.__realDir = os.path.join(self.__trainDir, "real")
        self.__fakeDir = os.path.join(self.__trainDir, "fake")
        try:
            os.makedirs(self.__rootDir)
            os.makedirs(self.__realDir)
            os.makedirs(self.__fakeDir)
        except OSError as e:
            if e.errno != errno.EEXIST:
                raise

    def addToDataset(self, sampleList):
        for sample in sampleList:
            file = None
            if sample[1] == "real":
                file = open(os.path.join(self.__realDir, "real.txt"), 'a',
                            encoding="utf8")
                self.__realCounter += 1
            elif sample[1] == "fake":
                file = open(os.path.join(self.__fakeDir, "fake.txt"), 'a',
                            encoding="utf8")
                self.__fakeCounter += 1
            if file:
                output = ""
                for vector in sample[0]:
                    first = True
                    for feature in vector:
                        if first:
                            first = False
                        else:
                            output += " "
                        output += str(feature)
                    output += "\n"
                file.write(output)
                file.close()

if __name__ == "__main__":
    data = loadTrainingFile("fake_or_real.json")  # array of dicts
    dataset = DatasetDirectoryManager()

    filterSS = SequentialFilterWrapper(TrainingFilterAdapter(SimpleFilter()))
    filterPS = ParallelFilterWrapper(TrainingFilterAdapter(SimpleFilter()))
    filterSC = SequentialFilterWrapper(TrainingFilterAdapter(ComplexFilter()))
    filterPC = ParallelFilterWrapper(TrainingFilterAdapter(ComplexFilter()))

    s = SimpleFilter()
    c = ComplexFilter()
    # print(s("Here's the text that has been filtered by runnning a Simple Filter."))
    # print(c("Here's the text that has been filtered by running a Complex Filter."))
    t0 = time.time()
    print("Original")
    print(data[0])
    data = filterSC(data)
    print("Labelled")
    print(data[0])
    prep = VectorizeFilter(featureCount=filterSC.getFeatureCount(), sampleLength=100)
    data = prep(data)
    print("Tokenized")
    print(data)
    t1 = time.time()
    print(t1 - t0)
    dataset.addToDataset(data)
    print(dataset.getTrainDataset())
    """
    print("Sequential Simple")
    t0 = time.time()
    filterSS(data)
    t1 = time.time()
    print(t1 - t0)
    
    print("Parallel Simple")
    t0 = time.time()
    filterPS(data)
    t1 = time.time()
    print(t1 - t0)
    
    print("Sequential Complex")
    t0 = time.time()
    filterSC(data)
    t1 = time.time()
    print(t1 - t0)
    
    print("Parallel Complex")
    t0 = time.time()
    filterPC(data)
    t1 = time.time()
    print(t1 - t0)
    """

import math
import spacy as sp
import tensorflow.keras as ks
import multiprocessing as mp
import nltk

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
sp.prefer_gpu()

DEFAULT_SAMPLE_LENGTH = 360
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


class LexicalFilter(Filter):
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
                    results.append(token.lemma_)
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

    def __init__(self, sampleLength=DEFAULT_SAMPLE_LENGTH,
                 maxWords=DEFAULT_MAX_WORDS):  # sampleLen should be multiple of 3
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


class LexicalVectorizationFilter(Filter):
    """
    @author: AlistairPaynUP
    This does the sample preprocessing as LexicalFilter but also vectorizes the result.
    Slower but includes word relationships and more parts of speech, uses spacy at core.
    Wrap with TrainingFilterAdapter when working with training data.
    This filter also vectorizes the dataset.
    """

    def __init__(self, sampleLength=DEFAULT_SAMPLE_LENGTH,
                 maxWords=DEFAULT_MAX_WORDS):  # sampleLen should be multiple of 3
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
                    hot = ks.preprocessing.text.one_hot(token.lemma_, self.__maxWords)
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


class GrammaticalVectorizationFilter(Filter):
    """
    @author: AlistairPaynUP
    This does the sample preprocessing as LexicalFilter but also vectorizes the result.
    Slower but includes word relationships and more parts of speech, uses spacy at core.
    Wrap with TrainingFilterAdapter when working with training data.
    This filter also vectorizes the dataset.
    """

    def __init__(self, sampleLength=DEFAULT_SAMPLE_LENGTH):  # sampleLen should be multiple of 3
        super().__init__()
        self.__sampleLength = sampleLength
        self.__featureCount = 2
        self.__nlp = sp.load("en_core_web_lg")
        tokens = [
            'ADJ', 'ADP', 'ADV', 'AUX', 'CONJ', 'CCONJ', 'DET', 'INTJ', 'NOUN', 'NUM',
            'PART', 'PRON', 'PROPN', 'PUNCT', 'SCONJ', 'SYM', 'VERB', 'X', 'SPACE',
            'acl', 'advcl', 'advmod', 'agent', 'amod', 'appos', 'attr', 'aux', 'case', 'cc',
            'ccomp', 'compound', 'conj', 'cop', 'csubj', 'dep', 'det', 'dobj', 'expl', 'intj',
            'mark', 'meta', 'neg', 'nn', 'nounmod', 'npmod', 'nsubj', 'nsubjpass', 'nummod', 'oprd',
            'obj', 'obl', 'parataxis', 'pcomp', 'pobj', 'poss', 'preconj', 'prep', 'prt', 'punct',
            'quantmod', 'relcl', 'xcomp', 'ROOT', 'discourse', 'dislocated', 'fixed', 'flat', 'goeswith', 'iobj',
            'list', 'mark', 'nmod', 'orphan', 'root', 'vocative', 'npadvmod', 'auxpass', 'acomp', 'dative',
            'csubjpass', 'predet', 'qmod'
        ]
        self.__indices = {}
        self.__maxWords = 1
        for token in tokens:
            self.__indices[token] = self.__maxWords
            self.__maxWords += 1
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
                    sample.append(self.__indices[token.pos_])
                    sample.append(self.__indices[token.dep_])
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


class ReadabilityFilter(Filter):
    """
    NOT IMPLEMENTED
    @author: AlistairPaynUP
    Calculates the readability of a passage of text using readability formulae.
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


class POSFilter(Filter):
    """
    NOT IMPLEMENTED
    @author: AlistairPaynUP
    Totals the number of all the different parts of speech in the article, divides each by word count.
    Also returns the
    """

    def __init__(self):
        super().__init__()

    def __call__(self, text):
        """
        @author: AlistairPaynUP
        @:param text: A string of lowercase text to be processed.
        @:return A list of features extracted from text: ['posp', 'mode', 'posp', 'mode',...], where posp=part of speech proportion, mode=most common word for the pos.
        """
        raise Exception("__call__ not implemented!")

    def getFeatureCount(self):
        raise Exception("getFeatureCount not implemented!")


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
        @:return (feature_list, label), e.g: {'id': 123, 'data': [lemma, pos, dep, lemma, pos, dep, ...], 'label': [0, 1]}
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
        return {'id': sample['id'], 'data': results, 'label': label}


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
    Use this if you have implemented other filters which need to run after passing data through a LexicalOrSimple filter.
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
        @:param sampleList: A list of sample filtered by a Filter e.g: SimpleFilter or LexicalFilter.
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


class FilterMultiplexorAdapter(FilterAdapter):
    """
    Takes multiple filters but returns a single result.
    """

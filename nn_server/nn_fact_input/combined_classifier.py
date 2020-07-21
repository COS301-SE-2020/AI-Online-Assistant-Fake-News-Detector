import sys
import json
import random
import statistics
import multiprocessing
from multiprocessing import Process, Manager
import math
import pickle
import nltk
from nltk.classify.scikitlearn import SklearnClassifier
from sklearn.naive_bayes import MultinomialNB, BernoulliNB, GaussianNB
from sklearn.linear_model import LogisticRegression,SGDClassifier
from sklearn.svm import SVC, LinearSVC, NuSVC
    
class CombinedClassifier:
    def __init__(self):
        self.preparedData = []
        self.classifiers = [SklearnClassifier(MultinomialNB()),
                            SklearnClassifier(BernoulliNB()),
                            SklearnClassifier(LogisticRegression(n_jobs=-1)),
                            SklearnClassifier(SGDClassifier(n_jobs=-1)),
                            SklearnClassifier(SVC()),
                            SklearnClassifier(LinearSVC()),
                            SklearnClassifier(NuSVC())
        ]
        
    def __loadDataFromFile(self, filePath):
        jsonFile = open(filePath, 'r')
        jsonString = jsonFile.read()
        jsonFile.close()
        dataList = list(json.loads(jsonString.lower()))
        random.shuffle(dataList)
        return dataList

    def __featureTagger(self, text):
        tokens = nltk.word_tokenize(text)
        partsOfSpeech = nltk.pos_tag(tokens)
        features = []
        acceptedPartsOfSpeech = ["PDT", "PRP", "FW", "EX", "JJ", "JJR", "JJS", "NN", "NNS", "NNP", "NNPS", "POS", "RB", "RBR", "RBS", "VB", "VBD", "VBG", "VBN", "VBP", "VBZ"]
        for word in partsOfSpeech:
            if word[1] in acceptedPartsOfSpeech:
                features.append(word)
        return dict(features)
    
    def __sampleFeatureTagger(self, sampleList, processGlobalResultsList, processGlobalResultsLock):
        processLocalResultsList = []
        for sample in sampleList:
            processLocalResultsList.append((dict(self.__featureTagger(sample['text'])), sample['label']))
        processGlobalResultsLock.acquire()
        processGlobalResultsList.extend(processLocalResultsList)
        processGlobalResultsLock.release()

    def __parallelFeatureTagger(self, trainingSetList):
        manager = Manager()
        processorCount = multiprocessing.cpu_count()
        segmentSize = math.floor(len(trainingSetList) / processorCount)
        processGlobalResultsList =  manager.list()
        processGlobalResultsLock = manager.Lock()
        processList = []
        for p in range (processorCount):
            startSegment = p * segmentSize
            if processorCount == p + 1:
                endSegment = len(trainingSetList)
            else:
                endSegment = (p + 1) * segmentSize
            newProcess = Process(target=self.__sampleFeatureTagger, args=(trainingSetList[startSegment:endSegment], processGlobalResultsList, processGlobalResultsLock))
            newProcess.start()
            processList.append(newProcess)
        for process in processList:
            process.join()
        return processGlobalResultsList
    
    def __prepareDataFromFile(self, filePath):
        self.__preparedData = self.__parallelFeatureTagger(self.__loadDataFromFile(filePath))
    
    def exportModelToFile(self, modelFilePath):
        pickle.dump(self.classifiers, open(modelFilePath, 'wb'))
        
    def importModelFromFile(self, modelFilePath):
        self.classifiers = pickle.load(open(modelFilePath, 'rb'))
        
    def trainModel(self, trainingSet):
        for classifier in self.classifiers:
            classifier.train(trainingSet)
        print("checking accuracy...")
        for classifier in self.classifiers:
            print(nltk.classify.accuracy(classifier, trainingSet))

    def trainModelFromFile(self, dataFilePath):
        self.__prepareDataFromFile(dataFilePath)
        self.trainModel(self.__preparedData)
    
    def classify(self, sample):
        results = []
        features = self.__featureTagger(sample.lower())
        for classifier in self.classifiers:
            results.append(classifier.classify(features))
        return statistics.mode(results)

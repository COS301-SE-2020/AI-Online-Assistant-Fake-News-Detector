import sys
import statistics
import math
import pickle
import nltk
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
from nltk.classify.scikitlearn import SklearnClassifier
from sklearn.naive_bayes import MultinomialNB, BernoulliNB, GaussianNB
from sklearn.linear_model import LogisticRegression,SGDClassifier
from sklearn.svm import SVC, LinearSVC, NuSVC
    
class CombinedClassifier:
    def __init__(self):
        super().__init__()
        self.__featureTagger = None
        self.__classifiers = [SklearnClassifier(MultinomialNB()),
                            SklearnClassifier(BernoulliNB()),
                            SklearnClassifier(LogisticRegression(n_jobs=-1)),
                            SklearnClassifier(SGDClassifier(n_jobs=-1)),
                            SklearnClassifier(SVC()),
                            SklearnClassifier(LinearSVC()),
                            SklearnClassifier(NuSVC())
        ]        
    
    def exportModelToFile(self, modelFilePath):
        fileOut = open(modelFilePath, 'wb')
        pickle.dump(self.__classifiers, fileOut)
        fileOut.close()
        
    def importModelFromFile(self, modelFilePath):
        fileIn = open(modelFilePath, 'rb')
        self.__classifiers = pickle.load(fileIn)
        fileIn.close()
        
    def trainModel(self, taggedTrainingData):
        for classifier in self.__classifiers:
            classifier.train(taggedTrainingData)
        print("checking accuracy...")
        for classifier in self.__classifiers:
            print(nltk.classify.accuracy(classifier, taggedTrainingData))

    def useFeatureTagger(self, featureTagger):
        self.__featureTagger = featureTagger
            
    def classify(self, sample):
        results = []
        features = sample
        if self.__featureTagger:
            features = self.__featureTagger(features)                       
        for classifier in self.__classifiers:
            results.append(classifier.classify(features))
        return statistics.mode(results)

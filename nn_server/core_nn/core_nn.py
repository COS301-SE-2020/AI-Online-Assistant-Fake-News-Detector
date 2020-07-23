import sys, os
dirname = os.path.dirname(__file__)
sys.path.append(os.path.join(dirname, '..', 'nn_input'))
sys.path.append(os.path.join(dirname, '..', 'classifier_utilities'))
from nn_input import NNInput
from combined_classifier import CombinedClassifier

class CoreNN(NNInput, CombinedClassifier):
    def __init__(self):
        super().__init__()
        self.setName("core_nn")
        self.__inputs = []        

    def addInput(self, i):
        self.__inputs.append(i)
                
    def process(self, text):
        resultDict = {}
        for i in self.__inputs:
            resultDict[i.getName()] = i.process(text)
        return float(self.classify(resultDict))

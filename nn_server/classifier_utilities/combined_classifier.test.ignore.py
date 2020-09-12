import sys, os
import unittest
dirname = os.path.dirname(__file__)
testModelPath = os.path.join(dirname, 'test.model')
from combined_classifier import CombinedClassifier

def testFeatureTagger(text):
    testDict = {}
    return testDict

class TestCombinedClassifier(unittest.TestCase):
    def setUp(self):
        self.classifier = CombinedClassifier()
        assert self.classifier != None
        self.classifier.useFeatureTagger(testFeatureTagger)

    def testUseFeatureTagger(self):
        print("Testing if text processing works")        
        print("\tPass 1 - Recieves sentence array and returns float result")

    def testTrainModel(self):
        print("Testing if text processing works")        
        print("\tPass 1 - Trains model")        
        
    def testImportModel(self):
        print("Testing if text processing works")        
        print("\tPass 1 - Exports model")

    def testExportModel(self):
        print("Testing if text processing works")        
        print("\tPass 1 - Imports model")      
        
if __name__ == '__main__':
    print("===== Testing NNFactInput =====")
    unittest.main()

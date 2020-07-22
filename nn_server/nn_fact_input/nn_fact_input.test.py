import sys, os
import unittest
dirname = os.path.dirname(__file__)
trainedModelPath = os.path.join(dirname, '..', 'trained_models/nn_fact_input.model')
from nn_fact_input import NNFactInput
from fact_feature_tagger import factFeatureTagger

class TestApp(unittest.TestCase):
    def setUp(self):        
        self.factInput = NNFactInput()
        assert self.factInput != None
        self.factInput.importModelFromFile(trainedModelPath)

    def testProcess(self):
        print("Testing if text processing works")
        assert isinstance(self.factInput.process(["Some test text.", "Some more text."]), float)
        print("\tPass 1 - Recieves sentence array and returns float result")
        
if __name__ == '__main__':
    print("===== Testing NNFactInput =====")
    unittest.main()


    

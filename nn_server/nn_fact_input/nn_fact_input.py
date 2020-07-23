import sys, os
dirname = os.path.dirname(__file__)
sys.path.append(os.path.join(dirname, '..', 'classifier_utilities'))
sys.path.append(os.path.join(dirname, '..', 'nn_input'))
from combined_classifier import CombinedClassifier
from training_input_tagger import TrainingInputTagger
from nn_input import NNInput
from fact_feature_tagger import factFeatureTagger

class NNFactInput(NNInput, CombinedClassifier):    
    def __init__(self):
        super().__init__()
        self.setName("nn_fact_input")
        self.useFeatureTagger(factFeatureTagger)

    def process(self, text):         
        return float(self.classify(text))


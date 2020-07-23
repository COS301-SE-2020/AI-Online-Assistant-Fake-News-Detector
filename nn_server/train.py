import sys, os
dirname = os.path.dirname(__file__)
sys.path.append(os.path.join(dirname, 'classifier_utilities'))
sys.path.append(os.path.join(dirname, 'core_nn'))
sys.path.append(os.path.join(dirname, 'nn_fact_input'))
sys.path.append(os.path.join(dirname, 'nn_spelling_input'))
from combined_classifier import CombinedClassifier
from training_input_tagger import TrainingInputTagger
from core_nn import CoreNN
from nn_fact_input import NNFactInput
from nn_spelling_input import NNSpellingInput

dirname = os.path.dirname(os.path.realpath(__file__))
factInputModelPath = os.path.join(dirname, "trained_models/nn_fact_input.model")
factInput = NNFactInput()
factInput.importModelFromFile(factInputModelPath)
spellingInput = NNSpellingInput()
def coreNNFeatureTagger(text):
    resultDict = {}
    resultDict[factInput.getName()] = factInput.process(text)
    resultDict[spellingInput.getName()] = 0 #spellingInput.process(text)
    return resultDict   
    
tagger = TrainingInputTagger(coreNNFeatureTagger)
print("tagging data")
data = tagger.tagDataFromFile("./trainingSet.json")
print("data tagged")
coreNN = CoreNN()
#coreNN.importModelFromFile(factInputModelPath)
coreNN.addInput(factInput)
coreNN.addInput(spellingInput)
print("training")
coreNN.trainModel(data)
print("done")
coreNN.exportModelToFile("./core_nn.model")

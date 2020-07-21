import sys
import os 
import combined_classifier
from combined_classifier import CombinedClassifier

path = os.path.dirname(os.path.realpath(__file__))

trainingSetPath = path + '/trainingSet.json'
modelFilePath = path + '/trainedModels.model'

classifier = CombinedClassifier()
#classifier.trainModelFromFile(trainingSetPath)
#classifier.exportModelToFile(modelFilePath)
classifier.importModelFromFile(modelFilePath)

for line in sys.stdin:
    print(classifier.classify(line))

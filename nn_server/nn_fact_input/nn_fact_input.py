import sys
import combined_classifier
from combined_classifier import CombinedClassifier

trainingSetPath = './trainingSet.json'
modelFilePath = './trainedModels.model'

classifier = CombinedClassifier()
#classifier.trainModelFromFile(trainingSetPath)
#classifier.exportModelToFile(modelFilePath)
classifier.importModelFromFile(modelFilePath)

for line in sys.stdin:
    print(classifier.classify(line))

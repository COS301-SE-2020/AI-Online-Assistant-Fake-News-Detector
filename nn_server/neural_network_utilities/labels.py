import numpy as np

class RealOrFakeLabels:
    @staticmethod
    def outputToLabel(output):
        maxIndex = np.argmax(output)
        if maxIndex == 0:
            return 'real'
        else:
            return 'fake'

    @staticmethod
    def outputToValue(output):
        return output[np.argmax(output)]

    @staticmethod
    def labelToOutput(label):
        if label == 'real':
            return [1, 0]
        else:  # 'fake'
            return [0, 1]

    @staticmethod
    def getOutputUnits():
        return 2

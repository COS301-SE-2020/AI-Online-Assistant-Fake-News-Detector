import numpy as np
import math
from labels import RealOrFakeLabels


def padOutputs(outputs):
    pad = 0.5 # neither real or fake
    results = []
    length = 0
    for i in range(len(outputs)):
        l = len(outputs[i])
        if length < l:
            length = l
    for i in range(len(outputs)):
        padded = outputs[i]
        if len(outputs[i]) < length:
            padding = [[pad, pad]] * (length - len(outputs[i]))
            padded = np.concatenate((outputs[i], padding))
        results.append(padded)
    return np.array(results)


def weightedAggregateOutputs(outputs, weights): 
    assert len(outputs) == len(weights)
    arr = np.array(outputs)
    weighted = []
    for i in range(len(arr)):
        weighted.append(np.array(arr[i] * weights[i]))
    return np.sum(weighted, axis=0)        


def overallResults(outputs):
    results = {'prediction': 'real', 'confidence': 0.0}
    length = len(outputs)
    if length > 0:        
        features = len(outputs[0])
        outputSum = [0.0] * features
        for i in range(length):
            for j in range(features):
                outputSum[j] += outputs[i][j]
        label = RealOrFakeLabels.outputToLabel(outputSum)
        confidence = RealOrFakeLabels.outputToValue(outputSum) / length
        results['prediction'] = label
        results['confidence'] = confidence
    return results       
                
def breakdownResults(outputs, text):
    results = []
    text = text.split(' ')
    if len(outputs) > 0:
        length = len(outputs)
        subtextStep = max(1, math.floor(len(text) / length))
        for i in range(length):
            label = RealOrFakeLabels.outputToLabel(outputs[i])
            confidence = RealOrFakeLabels.outputToValue(outputs[i])
            subtext = text[(i * subtextStep):((i + 1) * subtextStep)]
            results.append({'text': ' '.join(subtext), 'prediction': label, 'confidence': confidence})
    return results    

def postprocess(outputs, text):
    weighted = weightedAggregateOutputs(padOutputs(b), [0.5, 0.5])
    overall = overallResults(weighted)
    breakdown = breakdownResults(weighted, text)
    return {'result': overall, 'breakdown': breakdown}

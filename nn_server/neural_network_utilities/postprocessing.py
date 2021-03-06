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
    weighted = np.sum(np.array(outputs), axis=0)
    for row in weighted:
        for i in range(len(row)):
            row[i] = row[i] * weights[i]
    return weighted

def aggregateOutputs(outputs):
    return np.sum(outputs, axis=0)

def overallResults(outputs):
    results = {'prediction': 'real', 'confidence': 0.0}
    length = len(outputs)
    if length > 0:
        outputSum = np.sum(outputs, axis=0)
        label = RealOrFakeLabels.outputToLabel(outputSum)
        confidence = RealOrFakeLabels.outputToValue(outputSum) / length
        results['prediction'] = label
        results['confidence'] = str(confidence)
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
            results.append({'text': ' '.join(subtext), 'prediction': label, 'confidence': str(confidence)})
    return results    

def postprocess(outputs, text):
    aggregate = aggregateOutputs(padOutputs(outputs))
    overall = overallResults(aggregate)
    breakdown = breakdownResults(aggregate, text)
    return {'overall': overall, 'breakdown': breakdown}

def mergeOutputs(outputList):
    mergedResults = [[] for _ in range(len(outputList[0]))]
    for i in range(0, len(outputList)):
        for j in range(0, len(outputList[i])):
            mergedResults[j].extend([val for val in outputList[i][j]])
    mergedResults = np.array(mergedResults)
    return mergedResults
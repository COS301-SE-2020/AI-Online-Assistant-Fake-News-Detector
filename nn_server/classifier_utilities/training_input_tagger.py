import json
import multiprocessing
from multiprocessing import Process, Manager

class TrainingInputTagger:
    def __init(self, featureTagger):
        self.__featureTagger = featureTagger

    def __loadDataFromFile(self, filePath):
        jsonFile = open(filePath, 'r')
        jsonString = jsonFile.read()
        jsonFile.close()
        dataList = list(json.loads(jsonString.lower()))
        random.shuffle(dataList)
        return dataList
    
    def __sampleFeatureTagger(self, sampleList, processGlobalResultsList, processGlobalResultsLock):
        processLocalResultsList = []
        for sample in sampleList:
            processLocalResultsList.append((dict(self.__featureTagger(sample['text'])), sample['label']))
        processGlobalResultsLock.acquire()
        processGlobalResultsList.extend(processLocalResultsList)
        processGlobalResultsLock.release()

    def __parallelFeatureTagger(self, trainingSetList):
        manager = Manager()
        processorCount = multiprocessing.cpu_count()
        segmentSize = math.floor(len(trainingSetList) / processorCount)
        processGlobalResultsList =  manager.list()
        processGlobalResultsLock = manager.Lock()
        processList = []
        for p in range (processorCount):
            startSegment = p * segmentSize
            if processorCount == p + 1:
                endSegment = len(trainingSetList)
            else:
                endSegment = (p + 1) * segmentSize
            newProcess = Process(target=self.__sampleFeatureTagger, args=(trainingSetList[startSegment:endSegment], processGlobalResultsList, processGlobalResultsLock))
            newProcess.start()
            processList.append(newProcess)
        for process in processList:
            process.join()
        return processGlobalResultsList
    
    def tagDataFromFile(self, filePath):
        return self.__parallelFeatureTagger(self.__loadDataFromFile(filePath))

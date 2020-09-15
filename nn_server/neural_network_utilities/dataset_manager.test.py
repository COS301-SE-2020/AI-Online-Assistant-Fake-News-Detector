import unittest
import os
import json
from pathlib import Path
import shutil
import preprocessing as pp
import dataset_manager as dm

class TestDatasetManager(unittest.TestCase):
    def loadJSONFile(self, filePath):
        jsonFile = open(filePath, 'r', encoding="utf8")
        jsonString = jsonFile.read()
        jsonFile.close()
        jsonObject = json.loads(jsonString)
        return jsonObject

    def test___init__(self):
        print("Unittest __init__: Test correct directory exists.")
        testDir = "test___init__Dir"
        manger = dm.DatasetManager(datasetPath=testDir)
        self.assertIs(os.path.exists(testDir), True)
        dirPath = Path(testDir)
        if dirPath.exists() and dirPath.is_dir():
            shutil.rmtree(dirPath)

    def test_addRawData(self):
        print("Unittest addRawData: Test correct manifest created and correct files added.")
        testDir = "test_addRawDataDir"
        manger = dm.DatasetManager(datasetPath=testDir)
        self.assertIs(os.path.exists(testDir), True)
        testSize = 13700
        data = []
        for i in range(0, testSize):
            data.append(str(i))
        manger.addRawData(data)
        datasetDir = os.path.exists(os.path.join(testDir))
        manifestDir = os.path.join(testDir, 'manifest.json')
        self.assertIs(os.path.exists(datasetDir), True, msg="addRawData(fileList): dataset directory not created.")
        self.assertIs(os.path.exists(manifestDir), True, msg="addRawData(fileList): manifest.json not created in dataset directory.")
        manifest = self.loadJSONFile(os.path.join(testDir, 'manifest.json'))
        fileCount = manifest['rawFileCounter']
        self.assertIsInstance(manifest, dict, msg="addRawData(fileList): manifest.json should be of type dict.")
        for file in manifest['rawFiles']:
            self.assertIs(os.path.exists(os.path.join(testDir, file)), True, msg="addRawData(fileList): " + file + " in manifest, but can't be found in dataset directory.")
            fileCount -= 1
        self.assertEqual(fileCount, 0, msg="addRawData(fileList): rawFileCounter in manifest does not correspond with actual count of raw files in dataset directory.")
        self.assertEqual(manifest['rawDatasetSize'], testSize, msg="addRawData(fileList): rawDatasetSize in manifest does not correspond with actual size of raw dataset in dataset directory.")
        dirPath = Path(testDir)
        if dirPath.exists() and dirPath.is_dir():
            shutil.rmtree(dirPath)

    def test_getRawDataGenerator(self):
        print("Unittest getRawDataGenerator: Test generator returns only all valid data from created files.")
        testDir = "test_getRawDataGeneratorDir"
        manger = dm.DatasetManager(datasetPath=testDir)
        self.assertIs(os.path.exists(testDir), True)
        testSize = 13700
        data = []
        for i in range(0, testSize):
            data.append(str(i))
        manger.addRawData(data)
        generator = manger.getRawDataGenerator()
        for batch in generator:
            for value in batch:
                self.assertIn(value, data, msg="getRawDataGenerator() returned value not in original data added to dataset.")
                data.remove(value)
        self.assertEqual(0, len(data), msg="getRawDataGenerator() did not return all data in the added files.")
        dirpath = Path(testDir)
        if dirpath.exists() and dirpath.is_dir():
            shutil.rmtree(dirpath)

    def test_addPreparedData(self):
        print("Unittest addPreparedData: Test correct manifest created and correct files added.")
        testDir = "test_addPreparedDataDir"
        manger = dm.DatasetManager(datasetPath=testDir)
        self.assertIs(os.path.exists(testDir), True)
        testSize = 13700
        data = []
        for i in range(0, testSize):
            data.append({'id': i, 'data':[[i]], 'label': [0, i, 0]})
        manger.addPreparedData(data)
        datasetDir = os.path.exists(os.path.join(testDir))
        manifestDir = os.path.join(testDir, 'manifest.json')
        self.assertIs(os.path.exists(datasetDir), True, msg="addPreparedData(fileList): dataset directory not created.")
        self.assertIs(os.path.exists(manifestDir), True, msg="addPreparedData(fileList): manifest.json not created in dataset directory.")
        manifest = self.loadJSONFile(os.path.join(testDir, 'manifest.json'))
        fileCount = manifest['preparedFileCounter']
        self.assertIsInstance(manifest, dict, msg="addPreparedData(fileList): manifest.json should be of type dict.")
        for file in manifest['preparedFiles']:
            self.assertIs(os.path.exists(os.path.join(testDir, file)), True, msg="addPreparedData(fileList): " + file + " in manifest, but can't be found in dataset directory.")
            fileCount -= 1
        self.assertEqual(fileCount, 0, msg="addPreparedData(fileList): preparedFileCounter in manifest does not correspond with actual count of prepared files in dataset directory.")
        self.assertEqual(manifest['preparedDatasetSize'], testSize, msg="addPreparedData(fileList): datasetSize in manifest.json is incorrect.")
        dirPath = Path(testDir)
        if dirPath.exists() and dirPath.is_dir():
            shutil.rmtree(dirPath)

    class MockFilterAndAdapter(pp.Filter):
        def __init__(self):
            super().__init__()

        def __call__(self, text):
            return text

        def getFeatureCount(self):
            return 1

    def test_prepareRawData(self):
        print("Unittest prepareRawData: Test raw data correctly prepared and manifest correctly updated.")
        testDir = "test_prepareRawData"
        manger = dm.DatasetManager(datasetPath=testDir)
        self.assertIs(os.path.exists(testDir), True)
        testSize = 13700
        data = []
        for i in range(0, testSize):
            data.append({'id': i, 'data':[[i]], 'label': [0, i, 0]})
        manger.addRawData(data)
        manger.prepareRawData(pp.SequentialPreprocessor(self.MockFilterAndAdapter()))
        datasetDir = os.path.exists(os.path.join(testDir))
        manifestDir = os.path.join(testDir, 'manifest.json')
        self.assertIs(os.path.exists(datasetDir), True, msg="addPreparedData(fileList): dataset directory not created.")
        self.assertIs(os.path.exists(manifestDir), True, msg="addPreparedData(fileList): manifest.json not created in dataset directory.")
        manifest = self.loadJSONFile(os.path.join(testDir, 'manifest.json'))
        fileCount = manifest['preparedFileCounter']
        self.assertIsInstance(manifest, dict, msg="addPreparedData(fileList): manifest.json should be of type dict.")
        for file in manifest['preparedFiles']:
            self.assertIs(os.path.exists(os.path.join(testDir, file)), True, msg="addPreparedData(fileList): " + file + " in manifest, but can't be found in dataset directory.")
            fileCount -= 1
        self.assertEqual(fileCount, 0, msg="addPreparedData(fileList): preparedFileCounter in manifest does not correspond with actual count of prepared files in dataset directory.")
        self.assertEqual(manifest['preparedDatasetSize'], testSize, msg="addPreparedData(fileList): datasetSize in manifest.json is incorrect.")
        dirPath = Path(testDir)
        if dirPath.exists() and dirPath.is_dir():
            shutil.rmtree(dirPath)

    def test_getPreparedDataGenerator(self):
        print("Unittest getRawDataGenerator: Test generator returns only all valid data from created files.")
        testDir = "test_getRawDataGeneratorDir"
        manger = dm.DatasetManager(datasetPath=testDir)
        self.assertIs(os.path.exists(testDir), True)
        testSize = 13700
        data = []
        for i in range(0, testSize):
            data.append({'id': i, 'data': [[i]], 'label': [0, i, 0]})
        manger.addPreparedData(data)
        data = []
        for i in range(0, testSize):
            data.append({'id': i, 'data': [i], 'label': [0, i, 0]})
        generator = manger.getPreparedDataGenerator()
        for batch in generator:
            for value in batch:
                self.assertIn(value, data, msg="getRawDataGenerator() returned value not in original data added to dataset.")
                data.remove(value)
        self.assertEqual(0, len(data), msg="getRawDataGenerator() did not return all data in the added files.")
        dirpath = Path(testDir)
        if dirpath.exists() and dirpath.is_dir():
            shutil.rmtree(dirpath)

if __name__ == '__main__':
    unittest.main()
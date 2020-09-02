import unittest
import math
import preprocessing as pp

class TestNNServer(unittest.TestCase):
    def genericFilter(self, filter):
        self.assertGreater(filter.getFeatureCount(), 0, msg="Filter must have > 0 features.")
        for inputLength in range(0, 2000, 137):
            data = str(inputLength * "test ")
            result = filter(data)
            self.assertIsNotNone(result, msg="Filter() must return a result.")
            self.assertIsInstance(result, list, msg="Filter() result must be type: list")
            expectedLen = inputLength * filter.getFeatureCount()
            self.assertEqual(len(result), expectedLen, msg="Filter() result must be length: inputLength * filter.getFeatureCount()")

    def genericVectorizationFilter(self, filter):
        self.assertGreater(filter.getFeatureCount(), 0)
        for inputLength in range(0, 2000, 137):
            data = str(inputLength * "test ")
            result = filter(data)
            self.assertIsNotNone(result, msg="Filter() must return a result.")
            self.assertIsInstance(result, list, msg="Filter() result must be type: list")
            expectedVectors = math.ceil(inputLength * filter.getFeatureCount() / filter.getSampleLength())
            self.assertEqual(expectedVectors, len(result), msg="Filter() result must be length: math.ceil(inputLength * filter.getFeatureCount() / filter.getSampleLength())")
            for item in result:
                self.assertIsInstance(item, list)
                self.assertEqual(len(item), filter.getSampleLength(), msg="Each vector in result must have length: filter.getSampleLength()")

    def testSimpleFilter(self):
        '''
        Unittest SimpleFilter: Test correct output shapes for mocked input.
        '''
        print("Unittest SimpleFilter: Test correct output shapes for mocked input.")
        self.genericFilter(pp.SimpleFilter())

    def testLexicalFilter(self):
        '''
        Unittest LexicalFilter: Test correct output shapes for mocked input.
        '''
        print("Unittest LexicalFilter: Test correct output shapes for mocked input.")
        self.genericFilter(pp.LexicalFilter())

    def testGrammaticalVectorizationFilter(self):
        '''
        Unittest GrammaticalFilter: Test correct output shapes for mocked input.
        '''
        print("Unittest GrammaticalFilter: Test correct output shapes for mocked input.")
        self.genericVectorizationFilter(pp.GrammaticalVectorizationFilter())

    def testLexicalVectorizationFilter(self):
        '''
        Unittest LexicalVectorizationFilter: Test correct output shapes for mocked input.
        '''
        print("Unittest LexicalVectorizationFilter: Test correct output shapes for mocked input.")
        self.genericVectorizationFilter(pp.LexicalVectorizationFilter())

    class MockFilter(pp.Filter):
        def __init__(self):
            super().__init__()

        def __call__(self, text):
            return [text]

        def getFeatureCount(self):
            return 1

    def testRawFakeNewsDataFilterAdapter(self):
        '''
        Unittest LexicalFilter: Test correct output shapes for mocked input.
        '''
        print("Unittest RawFakeNewsDataFilterAdapter: Test correct output shapes for mocked input.")
        testFake = {'id': 100, 'text': "test text", 'label': "fake"}
        testReal = {'id': 100, 'text': "test text", 'label': "real"}
        testOther = {'id': 100, 'text': "test text", 'label': "other"}
        adapter = pp.RawFakeNewsDataFilterAdapter(self.MockFilter())
        result = adapter(testFake)
        self.assertIsInstance(result, dict)
        self.assertEqual(result['id'], testFake['id'])
        self.assertEqual(result['label'], [0, 1])
        self.assertEqual(result['data'], [testFake['text']])
        result = adapter(testReal)
        self.assertIsInstance(result, dict)
        self.assertEqual(result['id'], testReal['id'])
        self.assertEqual(result['label'], [1, 0])
        self.assertEqual(result['data'], [testReal['text']])
        result = adapter(testOther)
        self.assertIsInstance(result, dict)
        self.assertEqual(result['id'], testOther['id'])
        self.assertEqual(result['label'], [0, 0])
        self.assertEqual(result['data'], [testOther['text']])

    def testParallelPreprocessor(self):
        '''
        Unittest ParallelPreprocessor: Test correct output shapes for mocked input.
        '''
        print("Unittest ParallelPreprocessor: Test correct output shapes for mocked input.")
        testSize = 137
        data = []
        for i in range(0, testSize):
            data.append(i)
        preprocessor = pp.ParallelPreprocessor(filter=self.MockFilter())
        result = preprocessor(data)
        self.assertEqual(testSize, len(result))
        for d in data:
            self.assertIn([d], result)

    def testSequentialPreprocessor(self):
        '''
        Unittest SequentialPreprocessor: Test correct output shapes for mocked input.
        '''
        print("Unittest SequentialPreprocessor: Test correct output shapes for mocked input.")
        testSize = 137
        data = []
        for i in range(0, testSize):
            data.append(i)
        preprocessor = pp.SequentialPreprocessor(filter=self.MockFilter())
        result = preprocessor(data)
        self.assertEqual(testSize, len(result))
        for d in data:
            self.assertIn([d], result)

    def testVectorizationFilter(self):
        '''
        Unittest VectorizationPreprocessor: Test correct output shapes for mocked input.
        '''
        print("Unittest VectorizationPreprocessor: Test correct output shapes for mocked input.")
        inputLength = 137
        featureCount = 1
        sampleLength = 11
        data = []
        for i in range(0, inputLength):
            data.append(str(i))
        filter = pp.VectorizationFilter(featureCount=featureCount, sampleLength=sampleLength)
        result = filter(data)
        expectedVectors = math.ceil(inputLength * 1 / sampleLength)
        self.assertEqual(len(result), expectedVectors)
        for r in result:
            self.assertEqual(len(r), sampleLength)
        
if __name__ == '__main__':
    unittest.main()

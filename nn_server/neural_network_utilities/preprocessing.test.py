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
        Unittest SimpleFilter: Test correct output shape for mocked input.
        '''
        print("Unittest SimpleFilter: Test correct output shape for mocked input.")
        self.genericFilter(pp.SimpleFilter())

    def testLexicalFilter(self):
        '''
        Unittest LexicalFilter: Test correct output shape for mocked input.
        '''
        print("Unittest LexicalFilter: Test correct output shape for mocked input.")
        self.genericFilter(pp.LexicalFilter())

    def testGrammaticalVectorizationFilter(self):
        '''
        Unittest GrammaticalFilter: Test correct output shape for mocked input.
        '''
        print("Unittest GrammaticalFilter: Test correct output shape for mocked input.")
        self.genericVectorizationFilter(pp.GrammaticalVectorizationFilter())

    def testLexicalVectorizationFilter(self):
        '''
        Unittest LexicalFilter: Test correct output shape for mocked input.
        '''
        print("Unittest LexicalFilter: Test correct output shape for mocked input.")
        self.genericVectorizationFilter(pp.LexicalVectorizationFilter())

if __name__ == '__main__':
    unittest.main()

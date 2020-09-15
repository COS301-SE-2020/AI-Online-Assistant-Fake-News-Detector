import unittest
import postprocessing as pp
import numpy as np

class TestPostprocessing(unittest.TestCase):
    def test_padInputs(self):
        print("Unittest padInputs: Outputs are always correctly padded.")
        testData = []
        max = 0
        for arr in testData:
            if max < len(arr):
                max = len(arr)
        output = pp.padOutputs(testData)
        for arr in output:
            self.assertEqual(max, len(arr),
                             msg="Unittest padOutputs: All arrays must be padded to the length of the max array.")

        testData = [[], []]
        max = 0
        for arr in testData:
            if max < len(arr):
                max = len(arr)
        output = pp.padOutputs(testData)
        for arr in output:
            self.assertEqual(max, len(arr),
                             msg="Unittest padOutputs: All arrays must be padded to the length of the max array.")

        testData = [[[1, 1], [1, 1]],
                    [[2, 2], [2, 2]]]
        max = 0
        for arr in testData:
            if max < len(arr):
                max = len(arr)
        output = pp.padOutputs(testData)
        for arr in output:
            self.assertEqual(max, len(arr),
                             msg="Unittest padOutputs: All arrays must be padded to the length of the max array.")

        testData = [[[1, 1], [1, 1], [1, 1]],
                    [[2, 2], [2, 2]]]
        max = 0
        for arr in testData:
            if max < len(arr):
                max = len(arr)
        output = pp.padOutputs(testData)
        for arr in output:
            self.assertEqual(max, len(arr),
                             msg="Unittest padOutputs: All arrays must be padded to the length of the max array.")

        testData = [[[1, 1], [1, 1]],
                    [[2, 2], [2, 2], [2, 2]]]
        max = 0
        for arr in testData:
            if max < len(arr):
                max = len(arr)
        output = pp.padOutputs(testData)
        for arr in output:
            self.assertEqual(max, len(arr),
                             msg="Unittest padOutputs: All arrays must be padded to the length of the max array.")

    def test_weightedAggregateOutputs(self):
        print("Unittest weightedAggregateOutputs: Outputs are weighted and aggregated correctly.")
        weights = [0.2, 0.8]
        testData = [[[10, 100],
                     [1000, 100000]],
                    [[0.1, 0.01],
                     [0.001, 0.00001]]]
        output = pp.weightedAggregateOutputs(testData, weights)
        self.assertEqual(len(output), len(testData[0]),
                         msg="Unittest weightedAggregateOutputs: Final array must have same rows length as a single array in the input.")
        for arr in output:
            self.assertEqual(len(arr), len(testData[0][0]),
                             msg="Unittest weightedAggregateOutputs: Final array must have same column length as a single array in the input.")

        self.assertEqual(2.02, output[0][0], msg="Unittest weightedAggregateOutputs: Incorrect weighted sum.")
        self.assertEqual(200.0002, output[1][0], msg="Unittest weightedAggregateOutputs: Incorrect weighted sum.")
        self.assertEqual(80.00800000000001, output[0][1], msg="Unittest weightedAggregateOutputs: Incorrect weighted sum.")
        self.assertEqual(80000.000008, output[1][1], msg="Unittest weightedAggregateOutputs: Incorrect weighted sum.")

    def test_aggregateOutputs(self):
        print("Unittest aggregateOutputs: Outputs are aggregated correctly.")
        testData = [[[10, 100],
                     [1000, 100000]],
                    [[0.1, 0.01],
                     [0.001, 0.00001]]]
        output = pp.aggregateOutputs(testData)
        self.assertEqual(10.1, output[0][0], msg="Unittest weightedAggregateOutputs: Incorrect weighted sum.")
        self.assertEqual(1000.001, output[1][0], msg="Unittest weightedAggregateOutputs: Incorrect weighted sum.")
        self.assertEqual(100.01, output[0][1], msg="Unittest weightedAggregateOutputs: Incorrect weighted sum.")
        self.assertEqual(100000.00001, output[1][1], msg="Unittest weightedAggregateOutputs: Incorrect weighted sum.")

    def test_breakdownResults(self):
        print("Unittest breakdownResults: Output labels and text is partitioned and labeled correctly.")
        testData = [[10, 100],
                    [1000, 100000]]
        output = pp.breakdownResults(testData, "Here is the test text.")
        count = 0
        for part in output:
            self.assertIn('prediction', part,
                          msg="Unittest postprocess: part dict must contain 'prediction'")
            self.assertIsInstance(part['prediction'], str,
                                  msg="Unittest postprocess: part['prediction'] must be str.")
            self.assertIn('confidence', part,
                          msg="Unittest postprocess: part dict must contain 'confidence'")
            self.assertIsInstance(part['confidence'], str,
                                  msg="Unittest postprocess: part['confidence'] must be str.")
            count += 1
        self.assertEqual(count, len(np.sum(testData, axis=0)), msg="Unittest postprocess: output['breakdown'] must have an output for each testOutput array.")


    def test_postprocess(self):
        print("Unittest postprocess: Output labels and text is partitioned and labeled correctly.")
        testData = [[[10, 100],
                     [1000, 100000]],
                    [[0.1, 0.01],
                     [0.001, 0.00001]]]
        output = pp.postprocess(testData, "Here is the test text.")
        self.assertIsInstance(output, dict, msg="Unittest postprocess: Output object must be dict.")
        self.assertIn('overall', output, msg="Unittest postprocess: Dict must contain 'overall'")
        self.assertIsInstance(output['overall'], dict,
                              msg="Unittest postprocess: output['overall'] object must be dict.")
        self.assertIn('prediction', output['overall'],
                      msg="Unittest postprocess: output['overall'] dict must contain 'prediction'")
        self.assertIsInstance(output['overall']['prediction'], str,
                              msg="Unittest postprocess: output['overall']['prediction'] must be str.")
        self.assertIn('confidence', output['overall'],
                      msg="Unittest postprocess: output['overall'] dict must contain 'confidence'")
        self.assertIsInstance(output['overall']['confidence'], str,
                              msg="Unittest postprocess: output['overall']['confidence'] must be str.")
        self.assertIn('breakdown', output, msg="Unittest postprocess: Dict must contain 'breakdown'")
        count = 0
        for part in output['breakdown']:
            self.assertIn('prediction', part,
                          msg="Unittest postprocess: part dict must contain 'prediction'")
            self.assertIsInstance(part['prediction'], str,
                                  msg="Unittest postprocess: part['prediction'] must be str.")
            self.assertIn('confidence', part,
                          msg="Unittest postprocess: part dict must contain 'confidence'")
            self.assertIsInstance(part['confidence'], str,
                                  msg="Unittest postprocess: part['confidence'] must be str.")
            count += 1
        self.assertEqual(count, len(np.sum(testData, axis=0)), msg="Unittest postprocess: output['breakdown'] must have an output for each testOutput array.")

    def test_mergeOutputs(self):
        print("Unittest mergeOutputs: Test sequences are correctly merged.")
        testData = [[[1, 2],
                     [5, 6]],
                    [[3, 4],
                     [7, 8]]]
        output = pp.mergeOutputs(testData)
        for i in range(4):
            self.assertEqual(i, output[0][i] - 1, msg="Unittest mergeOutputs: Incorrect sequence when merging.")
        for i in range(4):
            self.assertEqual(i + 4, output[1][i] - 1, msg="Unittest mergeOutputs: Incorrect sequence when merging.")
        count = 1
        for row in output:
            for i in row:
                self.assertEqual(count, i, msg="Unittest mergeOutputs: Incorrect sequence when merging.")
                count += 1
        self.assertEqual(count, 9, msg="Unittest mergeOutputs: Sequence has either to little or too many values.")

if __name__ == '__main__':
    unittest.main()
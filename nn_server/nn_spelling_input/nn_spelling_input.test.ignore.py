import unittest

from nn_spelling_input import NNSpellingInput

class TestNNSpellingInput(unittest.TestCase):
    def setUp(self):        
        self.spellingInput = NNSpellingInput()
        assert self.spellingInput != None

    def testProcess(self):
        print("Testing if text processing works")
        result = self.spellingInput.process("Some test text. Some more text.")
        assert isinstance(result, float)        
        print("\tPass 1 - Recieves sentence array and returns float result")
        assert result == 0.0
        print("\tPass 2 - No spelling errors")
        assert isinstance(self.spellingInput.process("Some test text. Some more text."), float)
        result = self.spellingInput.process("Theer are three speling errors in this sentece. Therse are some errrs in this one too.")
        assert isinstance(result, float)        
        print("\tPass 3 - Recieves sentence array and returns float result")
        assert result > 0.2 and result < 0.3
        print("\tPass 3 - Detects correct proportion of errors")
        
if __name__ == '__main__':
    print("===== Testing NNSpellingInput =====")
    unittest.main()

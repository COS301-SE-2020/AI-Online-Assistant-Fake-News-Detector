import sys, os
dirname = os.path.dirname(__file__)
sys.path.append(os.path.join(dirname, '..', 'nn_input'))
from nn_input import NNInput
import nltk
from nltk.tokenize import word_tokenize
from spellchecker import SpellChecker
from autocorrect import Speller

class NNSpellingInput(NNInput):
    def __init__(self):
        super().__init__()
        self.setName("nn_spelling_input")
        self.__spellcheck = Speller('en')
        self.__autocorrect = SpellChecker()

    def process(self, text):
        totalErrors = 0
        totalWords = 0
        tokens = word_tokenize(text.lower())
        for t in tokens:
            totalWords += 1                
            if t != self.__spellcheck(t) or t != self.__autocorrect.correction(t):
                totalErrors += 1
        if totalWords != 0:
            return totalErrors / totalWords
        else:
            return 0.0

const nn_input = require("../nn_input/nn_input.js");
const spellChecker = require("simple-spellchecker");

const wordRegex = /\b[^\s]+\b/g;

// global in this file to prevent each class creating a new dictionary
const dictionaryUS = spellChecker.getDictionarySync("en-US"); // American
const dictionaryGB = spellChecker.getDictionarySync("en-GB"); // British

/**
 * @description a class which determines the fraction of english spelling errors.
 * @author Alistair Payn
 */
class nn_spelling_input extends nn_input {
    constructor() {
	super()
    }

  /**
   * @description determines the fraction of english spelling errors.
   * @author Alistair Payn
   */
  process(sentences) {
    let spellingErrorCount = 0;
    let wordCount = 0;
    sentences.forEach((sentence) => {
      let words = sentence.match(wordRegex);
      words.forEach((word) => {
        ++wordCount;
        spellingErrorCount +=
          !dictionaryUS.spellCheck(word) && !dictionaryGB.spellCheck(word);
      });
    });
    let result = 0.0;
    if (wordCount > 0) {
      result = spellingErrorCount / wordCount;
    }
    return result;
  }
}

module.exports = nn_spelling_input;

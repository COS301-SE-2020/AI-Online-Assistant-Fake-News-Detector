const nn_input = require("../nn_input/nn_input.js");
const wordy = require("too-wordy");

const wordRegex = /\b[^\s]+\b/g;

/**
 * @description a class which determines the fraction of verbose word use in a body of text.
 * @author Alistair Payn
 */
class nn_verbose_input extends nn_input {
  constructor() {
    super();
  }

  /**
   * @description determines the fraction of verbose words in a body of text.
   * @author Alistair Payn
   */

  process(sentences) {
    let verboseCount = 0;
    let wordCount = 0;
    sentences.forEach((sentence) => {
      wordCount += sentence.match(wordRegex).length;
      verboseCount += wordy(sentence).length;
    });
    let result = 0.0;
    if (wordCount > 0) {
      result = verboseCount / wordCount;
    }
    return result;
  }
}

module.exports = nn_verbose_input;

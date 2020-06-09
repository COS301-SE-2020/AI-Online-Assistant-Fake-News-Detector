const nn_spelling_input = require('../nn_verbose_input.js');
var assert = require('assert');

var normalSingleSentence = ["This sentence is not verbose."];

var normalMultipleSentence = [
    "There is no overly verbose language in this sentence.",
    "There is also not verbose language in this sentence."
];

var verboseSingleSentence = ["The abundance of verbosity astounds me."];

var verboseMultipleSentence = [
    "The abundance of verbosity astounds me.",
    "We are exuberantly awaiting the outcome of this."
];

var test = new nn_spelling_input();

describe('nn_verbose_input', function() {
    describe('#process', function() {
	it('Single normal sentence should detect 0.0 proportion of verbose word use.', function() {
	    assert.equal(test.process(normalSingleSentence), 0.0);
	});
    });
    describe('#process', function() {
	it('Multiple normal sentences, should detect 0.0 proportion of verbose word use.', function() {
	    assert.equal(test.process(normalMultipleSentence), 0.0);
	});
    });
    describe('#process', function() {
	it('Single verbose sentence, should detect 0.07142857 proportion of verbose word use.', function() {
	    assert.equal(test.process(verboseSingleSentence), 0.16666667);
	});
    });
    describe('#process', function() {
	it('Multiple verbose sentences, should detect 0.07142857 proportion of verbose word use.', function() {
	    assert.equal(test.process(verboseMultipleSentence), 0.07142857);
	});
    });
});

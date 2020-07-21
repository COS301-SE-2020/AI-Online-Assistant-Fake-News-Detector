const precision = 8;

const nn_spelling_input = require('./nn_spelling_input.js');
var assert = require('assert');

var correctSingleSentence = ["There are no spelling errors in this sentence."];

var correctMultipleSentence = [
    "There are no spelling errors in this sentence.",
    "There are also no spelling errors in this sentence."
];

var incorrectSingleSentence = ["Theer are three speling errors in this sentece."];

var incorrectMultipleSentence = [
    "Theer are three speling errors in this sentece.",
    "Therse are some errrs in this one too."
];

var test = new nn_spelling_input();

describe('nn_spelling_input', function() {
    describe('#process', function() {
	it('Single correct sentence should detect 0.0 proportion of spelling errors.', function() {
	    assert.equal(test.process(correctSingleSentence).toFixed(precision), 0.0);
	});
    });
    describe('#process', function() {
	it('Multiple correct sentences, should detect 0.0 proportion of spelling errors.', function() {
	    assert.equal(test.process(correctMultipleSentence).toFixed(precision), 0.0);
	});
    });
    describe('#process', function() {
	it('Single incorrect sentence, should detect 0.375 proportion of spelling errors.', function() {
	    assert.equal(test.process(incorrectSingleSentence).toFixed(precision), 0.375);
	});
    });
    describe('#process', function() {
	it('Multiple incorrect sentences, should detect 0.3125 proportion of spelling errors.', function() {
	    assert.equal(test.process(incorrectMultipleSentence).toFixed(precision), 0.3125);
	});
    });
});

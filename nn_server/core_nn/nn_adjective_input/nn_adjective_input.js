const nn_input = require('../nn_input/nn_input.js');
const wordpos = require('wordpos');

const wordRegex = /\b[^\s]+\b/g;

// global in this file to prevent each class creating a new instance
const checker = new wordpos({profile: true});

/**
 * @description a class which determines the fraction of adjectives use in a body of text.
 * @author Alistair Payn
 */
class nn_adjective_input extends nn_input {    
    constructor() {
	super();
    }

    /**
     * @description determines the fraction of adjectives in a body of text.
     * @author Alistair Payn
     */    
    process(sentences) {
	let adjectiveCount = 0;
	let wordCount = 0;
	sentences.forEach((sentence) => {
	    let words = sentence.match(wordRegex);
	    words.forEach((word) => {
		++wordCount;
		let promise = checker.isAdjective(word);
		await promise;
	    });
	});
	return adjectiveCount / wordCount;	
    }
}

var test = new nn_adjective_input();
var sens = ["are the green red bill gates", "red red fast tomatoes"];
console.log(test.process(sens));

module.exports = nn_adjective_input;

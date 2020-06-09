const precision = 8;
const sentenceRegex = /[^\.\!\?]*[\.\!\?]/g;

class core_nn {
    constructor(trainedModel) {
	this.model = trainedModel;
	this.inputs = [];
    }

    importModel(trainedModel) {
	this.model = trainedModel;
    }

    exportModel() {
	return this.model;
    }

    runModel(inputResults) {
	let result = 0.0;
	if (inputResults.length > 0) {
	    let total = 0.0;
	    inputResults.forEach((value)=>{
		total += value;
	    });
	    result = total;
	}
	return (result).toFixed(precision);
    }
    
    processText(text) {
	let sentences = text.match(sentenceRegex); // splits text into array of sentences
	let inputResults = [];
	let result = 0.0;

	// get the result of each input and then get the result from the regression model
	this.inputs.forEach((input) => {
	    inputResults.push(parseFloat(input.process(sentences)));
	    if (inputResults.length === this.inputs.length) {
		result = this.runModel(inputResults);
	    }
	});
	return result;
    }

    addInput(input) {
	this.inputs.push(input);
    }
}

module.exports = core_nn;

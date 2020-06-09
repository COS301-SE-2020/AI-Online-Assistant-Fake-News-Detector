class core_nn {
    constructor(trainedModel) {
	this.model = trainedModel;
	this.inputMethods = [];
    }

    importModel(trainedModel) {
	this.model = trainedModel;
    }

    exportModel() {
	return this.model;
    }

    runModel(inputMethodResults) {
	let total = 0.0;
	inputMethodResults.forEach((value)=>{
	    total += value;
	});
	return total / inputMethodResults.length;
    }
    
    processText(text) {
	let sentences = text.match(/[^\.\!\?]*[\.\!\?]/g); // splits text into array of sentences
	let inputMethodResults = [];
	let result = 0.0;

	// get the result of each inputMethod and then get the result from the regression model
	this.inputMethods.forEach((inputMethod) => {
	    inputMethodResults.push(inputMethod(sentences));
	    if (inputMethodResults.length === this.inputMethods.length) {
		result = this.runModel(inputMethodResults);
	    }
	});
	return result;
    }

    addInputMethod(inputMethod) {
	this.inputMethods.push(inputMethod);
    }
}

module.exports = core_nn;

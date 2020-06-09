class core_nn {
    constructor(trainedModel) {
	this.model = trainedModel;
    }

    importModel(trainedModel) {
	this.model = trainedModel;
    }

    exportModel() {
	return this.model;
    }
    
    processText(text) {
	return 0.5;
    }   
}

module.exports = core_nn;

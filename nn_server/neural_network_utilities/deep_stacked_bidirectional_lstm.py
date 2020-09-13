from preprocessing import Filter
import tensorflow.keras as ks
import tensorflow as tf

class DeepStackedBidirectionalLSTM(Filter):
    def __init__(self, sampleLength, maxWords, outputUnits, modelName="DeepStackedBidirectionalLSTM"):
        """
        @author: AlistairPaynUP
        @:param sampleLength: The length of a single sample.
        @:param maxWords: The maximum number of unique words that can be recognized, increasing this slows down training due to larger embedding layer.
        @:param outputUnits: The number of labels/classes/tags/units/outputs on the output layer.
        """
        super().__init__()
        gpus = tf.config.experimental.list_physical_devices('GPU')
        if gpus:
            try:
                # Currently, memory growth needs to be the same across GPUs
                for gpu in gpus:
                    tf.config.experimental.set_memory_growth(gpu, True)
                logical_gpus = tf.config.experimental.list_logical_devices('GPU')
                print(len(gpus), "Physical GPUs,", len(logical_gpus), "Logical GPUs")
            except RuntimeError as e:
                # Memory growth must be set before GPUs have been initialized
                print(e)
        self.__modelName = modelName
        self.__sampleLength = sampleLength
        self.__maxWords = maxWords
        self.__outputUnits = outputUnits
        self.__model = None

    def __initialize(self):
        """
        @author: AlistairPaynUP
        Initializes a new model.
        """
        self.clear()
        ks.backend.clear_session()
        inputs = ks.Input(shape=(self.__sampleLength,), dtype="int64") # look into shape=(self.__sampleLength, featureCount)
        layers = ks.layers.Embedding(input_dim=self.__maxWords, input_length=self.__sampleLength, output_dim=128, mask_zero=True)(inputs)
        # Stack bidirectional LSTMs
        layers = ks.layers.Bidirectional(ks.layers.LSTM(units=128, dropout=0.2, return_sequences=True))(layers)
        layers = ks.layers.Bidirectional(ks.layers.LSTM(units=128, dropout=0.2, return_sequences=True))(layers)
        layers = ks.layers.Bidirectional(ks.layers.LSTM(units=64, dropout=0.1, return_sequences=True))(layers)
        layers = ks.layers.Bidirectional(ks.layers.LSTM(units=64, dropout=0.1, return_sequences=True))(layers)
        layers = ks.layers.Bidirectional(ks.layers.LSTM(units=32, return_sequences=True))(layers)
        layers = ks.layers.Bidirectional(ks.layers.LSTM(units=32))(layers)
        # Add a classifier
        outputs = ks.layers.Dense(units=self.__outputUnits, activation="softmax")(layers)
        self.__model = ks.Model(inputs=inputs, outputs=outputs, name=self.__modelName)
        self.__model.summary()

    def clear(self):
        if self.__model is not None:
            del self.__model
            self.__model = None
        ks.backend.clear_session()

    def exportModel(self, filePath):
        """
        @author: AlistairPaynUP
        @:param filePath: The full filename path where the model must be exported to.
        """
        if self.__model is not None:
            self.__model.save_weights(filePath)
        else:
            raise Exception("Cannot export empty uninitialized model.")

    def importModel(self, filePath):
        """
        @author: AlistairPaynUP
        @:param filePath: The full filename path where the model must be imported from.
        """
        self.__initialize()
        self.__model.load_weights(filePath)
        self.__model.compile("adam", "binary_crossentropy", metrics=["accuracy"])

    def importCheckpoint(self, fileDir="./"):
        """
        @author: AlistairPaynUP
        @:param filePath: The full directory path where the model checkpoints are saved.
        """
        self.__initialize()
        latest = tf.train.latest_checkpoint(fileDir)
        self.__model.load_weights(latest)

    def trainModel(self, trainGenerator, validationGenerator, trainDatasetSize, validationDatasetSize, epochs, batchSize, saveFilePath, saveCheckpoints = False):
        """
        @author: AlistairPaynUP
        @:param generator: A generator for training data.
        @:param datasetSize: The size of the dataset for one epoch, if set less than actual dataset size not all samples will be used in one epoch.
        """
        self.__initialize()
        self.__model.compile("adam", "binary_crossentropy", metrics=["accuracy"])
        if saveCheckpoints:
            checkpoint = tf.keras.callbacks.ModelCheckpoint(filepath=saveFilePath + ".ckpt", save_weights_only=True, verbose=1)
            self.__model.fit(trainGenerator, validation_data=validationGenerator,
                             steps_per_epoch=trainDatasetSize / batchSize,
                             validation_steps=validationDatasetSize / batchSize,
                             batch_size=batchSize, epochs=epochs, callbacks=[checkpoint])
        else:
            self.__model.fit(trainGenerator, validation_data=validationGenerator,
                             steps_per_epoch=trainDatasetSize / batchSize,
                             validation_steps=validationDatasetSize / batchSize,
                             batch_size=batchSize, epochs=epochs)
        self.exportModel(saveFilePath)

    def process(self, preparedData):
        """
        @author: AlistairPaynUP
        @:param preparedData: Data that has been prepared by a vectorization filter, or filtered and then vectorized. e.g: [[1,2,3],[4,5,6],...]
        @:return: The mean probability of each output unit.
        """
        if self.__model is None:
            raise Exception("Cannot use uninitialized model.")
        return self.__model.predict(preparedData)

    def __call__(self, preparedDataList):
        """
        @author: AlistairPaynUP
        @:param preparedDataList: Data that has been prepared by a preprocessor, or filtered and then vectorized. e.g: {'id': 123, 'data': [123, 456, ...], 'label': [0, 1]}
        @:return: a list of processed results [{'id': 0, 'data': [[0.2, 0.8]], 'label':[0, 1]}, ...]
        This is part of the Filter interface since the BDLSTM is used as an input filter to the logistic regression
        """
        results = []
        dataList = []
        for data in preparedDataList:
            dataList.append(data['data'])
        predictedList = self.__model.predict(dataList)
        resultList = []
        for prediction in predictedList:
            resultList.append([int(prediction[0] * 1000), int(prediction[1] * 1000)])
        for i in range(len(resultList)):
            results.append({'id': preparedDataList[i]['id'], 'data': [list(resultList[i])], 'label': preparedDataList[i]['label']})
        return results

    def getFeatureCount(self):
        return self.__outputUnits

    def getSampleLength(self):
        return self.__sampleLength
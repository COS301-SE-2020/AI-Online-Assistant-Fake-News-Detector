import keras as ks
import tensorflow as tf

class StackedBidirectionalLSTM:
    def __init__(self, filter, vectorizer=None):
        self.__filter = filter
        self.__vectorizer = vectorizer
        if vectorizer is None: # if vectorizer not provided, assume filter is vectorizing filter
            self.__sampleLength = filter.getSampleLength()
            self.__maxWords = filter.getMaxWords()
        else: # if vectorizer provided, use the vectorizer
            self.__sampleLength = vectorizer.getSampleLength()
            self.__maxWords = vectorizer.getMaxWords()
        self.__model = None

    def __initialize(self):
        print(self.__sampleLength)
        print(self.__maxWords)
        inputs = ks.Input(shape=(self.__sampleLength,), dtype="int32")
        layers = ks.layers.Embedding(input_dim=self.__maxWords, input_length=self.__sampleLength, output_dim=128, mask_zero=True)(inputs)
        # Stack bidirectional LSTMs
        layers = ks.layers.Bidirectional(ks.layers.LSTM(units=128, dropout=0.1, return_sequences=True))(layers)
        layers = ks.layers.Bidirectional(ks.layers.LSTM(units=128, dropout=0.1, return_sequences=True))(layers)
        layers = ks.layers.Bidirectional(ks.layers.LSTM(units=64, dropout=0.05, return_sequences=True))(layers)
        layers = ks.layers.Bidirectional(ks.layers.LSTM(units=64))(layers)
        # Add a classifier
        outputs = ks.layers.Dense(units=2, activation="softmax")(layers)
        self.__model = ks.Model(inputs=inputs, outputs=outputs)
        self.__model.summary()

    def exportModel(self, filePath):
        if self.__model is not None:
            self.__model.load_weights(filePath)
        else:
            raise Exception("Cannot export empty uninitialized model.")

    def importModel(self, filePath):
        self.__initialize()
        self.__model.save_weights(filePath)

    def importCheckpoint(self, fileDir="./"):
        self.__initialize()
        latest = tf.train.latest_checkpoint(fileDir)
        self.__model.load_weights(latest)

    def trainModel(self, saveFilePath, trainingDataset, validationDataset):
        self.__initialize()
        checkpoint = tf.keras.callbacks.ModelCheckpoint(filepath="checkpoint.ckpt", save_weights_only=True, verbose=1)
        self.__model.compile("adam", "binary_crossentropy", metrics=["accuracy"])
        self.__model.fit(x=trainingDataset[0], y=trainingDataset[1], validation_data=validationDataset, batch_size=256, epochs=5, callbacks=[checkpoint])
        self.exportModel(saveFilePath)

    def process(self, text):
        if self.__model is None:
            raise Exception("Cannot use uninitialized model.")
        prep = self.__filter(text.lower())
        if self.__vectorizer is not None:
            prep = self.__vectorizer(prep)
        pred = self.__model.predict(prep)
        return pred
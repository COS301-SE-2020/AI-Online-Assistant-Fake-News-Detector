import numpy as np
import tensorflow.keras as ks
import tensorflow as tf

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

class StackedBidirectionalLSTM:
    def __init__(self, sampleLength, maxWords, outputUnits):
        self.__sampleLength = sampleLength
        self.__maxWords = maxWords
        self.__outputUnits = outputUnits
        self.__model = None

    def __initialize(self):
        self.__model = None
        tf.keras.backend.clear_session()
        inputs = ks.Input(shape=(self.__sampleLength,), dtype="int64")
        layers = ks.layers.Embedding(input_dim=self.__maxWords, input_length=self.__sampleLength, output_dim=128, mask_zero=True)(inputs)
        # Stack bidirectional LSTMs
        layers = ks.layers.Bidirectional(ks.layers.LSTM(units=128, dropout=0.2, return_sequences=True))(layers)
        layers = ks.layers.Bidirectional(ks.layers.LSTM(units=128, dropout=0.1, return_sequences=True))(layers)
        layers = ks.layers.Bidirectional(ks.layers.LSTM(units=128))(layers)
        # Add a classifier
        outputs = ks.layers.Dense(units=self.__outputUnits, activation="softmax")(layers)
        self.__model = ks.Model(inputs=inputs, outputs=outputs)
        self.__model.summary()

    def exportModel(self, filePath):
        if self.__model is not None:
            self.__model.save_weights(filePath)
        else:
            raise Exception("Cannot export empty uninitialized model.")

    def importModel(self, filePath):
        self.__initialize()
        self.__model.load_weights(filePath)

    def importCheckpoint(self, fileDir="./"):
        self.__initialize()
        latest = tf.train.latest_checkpoint(fileDir)
        self.__model.load_weights(latest)

    def trainModel(self, generator, datasetSize, saveFilePath, saveCheckpoints = False):
        self.__initialize()
        self.__model.compile("adam", "binary_crossentropy", metrics=["accuracy"])
        batchSize = 128
        if saveCheckpoints:
            checkpoint = tf.keras.callbacks.ModelCheckpoint(filepath=saveFilePath + ".ckpt", save_weights_only=True, verbose=1)
            self.__model.fit(generator, steps_per_epoch=datasetSize/batchSize, batch_size=batchSize, epochs=3, callbacks=[checkpoint])
        else:
            self.__model.fit(generator, steps_per_epoch=datasetSize/batchSize, batch_size=batchSize, epochs=3)
        self.exportModel(saveFilePath)

    def process(self, preparedData):
        if self.__model is None:
            raise Exception("Cannot use uninitialized model.")
        results = self.__model.predict(preparedData)
        sums = []
        for i in range(len(results[0])):
            sums.append(0)
        for result in results:
            for i in range(len(result)):
                sums[i] += result[i]
        for i in range(len(sums)):
            sums[i] /= len(results)
        return sums
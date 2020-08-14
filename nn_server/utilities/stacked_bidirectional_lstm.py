import random
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
        inputs = ks.Input(shape=(self.__sampleLength,), dtype="int32")
        layers = ks.layers.Embedding(input_dim=self.__maxWords, input_length=self.__sampleLength, output_dim=64, mask_zero=True)(inputs)
        # Stack bidirectional LSTMs
        layers = ks.layers.Bidirectional(ks.layers.LSTM(units=128, dropout=0.1, return_sequences=True))(layers)
        layers = ks.layers.Bidirectional(ks.layers.LSTM(units=64, dropout=0.1, return_sequences=True))(layers)
        layers = ks.layers.Bidirectional(ks.layers.LSTM(units=64))(layers)
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

    def trainModel(self, generator, saveFilePath, saveCheckpoints = False, validationDataset = None):
        self.__initialize()
        self.__model.compile("adam", "binary_crossentropy", metrics=["accuracy"])
        if saveCheckpoints:
            checkpoint = tf.keras.callbacks.ModelCheckpoint(filepath="checkpoint.ckpt", save_weights_only=True, verbose=1)
            self.__model.fit(generator, batch_size=64, epochs=5, callbacks=[checkpoint])
        else:
            self.__model.fit(generator, batch_size=64, epochs=5)
        self.exportModel(saveFilePath)

    def process(self, preparedData):
        if self.__model is None:
            raise Exception("Cannot use uninitialized model.")
        return self.__model.predict(preparedData)
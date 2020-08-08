import keras as ks
import tensorflow as tf

class StackedBidirectionalLSTM:
    def __init__(self, filter, sampleLength=30, maxWords=100000):
        self.__sampleLength = sampleLength
        self.__maxWords = maxWords
        self.__filter = filter
        self.__model = None

    def initializeNewModel(self):
        inputs = ks.Input(shape=(self.__sampleLength,), dtype="int32")
        layers = ks.layers.Embedding(input_dim=self.__maxWords, output_dim=128, mask_zero=True)(inputs)
        # Stack bidirectional LSTMs
        layers = ks.layers.Bidirectional(ks.layers.LSTM(512, return_sequences=True))(layers)
        # layers = tf.keras.layers.Dropout(rate=0.1)(layers)
        layers = ks.layers.Bidirectional(ks.layers.LSTM(256, return_sequences=True))(layers)
        # layers = tf.keras.layers.Dropout(rate=0.2)(layers)
        layers = ks.layers.Bidirectional(ks.layers.LSTM(128, return_sequences=True))(layers)
        # layers = tf.keras.layers.Dropout(rate=0.3)(layers)
        layers = ks.layers.Bidirectional(ks.layers.LSTM(64))(layers)
        # Add a classifier
        outputs = ks.layers.Dense(units=2, activation="softmax")(layers)
        self.__model = ks.Model(inputs=inputs, outputs=outputs)
        print("GPU Check: " + str(tf.test.is_gpu_available()))
        self.__model.summary()
        self.__model.compile("adam", "binary_crossentropy", metrics=["accuracy"])

    def importModel(self):
        return 0

    def train(self, dataset):
        self.__model.fit(dataset, batch_size=32, epochs=10)

    def process(self, text):
        preprocessedText = self.__filter(text)
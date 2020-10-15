import os
import errno
import tensorflow.keras as ks
from default_configs import DEFAULT_CHECKPOINT_PATH, DEFAULT_TRAINING_LOG_PATH

class Callbacks:
    def __init__(self, name, patience):
        self.name = name
        self.patience = patience
        try:
            os.makedirs(DEFAULT_CHECKPOINT_PATH)
        except OSError as e:
            if e.errno != errno.EEXIST:
                print("Error creating directory: " + str(e))

    def getCallbacks(self):
        return [
            ks.callbacks.EarlyStopping(monitor='val_loss', mode='min', patience=self.patience, verbose=1),
            ks.callbacks.ModelCheckpoint(filepath=os.path.join(DEFAULT_CHECKPOINT_PATH, self.name + ".ckpt.hdf5"), save_weights_only=True, verbose=1),
            ks.callbacks.TensorBoard(log_dir=os.path.join(DEFAULT_TRAINING_LOG_PATH, self.name + ".log"))
        ]
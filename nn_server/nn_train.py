import pathlib
dirname = pathlib.Path(__file__).parent.absolute()
sys.path.append(os.path.join(dirname, 'neural_network_utilities'))
import multiprocessing as mp
from train_grammatical_model import runGrammarTrain
from train_lexical_model import runLexicalTrain
from train_core_model import runCoreTrain

if __name__ == "__main__":
    tfProcess = mp.Process(target=runGrammarTrain)
    tfProcess.start()
    tfProcess.join()

    tfProcess = mp.Process(target=runLexicalTrain)
    tfProcess.start()
    tfProcess.join()

    tfProcess = mp.Process(target=runCoreTrain)
    tfProcess.start()
    tfProcess.join()

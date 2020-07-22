import nltk
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')

def factFeatureTagger(text):
    tokens = nltk.word_tokenize(text)
    partsOfSpeech = nltk.pos_tag(tokens)
    features = []
    acceptedPartsOfSpeech = ["PDT", "PRP", "FW", "EX", "JJ", "JJR", "JJS", "NN", "NNS", "NNP", "NNPS", "POS", "RB", "RBR", "RBS", "VB", "VBD", "VBG", "VBN", "VBP", "VBZ"]
    for word in partsOfSpeech:
        if word[1] in acceptedPartsOfSpeech:
            features.append(word)
    return dict(features)

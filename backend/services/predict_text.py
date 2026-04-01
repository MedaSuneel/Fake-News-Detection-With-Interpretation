import torch
import torch.nn.functional as F
import numpy as np
from transformers import BertTokenizer, BertForSequenceClassification
from lime.lime_text import LimeTextExplainer

# ---------------------------
# Load Model
# ---------------------------

MODEL_PATH = "models/text_model/bert_model"

tokenizer = BertTokenizer.from_pretrained(MODEL_PATH)
model = BertForSequenceClassification.from_pretrained(MODEL_PATH)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
model.eval()

class_names = ["real", "fake"]

# ---------------------------
# Prediction Function for LIME
# ---------------------------

def predict_proba(texts):
    """
    LIME requires this function to accept list[str]
    and return probability array.
    """

    inputs = tokenizer(
        texts,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    )

    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)
        probs = F.softmax(outputs.logits, dim=1)

    return probs.cpu().numpy()

# ---------------------------
# Initialize LIME Explainer
# ---------------------------

explainer = LimeTextExplainer(class_names=class_names)

# ---------------------------
# Main API Function
# ---------------------------

def predict_text(news_text: str):

    # ---- Normal Prediction ----
    probs = predict_proba([news_text])
    predicted_class = int(np.argmax(probs))
    confidence = float(probs[0][predicted_class])

    verdict = "fake" if predicted_class == 1 else "real"

    # ---- LIME Explanation ----
    explanation = explainer.explain_instance(
        news_text,
        predict_proba,
        num_features=5,
        num_samples=1000  #increase to 5000 for research paper to increase accuracy and for web testing 1000
    )

    important_words = [
        word for word, score in explanation.as_list()
    ]



    return {
        "verdict": verdict,
        "confidence": round(confidence * 100, 2),
        "explanation": important_words
    }



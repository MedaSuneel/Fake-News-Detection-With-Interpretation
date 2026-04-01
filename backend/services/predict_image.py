import torch
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms

from models.image_model.EfficientNet_model import load_image_model

# Load model ONCE (important for performance)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = load_image_model(device)

# Image transform (same as validation)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

def predict_image(image_file):
    try:
        # 1. Process Image
        image = Image.open(image_file).convert("RGB")
        image = transform(image).unsqueeze(0).to(device)

        # 2. Prediction
        with torch.no_grad():
            outputs = model(image)

            probs = F.softmax(outputs, dim=1)
            confidence, preds = torch.max(probs, 1)

        predicted_class = preds.item()
        confidence_score = float(confidence.item())

        # 3. Verdict
        verdict = "Fake" if predicted_class == 1 else "Real"

        # 4. Return
        return {
            "verdict": verdict,
            "confidence": round(confidence_score * 100, 2),
            "sources": []  # keep empty or integrate later
        }

    except Exception as e:
        return {
            "error": str(e)
        }
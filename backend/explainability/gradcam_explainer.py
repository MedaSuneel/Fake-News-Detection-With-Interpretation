import torch
import numpy as np
import cv2
import base64

from PIL import Image
from torchvision import transforms

from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image

from models.image_model.EfficientNet_model import load_image_model

# -------------------------
# Load model once
# -------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = load_image_model(device)

# ✅ Correct layer for torchvision EfficientNet
target_layers = [model.features[-1]]

cam = GradCAM(model=model, target_layers=target_layers)

# -------------------------
# Transform
# -------------------------
transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485,0.456,0.406],
        std=[0.229,0.224,0.225]
    )
])

# -------------------------
# Grad-CAM Function
# -------------------------
def generate_gradcam(image_file):
    try:
        image = Image.open(image_file).convert("RGB")

        # Resize for visualization
        img_resized = image.resize((224,224))

        input_tensor = transform(image).unsqueeze(0).to(device)

        # Generate CAM
        grayscale_cam = cam(input_tensor=input_tensor)[0]

        # Convert image to numpy
        img_np = np.array(img_resized) / 255.0

        visualization = show_cam_on_image(
            img_np,
            grayscale_cam,
            use_rgb=True
        )

        # Encode to base64
        _, buffer = cv2.imencode(".png", visualization)
        img_base64 = base64.b64encode(buffer).decode("utf-8")

        return f"data:image/png;base64,{img_base64}"

    except Exception as e:
        return {"error": str(e)}
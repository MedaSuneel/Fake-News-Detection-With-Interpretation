from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import io

# Services
from services.predict_text import predict_text
from services.predict_image import predict_image

# Explainability
from explainability.gradcam_explainer import generate_gradcam

app = FastAPI()

origins = [
    "http://localhost:5173",
    "https://fake-news-detection-with-interpreta.vercel.app/"
]

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NewsInput(BaseModel):
    text: str


# TEXT PREDICTION
@app.post("/predict-text")
def predict_text_api(news: NewsInput):

    result = predict_text(news.text)

    return {
        "prediction": result
    }


# IMAGE PREDICTION + EXPLANATION
@app.post("/predict-image")
async def predict_image_api(file: UploadFile = File(...)):

    # read image once
    contents = await file.read()

    image_bytes = io.BytesIO(contents)

    # prediction
    prediction = predict_image(image_bytes)

    # reset pointer for second read
    image_bytes.seek(0)

    # explanation
    heatmap = generate_gradcam(image_bytes)

    return {
        "prediction": prediction,
        "explanation": heatmap
    }
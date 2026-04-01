📰 Fake News Detection with Explainability

📌 Overview

This project is a Fake News Detection System with Explainable AI (XAI) that detects whether a news article (text or image) is Real or Fake and provides human-understandable explanations for its predictions.

The system combines Machine Learning, Deep Learning, and Explainability techniques to improve transparency and trust in AI-based predictions.

🚀 Features

🧠 Text-based Fake News Detection

Models: Logistic Regression, XGBoost, BERT

🖼️ Image-based Fake News Detection

Models: CNN, EfficientNet-B0

🔍 Explainability

LIME (Local explanations)

Grad-CAM (for image visualization)


💻 Full Stack Web App

Frontend: React + Tailwind CSS

Backend: FastAPI


📂 Project Structure

fake-news-detection/

│
├── backend/

│   ├── app.py

│   ├── models/

│   │   ├── text_model/

│   │   └── image_model/

│   ├── routes/

│   ├── utils/

│   └── requirements.txt

│
├── frontend/

│   ├── src/

│   ├── public/

│   └── package.json

│
├── datasets/

├── notebooks/

└── README.md


⚠️ Note About Models

Due to GitHub file size limitations, trained models are not included in this repository.

👉 You must download them separately from the link below.

BERT (Text Model) : suneelmeda123/fake-news-bert-model
EfficientNet-B0 (Image Model) : suneelmeda123/fake-news-efficientnet

After downloading:
1. Extract the files
2. Place them in: backend/models/
3. Ensure structure:
4. backend/models/
├── text_model/
└── image_model/

🛠️ Installation & Setup

1️⃣ Clone Repository

git clone https://github.com/your-username/fake-news-detection.git

cd fake-news-detection


2️⃣ Backend Setup (FastAPI)

cd backend

# Create virtual environment
python -m venv venv

# Activate environment
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt


3️⃣ Run Backend Server : uvicorn app:app --reload

4️⃣ Frontend Setup (React)

cd frontend

# Install dependencies
npm install

5️⃣ Run Frontend : npm run dev

🧪 How to Use
Open the web app
Choose:
Text News OR Image News
Upload or enter input
Get:
Prediction (Real/Fake)
Explanation (LIME/SHAP/Grad-CAM)

🧠 Tech Stack

Frontend
React.js
Tailwind CSS

Backend
FastAPI
Python

Machine Learning
Scikit-learn
XGBoost
Transformers (BERT)

Deep Learning
PyTorch / TensorFlow
EfficientNet-B0

Explainable AI
LIME
Grad-CAM

📊 Datasets Used
FakeNewsNet (Text)
Fakeddit (Image)

⚡ Future Improvements
Real-time news scraping
Multilingual support
Mobile app version
Improved model accuracy








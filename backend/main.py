from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

import io
import os
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image


# --------------------------------------------------
# APP
# --------------------------------------------------

app = FastAPI(title="SafeInfra API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# MODEL CONFIGURATION
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "model", "severity_model.pt")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# --------------------------------------------------
# LOAD TRAINED MODEL
# --------------------------------------------------

checkpoint = torch.load(
    MODEL_PATH,
    map_location=device,
    weights_only=False
)

classes = checkpoint["classes"]

model = models.resnet50(weights=None)

num_features = model.fc.in_features
model.fc = nn.Linear(num_features, len(classes))

model.load_state_dict(checkpoint["model_state_dict"])

model = model.to(device)
model.eval()


# --------------------------------------------------
# IMAGE PREPROCESSING
# --------------------------------------------------

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# --------------------------------------------------
# ROOT
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "SafeInfra Backend is running"
    }


# --------------------------------------------------
# ANALYZE IMAGE
# --------------------------------------------------

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):

    image_bytes = await file.read()

    image = Image.open(
        io.BytesIO(image_bytes)
    ).convert("RGB")

    input_tensor = transform(image)
    input_tensor = input_tensor.unsqueeze(0)
    input_tensor = input_tensor.to(device)

    with torch.no_grad():

        outputs = model(input_tensor)

        probabilities = torch.softmax(
            outputs,
            dim=1
        )

        confidence, predicted_index = torch.max(
            probabilities,
            dim=1
        )
        predicted_class = classes[predicted_index.item()]
    confidence_score = round(confidence.item() * 100, 2)

    priority_map = {
        "Critical": "Immediate",
        "High": "High",
        "Medium": "Moderate",
        "Low": "Routine"
    }

    priority = priority_map.get(predicted_class, "Unknown")

    return {
        "damage_severity": predicted_class,
        "confidence_score": confidence_score,
        "priority": priority
    }

# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/metrics")
def metrics():

    return {
        "model": "ResNet-50",
        "classes": classes,
        "device": str(device)
    }

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SafeInfra API")

# Allow frontend (React/Vite) to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "SafeInfra Backend is running"}


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    # Temporary response
    # This will be replaced with the real AI model later.
    return {
        "infrastructure_type": "Bridge",
        "damage_severity": "High",
        "confidence_score": 87
    }


@app.get("/metrics")
def metrics():
    # Temporary placeholder metrics.
    # Replace these with Person 2's actual model metrics.
    return {
        "accuracy": 0.81,
        "per_class": {
            "Low": {
                "precision": 0.88,
                "recall": 0.90,
                "f1": 0.89
            },
            "Medium": {
                "precision": 0.79,
                "recall": 0.75,
                "f1": 0.77
            },
            "High": {
                "precision": 0.80,
                "recall": 0.78,
                "f1": 0.79
            },
            "Critical": {
                "precision": 0.70,
                "recall": 0.65,
                "f1": 0.67
            }
        },
        "confusion_matrix_image": "confusion_matrix.png"
    }
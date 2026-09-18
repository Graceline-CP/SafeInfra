"""
SafeInfra - Damage Severity Classifier Training Script
Person 2's pipeline: dataset -> trained model -> metrics.json -> graphs

Usage:
    python train.py

Expects this folder structure in ./data:
    data/train/<Low|Medium|High|Critical>/*.jpg
    data/val/<Low|Medium|High|Critical>/*.jpg
    data/test/<Low|Medium|High|Critical>/*.jpg

Produces:
    model/severity_model.pt
    model/metrics.json
    model/accuracy_curve.png
    model/loss_curve.png
    model/confusion_matrix.png
"""

import os
import json
import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
from sklearn.metrics import precision_recall_fscore_support, confusion_matrix, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# -----------------------------
# CONFIG
# -----------------------------
DATA_DIR = "data"
OUTPUT_DIR = "model"
CLASSES = ["Critical", "High", "Low", "Medium"]
IMG_SIZE = 224
BATCH_SIZE = 16
EPOCHS = 10
LR = 1e-4
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

os.makedirs(OUTPUT_DIR, exist_ok=True)
print(f"Using device: {DEVICE}")

# -----------------------------
# STEP 1-3: DATA LOADING + AUGMENTATION
# -----------------------------
train_transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15),
    transforms.ColorJitter(brightness=0.2),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

eval_transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

train_dataset = datasets.ImageFolder(os.path.join(DATA_DIR, "train"), transform=train_transform)
val_dataset = datasets.ImageFolder(os.path.join(DATA_DIR, "val"), transform=eval_transform)
test_dataset = datasets.ImageFolder(os.path.join(DATA_DIR, "test"), transform=eval_transform)

# Sanity check: make sure folder class order matches your CLASSES list
print("Detected classes (train folder order):", train_dataset.classes)
if train_dataset.classes != CLASSES:
    print("WARNING: folder class order doesn't match CLASSES list above.")
    print("Update CLASSES to:", train_dataset.classes, "or rename your folders to match.")

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False)
test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False)

print(f"Train: {len(train_dataset)} images | Val: {len(val_dataset)} images | Test: {len(test_dataset)} images")

# -----------------------------
# STEP 1-2: MODEL - PRETRAINED BACKBONE + NEW HEAD
# -----------------------------
model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V2)

# Freeze all pretrained layers
for param in model.parameters():
    param.requires_grad = False

# Replace final layer with our 4-class head (this part IS trainable)
num_features = model.fc.in_features
model.fc = nn.Linear(num_features, len(CLASSES))

model = model.to(DEVICE)

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.fc.parameters(), lr=LR)  # only train the new head

# -----------------------------
# STEP 4: TRAINING LOOP
# -----------------------------
history = {"train_loss": [], "val_loss": [], "train_acc": [], "val_acc": []}

def run_epoch(loader, training):
    model.train() if training else model.eval()
    total_loss, correct, total = 0.0, 0, 0
    context = torch.enable_grad() if training else torch.no_grad()
    with context:
        for images, labels in loader:
            images, labels = images.to(DEVICE), labels.to(DEVICE)
            if training:
                optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            if training:
                loss.backward()
                optimizer.step()
            total_loss += loss.item() * images.size(0)
            preds = outputs.argmax(dim=1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)
    return total_loss / total, correct / total

print("\nStarting training...")
for epoch in range(1, EPOCHS + 1):
    train_loss, train_acc = run_epoch(train_loader, training=True)
    val_loss, val_acc = run_epoch(val_loader, training=False)

    history["train_loss"].append(train_loss)
    history["val_loss"].append(val_loss)
    history["train_acc"].append(train_acc)
    history["val_acc"].append(val_acc)

    print(f"Epoch {epoch}/{EPOCHS} | "
          f"train_loss={train_loss:.4f} train_acc={train_acc:.4f} | "
          f"val_loss={val_loss:.4f} val_acc={val_acc:.4f}")

# -----------------------------
# STEP 5-6: FINAL EVALUATION ON TEST SET
# -----------------------------
print("\nEvaluating on held-out test set...")
model.eval()
all_preds, all_labels = [], []
with torch.no_grad():
    for images, labels in test_loader:
        images = images.to(DEVICE)
        outputs = model(images)
        preds = outputs.argmax(dim=1).cpu().numpy()
        all_preds.extend(preds)
        all_labels.extend(labels.numpy())

test_accuracy = accuracy_score(all_labels, all_preds)
precision, recall, f1, _ = precision_recall_fscore_support(
    all_labels, all_preds, labels=range(len(CLASSES)), zero_division=0
)

print(f"\nTest Accuracy: {test_accuracy:.4f}")
for i, cls in enumerate(CLASSES):
    print(f"  {cls}: precision={precision[i]:.2f} recall={recall[i]:.2f} f1={f1[i]:.2f}")

# -----------------------------
# STEP 7: GRAPHS
# -----------------------------
epochs_range = range(1, EPOCHS + 1)

# Accuracy curve
plt.figure(figsize=(7, 5))
plt.plot(epochs_range, history["train_acc"], label="Train Accuracy", marker="o")
plt.plot(epochs_range, history["val_acc"], label="Validation Accuracy", marker="o")
plt.xlabel("Epoch")
plt.ylabel("Accuracy")
plt.title("Training vs Validation Accuracy")
plt.legend()
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, "accuracy_curve.png"), dpi=150)
plt.close()

# Loss curve
plt.figure(figsize=(7, 5))
plt.plot(epochs_range, history["train_loss"], label="Train Loss", marker="o")
plt.plot(epochs_range, history["val_loss"], label="Validation Loss", marker="o")
plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.title("Training vs Validation Loss")
plt.legend()
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, "loss_curve.png"), dpi=150)
plt.close()

# Confusion matrix
cm = confusion_matrix(all_labels, all_preds, labels=range(len(CLASSES)))
plt.figure(figsize=(6, 5))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=CLASSES, yticklabels=CLASSES)
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, "confusion_matrix.png"), dpi=150)
plt.close()

print(f"\nGraphs saved to {OUTPUT_DIR}/")

# -----------------------------
# STEP 8: EXPORT MODEL
# -----------------------------
model_path = os.path.join(OUTPUT_DIR, "severity_model.pt")
torch.save({
    "model_state_dict": model.state_dict(),
    "classes": CLASSES,
}, model_path)
print(f"Model saved to {model_path}")

# -----------------------------
# STEP 9: metrics.json (exact shape Person 3 needs)
# -----------------------------
metrics = {
    "accuracy": round(float(test_accuracy), 4),
    "per_class": {
        CLASSES[i]: {
            "precision": round(float(precision[i]), 4),
            "recall": round(float(recall[i]), 4),
            "f1": round(float(f1[i]), 4),
        }
        for i in range(len(CLASSES))
    },
    "confusion_matrix_image": "confusion_matrix.png",
}

with open(os.path.join(OUTPUT_DIR, "metrics.json"), "w") as f:
    json.dump(metrics, f, indent=2)

print(f"metrics.json saved to {OUTPUT_DIR}/")
print("\nDone. Hand off the 'model/' folder to Person 3.")
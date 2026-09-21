import torch
from torchvision import transforms
from PIL import Image
import io
import json
import os
import numpy as np
from app.models.model import load_model, NUM_CLASSES
import time

class InferenceService:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = None
        self.class_names = {}
        
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        self.load_resources()

    def load_resources(self):
        # Paths
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        model_path = os.path.join(base_dir, "model_files", "hybrid_best.pth")
        class_names_path = os.path.join(base_dir, "model_files", "class_names.json")
        
        # Load class names
        with open(class_names_path, 'r') as f:
            self.class_names = json.load(f)
            
        # Load model
        self.model = load_model(model_path, device=self.device)
        print(f"Model loaded successfully on {self.device}")

    def preprocess_image(self, image_bytes: bytes) -> torch.Tensor:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        tensor = self.transform(image).unsqueeze(0)
        return tensor.to(self.device)

    def predict(self, image_bytes: bytes):
        try:
            tensor = self.preprocess_image(image_bytes)
            
            with torch.no_grad():
                outputs = self.model(tensor)
                probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
                
            confidence, predicted_idx = torch.max(probabilities, 0)
            
            idx = str(predicted_idx.item())
            predicted_class = self.class_names[idx]
            
            probs_dict = {
                self.class_names[str(i)]: round(prob.item(), 4)
                for i, prob in enumerate(probabilities)
            }
            
            return {
                "prediction": predicted_class,
                "confidence": round(confidence.item(), 4),
                "probabilities": probs_dict,
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            }
            
        except Exception as e:
            raise Exception(f"Error during prediction: {str(e)}")

inference_service = InferenceService()

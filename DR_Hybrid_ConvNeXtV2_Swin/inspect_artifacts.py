import torch
import pprint
import os

base_path = r"D:\Downloads\DR_Hybrid_ConvNeXtV2_Swin\final_artifacts"

print("--- config.pth ---")
try:
    config = torch.load(os.path.join(base_path, "config.pth"), map_location='cpu')
    pprint.pprint(config)
except Exception as e:
    print("Error:", e)

print("\n--- class_names.pth ---")
try:
    classes = torch.load(os.path.join(base_path, "class_names.pth"), map_location='cpu')
    pprint.pprint(classes)
except Exception as e:
    print("Error:", e)

print("\n--- metrics.pth ---")
try:
    metrics = torch.load(os.path.join(base_path, "metrics.pth"), map_location='cpu')
    pprint.pprint(metrics)
except Exception as e:
    print("Error:", e)

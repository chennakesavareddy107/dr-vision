import traceback
from app.services.inference import inference_service

try:
    with open(r"d:\Downloads\dr-vision\src\assets\images\clinical_eye_macro_1789908532837.jpg", "rb") as f:
        image_bytes = f.read()
    
    result = inference_service.predict(image_bytes)
    print("Success:", result)
except Exception as e:
    print("Failed to predict:")
    traceback.print_exc()

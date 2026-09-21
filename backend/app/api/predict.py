from fastapi import APIRouter, File, UploadFile, HTTPException
from app.services.inference import inference_service

router = APIRouter()

@router.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")
    
    try:
        contents = await file.read()
        result = inference_service.predict(contents)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

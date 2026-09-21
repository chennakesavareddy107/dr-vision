from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from app.services.gradcam_service import gradcam_service
from typing import Optional

router = APIRouter()

@router.post("/gradcam")
async def generate_gradcam(
    file: UploadFile = File(...),
    target_class: Optional[int] = Form(None)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")
    
    try:
        contents = await file.read()
        heatmap_url = gradcam_service.generate_heatmap(contents, target_class)
        return {"gradcam_image": heatmap_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

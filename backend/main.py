from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

from app.api.predict import router as predict_router
from app.api.gradcam import router as gradcam_router
from app.api.lesion import router as lesion_router
from app.api.reports import router as reports_router

app = FastAPI(title="DR Vision API", description="Diabetic Retinopathy Classification API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, change this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router, prefix="/api")
app.include_router(gradcam_router, prefix="/api")
app.include_router(lesion_router, prefix="/api")
app.include_router(reports_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to DR Vision API"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

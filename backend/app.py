from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import io
from typing import Dict, Any

app = FastAPI(title="Architectural Classifier API", version="1.0.0")

# Add CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy architectural styles for now
ARCHITECTURAL_STYLES = [
    "Gothic", "Renaissance", "Baroque", "Neoclassical", 
    "Art Deco", "Modern", "Contemporary", "Victorian",
    "Colonial", "Brutalist"
]

@app.get("/")
async def root():
    return {"message": "Architectural Classifier API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "architectural-classifier"}

@app.post("/classify")
async def classify_image(file: UploadFile = File(...)):
    """
    Upload an image and get architectural style classification
    """
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and process the uploaded image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Get image dimensions for basic validation
        width, height = image.size
        
        if width < 50 or height < 50:
            raise HTTPException(status_code=400, detail="Image too small (minimum 50x50 pixels)")
        
        # TODO: Replace this with actual ML model prediction
        # For now, return dummy classification results
        dummy_predictions = get_dummy_classification()
        
        return {
            "success": True,
            "filename": file.filename,
            "image_size": {"width": width, "height": height},
            "predictions": dummy_predictions,
            "top_prediction": dummy_predictions[0]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

def get_dummy_classification() -> list[Dict[str, Any]]:
    """
    Returns dummy classification results
    TODO: Replace with actual ML model inference
    """
    import random
    
    # Generate random confidence scores that sum to ~100%
    confidences = [random.uniform(0.1, 0.8) for _ in range(len(ARCHITECTURAL_STYLES))]
    total = sum(confidences)
    confidences = [c/total for c in confidences]
    
    # Sort by confidence (highest first)
    results = [
        {"style": style, "confidence": conf}
        for style, conf in zip(ARCHITECTURAL_STYLES, confidences)
    ]
    results.sort(key=lambda x: x["confidence"], reverse=True)
    
    # Return top 5 predictions
    return results[:5]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)
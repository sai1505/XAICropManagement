from fastapi import FastAPI
from api.routes import router

app = FastAPI(
    title="XCropAI",
    version="1.0.0",
    description="Thermal-based Crop Stress Analysis API"
)

app.include_router(router, prefix="/api")

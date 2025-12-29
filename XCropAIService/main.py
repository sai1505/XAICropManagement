from fastapi import FastAPI
from api.routes import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="XCropAI",
    version="1.0.0",
    description="Thermal-based Crop Stress Analysis API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or "*” for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


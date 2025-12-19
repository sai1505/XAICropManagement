from fastapi import APIRouter, UploadFile, File
import shutil
import os

from services.thermal import rgb_to_pseudo_thermal
from services.stress import detect_stress
from services.stats import extract_stats
from services.llm import ask_groq_from_json
from core.config import OUTPUT_DIR

router = APIRouter()

@router.post("/analyze")
async def analyze_crop(crop: str, image: UploadFile = File(...)):
    image_path = os.path.join(OUTPUT_DIR, image.filename)

    with open(image_path, "wb") as f:
        shutil.copyfileobj(image.file, f)

    gray, thermal = rgb_to_pseudo_thermal(image_path)
    stress_percent = detect_stress(gray, thermal)
    stats = extract_stats(gray, stress_percent)

    llm_payload = {
        "crop": crop,
        "thermal_analysis": stats,
        "instruction": (
            "You are an agricultural expert. Based on the thermal stress data, "
            "identify possible crop issues, severity, and prevention measures. "
            "Give them briefly with stats."
        )
    }

    llm_response = ask_groq_from_json(llm_payload)

    return {
        "analysis": stats,
        "llm_response": llm_response
    }

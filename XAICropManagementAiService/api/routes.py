import cv2
from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import shutil
import numpy as np
from datetime import datetime

from services.thermal import rgb_to_pseudo_thermal
from services.stress import detect_stress
from services.stats import generate_plant_stats
from services.llm import ask_groq_followup, ask_groq_for_analysis, ask_groq_for_prevention
from core.config import OUTPUT_DIR

router = APIRouter(prefix="/analyze", tags=["Plant Analysis"])


@router.post("")
async def analyze_plant(
    name: str,
    image: UploadFile = File(...)
):
    # --------------------------------------------------
    # Validate image
    # --------------------------------------------------
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image file")

    # --------------------------------------------------
    # Save image
    # --------------------------------------------------
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    image_path = os.path.join(OUTPUT_DIR, image.filename)

    with open(image_path, "wb") as f:
        shutil.copyfileobj(image.file, f)

    # --------------------------------------------------
    # Image → Thermal → Stress
    # --------------------------------------------------
    # Convert thermal to grayscale for mask generation
    gray, thermal = rgb_to_pseudo_thermal(image_path)
    stress_percentage = detect_stress(gray, thermal)

    # Ensure gray is 2D (already is, but safe)
    if gray.ndim == 3:
        gray = gray[:, :, 0]

    # Convert thermal (color) to grayscale
    thermal_gray = cv2.cvtColor(thermal, cv2.COLOR_BGR2GRAY)

    # Create disease mask from thermal grayscale
    raw_mask = (thermal_gray > np.mean(thermal_gray)).astype(np.uint8)

    # Resize mask to match gray
    disease_mask = cv2.resize(
        raw_mask,
        (gray.shape[1], gray.shape[0]),
        interpolation=cv2.INTER_NEAREST
    )




    # --------------------------------------------------
    # Deterministic stats (SOURCE OF TRUTH)
    # --------------------------------------------------
    stats = generate_plant_stats(
        gray=gray,
        disease_mask=disease_mask,
        stress_percentage=stress_percentage
    )

    prevention = ask_groq_for_prevention(name, stats)

    # --------------------------------------------------
    # LLM reasoning (QUALITATIVE ONLY)
    # --------------------------------------------------
    llm_analysis = ask_groq_for_analysis(name, stats)

    # --------------------------------------------------
    # API response (DB + dashboard ready)
    # --------------------------------------------------
    return {
        "name": name,
        "stats": stats,
        "llm_analysis": llm_analysis,
        "prevention" : prevention,
        "meta": {
            "generated_at": datetime.utcnow().isoformat()
        }
    }

@router.post("/chat")
async def follow_up_chat(payload: dict):
    name = payload.get("name", "the plant")  # 👈 SAFE DEFAULT

    return ask_groq_followup(
        name,
        payload["stats"],
        payload.get("previous_response", ""),
        payload["question"]
    )

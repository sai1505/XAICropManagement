import cv2
import numpy as np
import os
import json

# -----------------------------
# CONFIG
# -----------------------------
INPUT_IMAGE = "potato_disease.jpg"
OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# -----------------------------
# STEP 1: RGB → PSEUDO THERMAL
# -----------------------------
def rgb_to_pseudo_thermal(image_path):
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError("Input image not found")

    img = cv2.resize(img, (512, 512))

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)

    thermal = cv2.applyColorMap(enhanced, cv2.COLORMAP_INFERNO)

    cv2.imwrite(f"{OUTPUT_DIR}/01_gray.png", gray)
    cv2.imwrite(f"{OUTPUT_DIR}/02_enhanced.png", enhanced)
    cv2.imwrite(f"{OUTPUT_DIR}/03_pseudo_thermal.png", thermal)

    return enhanced, thermal


# -----------------------------
# STEP 2: STRESS ZONE DETECTION
# -----------------------------
def detect_stress(enhanced_gray, thermal_img):
    threshold_value = int(0.65 * 255)
    _, stress_mask = cv2.threshold(
        enhanced_gray, threshold_value, 255, cv2.THRESH_BINARY
    )

    kernel = np.ones((5, 5), np.uint8)
    stress_mask = cv2.morphologyEx(stress_mask, cv2.MORPH_CLOSE, kernel)

    stressed_pixels = np.count_nonzero(stress_mask)
    total_pixels = stress_mask.size
    stress_percentage = round((stressed_pixels / total_pixels) * 100, 2)

    # Overlay stress zones
    overlay = thermal_img.copy()
    overlay[stress_mask == 255] = [0, 0, 255]

    cv2.imwrite(f"{OUTPUT_DIR}/04_stress_mask.png", stress_mask)
    cv2.imwrite(f"{OUTPUT_DIR}/05_stress_overlay.png", overlay)

    return stress_mask, stress_percentage


# -----------------------------
# STEP 3: THERMAL STATISTICS
# -----------------------------
def extract_stats(gray, stress_percentage):
    stats = {
        "mean_intensity": float(np.mean(gray)),
        "max_intensity": int(np.max(gray)),
        "min_intensity": int(np.min(gray)),
        "stress_percentage": stress_percentage,
        "stress_level": (
            "LOW" if stress_percentage < 15
            else "MEDIUM" if stress_percentage < 40
            else "HIGH"
        )
    }

    with open(f"{OUTPUT_DIR}/06_thermal_stats.json", "w") as f:
        json.dump(stats, f, indent=4)

    return stats


# -----------------------------
# STEP 4: LLM PAYLOAD GENERATION
# -----------------------------
def generate_llm_payload(stats, crop="potato"):
    payload = {
        "crop": crop,
        "thermal_analysis": stats,
        "instruction": (
            "You are an agricultural expert. Based on the thermal stress data, "
            "identify possible crop issues, severity, and prevention measures."
        )
    }

    with open(f"{OUTPUT_DIR}/07_llm_payload.json", "w") as f:
        json.dump(payload, f, indent=4)

    return payload


# -----------------------------
# MAIN PIPELINE
# -----------------------------
def main():
    print("🔹 Running XCropAI Pipeline...")

    enhanced_gray, thermal_img = rgb_to_pseudo_thermal(INPUT_IMAGE)
    print("✅ Step 1: Pseudo-Thermal Generated")

    stress_mask, stress_percent = detect_stress(enhanced_gray, thermal_img)
    print(f"✅ Step 2: Stress Detected → {stress_percent}%")

    stats = extract_stats(enhanced_gray, stress_percent)
    print("✅ Step 3: Thermal Stats Extracted")

    llm_payload = generate_llm_payload(stats)
    print("✅ Step 4: LLM Payload Ready")

    print("\n🎯 FINAL OUTPUT")
    print(json.dumps(llm_payload, indent=4))


if __name__ == "__main__":
    main()

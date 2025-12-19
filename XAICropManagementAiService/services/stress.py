import cv2
import numpy as np
from core.config import OUTPUT_DIR

def detect_stress(enhanced_gray, thermal_img):
    threshold = int(0.65 * 255)
    _, mask = cv2.threshold(enhanced_gray, threshold, 255, cv2.THRESH_BINARY)

    kernel = np.ones((5, 5), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)

    stressed = np.count_nonzero(mask)
    total = mask.size
    percentage = round((stressed / total) * 100, 2)

    overlay = thermal_img.copy()
    overlay[mask == 255] = [0, 0, 255]

    cv2.imwrite(f"{OUTPUT_DIR}/stress_mask.png", mask)
    cv2.imwrite(f"{OUTPUT_DIR}/stress_overlay.png", overlay)

    return percentage

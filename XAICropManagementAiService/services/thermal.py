import cv2
from core.config import IMAGE_SIZE, OUTPUT_DIR

def rgb_to_pseudo_thermal(image_path: str):
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError("Image not found")

    img = cv2.resize(img, IMAGE_SIZE)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    clahe = cv2.createCLAHE(3.0, (8, 8))
    enhanced = clahe.apply(gray)

    thermal = cv2.applyColorMap(enhanced, cv2.COLORMAP_INFERNO)

    cv2.imwrite(f"{OUTPUT_DIR}/gray.png", gray)
    cv2.imwrite(f"{OUTPUT_DIR}/thermal.png", thermal)

    return enhanced, thermal

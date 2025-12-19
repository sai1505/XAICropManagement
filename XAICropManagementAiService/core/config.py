import os

BASE_DIR = os.getcwd()
OUTPUT_DIR = os.path.join(BASE_DIR, "outputs")
IMAGE_SIZE = (512, 512)

os.makedirs(OUTPUT_DIR, exist_ok=True)

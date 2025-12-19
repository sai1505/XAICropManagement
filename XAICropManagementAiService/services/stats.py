import numpy as np

def extract_stats(gray, stress_percentage):
    return {
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

import os
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv(override=True)

# export GROQ_API_KEY="your_key_here"
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def ask_groq_from_json(input_json: dict) -> str:
    """
    Sends JSON input to Groq LLM and returns the response text
    """
    prompt = json.dumps(input_json, indent=2)

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a precise assistant. Respond clearly and concisely."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3,
        max_tokens=512
    )

    return completion.choices[0].message.content


# ------------------ Example Usage ------------------
if __name__ == "__main__":
    input_data = {
        "crop": "potato",
        "thermal_analysis": {
            "mean_intensity": 137.56578063964844,
            "max_intensity": 254,
            "min_intensity": 0,
            "stress_percentage": 41.75,
            "stress_level": "HIGH"
        },
        "instruction": "You are an agricultural expert. Based on the thermal stress data, identify possible crop issues, severity, and prevention measures. Give them breaifly with stats."
    }

    response = ask_groq_from_json(input_data)
    print("Groq Response:\n")
    print(response)

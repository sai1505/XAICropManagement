import json
from core.groq_client import get_groq_client

client = get_groq_client()

def ask_groq_from_json(input_json: dict) -> str:
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

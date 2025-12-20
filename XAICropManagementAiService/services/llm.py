import json
import re
from core.groq_client import get_groq_client

client = get_groq_client()

def build_llm_payload(name: str, stats: dict) -> dict:
    return {
        "plant_name": name,
        "image_analysis": stats["image_analysis"],
        "plant_health": stats["plant_health"],
        "rules": {
            "do_not_invent_numbers": True,
            "do_not_add_new_metrics": True,
            "allowed_outputs": [
                "explanation",
                "future_trend",
                "care_recommendations",
                "confidence_level"
            ]
        }
    }

def safe_json_parse(text: str) -> dict:
    if not text:
        return {"error": "Empty LLM response"}

    # Remove markdown fences if present
    text = text.strip()
    text = re.sub(r"^```json", "", text)
    text = re.sub(r"```$", "", text)
    text = text.strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Last resort: extract JSON block
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass

    return {
        "error": "Invalid JSON from LLM",
        "raw_response": text
    }


def build_llm_prompt(payload: dict) -> str:
    return f"""
    You are a plant health assistant.

    You are given VERIFIED analytics.
    Rules:
    - Do NOT invent numbers
    - Do NOT add new metrics
    - Use ONLY the provided data
    - Predict qualitative future trends only

    INPUT:
    {json.dumps(payload, indent=2)}

    Respond ONLY in JSON:
    {{
    "explanation": "",
    "future_trend": "IMPROVING | STABLE | WORSENING",
    "care_recommendations": [],
    "confidence_level": "LOW | MEDIUM | HIGH"
    }}
    """


def ask_groq_for_analysis(name: str, stats: dict) -> dict:
    payload = build_llm_payload(name, stats)
    prompt = build_llm_prompt(payload)

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You must respond ONLY with valid JSON."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2,
        max_tokens=500
    )

    raw = completion.choices[0].message.content
    return safe_json_parse(raw)

def build_prevention_payload(name: str, stats: dict) -> dict:
    return {
        "plant_name": name,
        "plant_health": stats["plant_health"],
        "image_analysis": stats["image_analysis"],
        "context": {
            "goal": "plant_prevention_and_care",
            "rules": {
                "no_numbers": True,
                "no_diagnosis_claims": True,
                "focus_on_prevention": True
            }
        }
    }

def build_prevention_prompt(payload: dict) -> str:
    return f"""
You are a plant care and prevention assistant.

You are given VERIFIED plant health analytics.
Your task is to suggest PREVENTIVE CARE actions.

Rules:
- Do NOT invent numbers
- Do NOT claim exact diseases
- Do NOT give chemical dosages
- Use cautious language (e.g., "may help", "often recommended")
- Focus on prevention, not cure

INPUT DATA:
{json.dumps(payload, indent=2)}

Respond ONLY in valid JSON:
{{
  "possible_causes": [],
  "prevention_steps": [],
  "care_routine_adjustments": [],
  "environmental_tips": [],
  "warning_signs_to_watch": []
}}
"""

def ask_groq_for_prevention(name: str, stats: dict) -> dict:
    payload = build_prevention_payload(name, stats)
    prompt = build_prevention_prompt(payload)

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a cautious plant care expert. Respond only with JSON."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3,
        max_tokens=600
    )

    return safe_json_parse(completion.choices[0].message.content)

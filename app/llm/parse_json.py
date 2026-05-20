import json

def parse_model_json(text: str) -> dict:
    if not text:
        return {"status": "error", "raw": "empty response"}

    # если вдруг модель всё равно вернула ```json
    if text.startswith("```"):
        text = text.split("```")[1]

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {
            "status": "error",
            "raw": text
        }

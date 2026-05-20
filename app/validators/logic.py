import json
from llm.groq_client import call_groq

HISTORY_PATH = "memory/scenes/history.json"

def load_history():
    try:
        with open(HISTORY_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def save_scene(scene_text: str):
    history = load_history()
    history.append(scene_text)
    with open(HISTORY_PATH, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)

def validate_logic(universe: str, scene_text: str) -> dict:
    history = load_history()[-5:]  # последние 5 сцен

    prompt = f"""
Ты проверяешь логику сцены в контексте истории.

ПРЕДЫДУЩИЕ СЦЕНЫ:
{history}

ТЕКУЩАЯ СЦЕНА:
{scene_text}

Верни JSON:
{{
  "status": "ok | warning | error",
  "issues": [{{"description": str, "severity": float}}],
  "summary": str
}}
"""

    raw = call_groq(prompt)

    try:
        result = json.loads(raw)
        save_scene(scene_text)
        return result
    except Exception:
        return {
            "status": "error",
            "issues": [{"description": "Invalid LLM response", "severity": 1.0}],
            "summary": raw[:200]
        }

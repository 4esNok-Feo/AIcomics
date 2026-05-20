import json
from llm.groq_client import call_groq

def score_scene(scene_text: str) -> dict:
    prompt = f"""
Оцени сцену по 5 параметрам от 0 до 10:
- логика
- характеры
- драматургия
- темп
- ясность

Верни JSON:
{{
 "total": int,
 "details": {{
   "logic": int,
   "characters": int,
   "drama": int,
   "pace": int,
   "clarity": int
 }},
 "comment": str
}}

ТЕКСТ:
{scene_text}
"""

    raw = call_groq(prompt)
    try:
        return json.loads(raw)
    except Exception:
        return {"total": 0, "details": {}, "comment": "Scoring failed"}

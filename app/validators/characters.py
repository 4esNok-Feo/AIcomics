import json
from llm.groq_client import call_groq
from memory.character_memory import load_characters, update_character

def validate_characters(universe: str, scene_text: str) -> dict:
    characters = load_characters()

    prompt = f"""
Персонажи:
{json.dumps(characters, ensure_ascii=False)}

ТЕКСТ:
{scene_text}

Проверь:
- соответствует ли поведение прошлым действиям
- не нарушен ли характер

Верни JSON:
{{
 "status": "ok | warning | error",
 "issues": [],
 "summary": str,
 "character_updates": {{
   "Имя": "краткое новое действие"
 }}
}}
"""

    raw = call_groq(prompt)

    try:
        result = json.loads(raw)

        for name, action in result.get("character_updates", {}).items():
            update_character(name, action)

        return result
    except Exception:
        return {
            "status": "error",
            "issues": [],
            "summary": "Character analysis failed"
        }

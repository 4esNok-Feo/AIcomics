from llm.groq_client import call_groq

def suggest_edits(scene_text: str, issues: list) -> dict:
    prompt = f"""
Есть проблемы:
{issues}

Предложи улучшенную версию сцены.
Сохрани стиль.

Верни JSON:
{{
 "edited_text": str,
 "changes_summary": str
}}

ТЕКСТ:
{scene_text}
"""

    raw = call_groq(prompt)
    try:
        return json.loads(raw)
    except Exception:
        return {"edited_text": scene_text, "changes_summary": "No edits"}

import os

CANON_PATH = "memory/canon"

def load_canon() -> str:
    texts = []
    for fname in os.listdir(CANON_PATH):
        path = os.path.join(CANON_PATH, fname)
        if path.endswith(".txt"):
            with open(path, "r", encoding="utf-8") as f:
                texts.append(f.read())
    return "\n".join(texts)

def validate_canon(universe: str, scene_text: str) -> dict:
    canon = load_canon()

    issues = []

    for rule in canon.splitlines():
        if rule.strip() and rule.lower() in scene_text.lower():
            issues.append({
                "description": f"Potential canon violation: {rule}",
                "severity": 0.5
            })

    return {
        "status": "warning" if issues else "ok",
        "issues": issues,
        "summary": "Canon check completed"
    }

import json
import os

CHAR_PATH = "memory/characters"

def load_characters():
    characters = {}
    for file in os.listdir(CHAR_PATH):
        if file.endswith(".json"):
            with open(os.path.join(CHAR_PATH, file), "r", encoding="utf-8") as f:
                data = json.load(f)
                characters[data["name"]] = data
    return characters

def update_character(name: str, action: str):
    path = os.path.join(CHAR_PATH, f"{name.lower()}.json")
    if not os.path.exists(path):
        return

    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    data["last_actions"].append(action)
    data["last_actions"] = data["last_actions"][-10:]

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

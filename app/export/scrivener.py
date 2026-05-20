def export_txt(scene_text: str, filename="scene.txt"):
    with open(filename, "w", encoding="utf-8") as f:
        f.write(scene_text)

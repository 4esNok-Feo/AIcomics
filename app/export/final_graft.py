def export_fdx(scene_text: str, filename="scene.fdx"):
    content = f"""<?xml version="1.0" encoding="UTF-8"?>
<FinalDraft DocumentType="Script">
<Content>
<Paragraph Type="Scene Heading">
<Text>{scene_text}</Text>
</Paragraph>
</Content>
</FinalDraft>
"""
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)

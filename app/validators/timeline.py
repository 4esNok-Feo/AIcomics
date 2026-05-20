def validate_timeline(scenes: list) -> dict:
    """
    Проверяет, что сцены идут в логической последовательности
    """
    issues = []
    for i, scene in enumerate(scenes[:-1]):
        next_scene = scenes[i+1]
        # Простейший пример: сцена 2 не должна предшествовать сцене 1
        if next_scene["scene_number"] < scene["scene_number"]:
            issues.append({
                "description": f"Сцена {next_scene['scene_number']} идет перед сценой {scene['scene_number']}",
                "severity": 1
            })
    return {
        "status": "ok" if not issues else "warning",
        "issues": issues,
        "summary": f"{len(issues)} timeline issues found"
    }

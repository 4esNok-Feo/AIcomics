import asyncio
from fastapi import FastAPI
from pydantic import BaseModel

from validators.logic import validate_logic
from validators.canon import validate_canon
from validators.characters import validate_characters
from validators.score import score_scene
from dotenv import load_dotenv
load_dotenv()
import os
os.environ["GROQ_API_KEY"] = "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"


app = FastAPI()

class SceneRequest(BaseModel):
    universe: str
    scene_text: str
    scene_number: int

async def run_safe(func, *args):
    loop = asyncio.get_event_loop()
    try:
        return await loop.run_in_executor(None, func, *args)
    except Exception as e:
        return {
            "status": "error",
            "issues": [{"description": str(e), "severity": 1.0}],
            "summary": "Validator crashed"
        }

@app.post("/analyze")
async def analyze_scene(data: SceneRequest):
    canon, characters, logic = await asyncio.gather(
        run_safe(validate_canon, data.universe, data.scene_text),
        run_safe(validate_characters, data.universe, data.scene_text),
        run_safe(validate_logic, data.universe, data.scene_text)
    )
    score = await run_safe(score_scene, data.scene_text)

    return {
        "canon": canon,
        "characters": characters,
        "logic": logic
    }

@app.post("/scenes/analyze")
async def analyze_scene(data: SceneRequest, editor: bool = False):
    pass

from pydantic import BaseModel
from typing import List


class AnalyzeSceneResponse(BaseModel):
    suggestions: List[str]
    dialogue_options: List[str]
    notes: List[str]

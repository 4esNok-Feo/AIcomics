from pydantic import BaseModel
from uuid import UUID
from typing import List


class SceneIn(BaseModel):
    universe_id: UUID
    title: str
    location: str
    time: str
    characters: List[UUID]
    goal: str
    conflict: str
    emotional_tone: str
    text: str
    outcome: str

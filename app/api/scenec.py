from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import uuid

router = APIRouter(tags=["scenes"])


class Scene(BaseModel):
    id: str
    world_id: str
    title: str
    goal: str = ""
    conflict: str = ""
    text: str = ""


# временное хранилище
SCENES: list[Scene] = []


@router.get("/worlds/{world_id}/scenes", response_model=List[Scene])
def get_scenes(world_id: str):
    return [s for s in SCENES if s.world_id == world_id]


class CreateSceneRequest(BaseModel):
    title: str


@router.post("/worlds/{world_id}/scenes", response_model=Scene)
def create_scene(world_id: str, data: CreateSceneRequest):
    scene = Scene(
        id=str(uuid.uuid4()),
        world_id=world_id,
        title=data.title,
    )
    SCENES.append(scene)
    return scene


@router.get("/scenes/{scene_id}", response_model=Scene)
def get_scene(scene_id: str):
    for s in SCENES:
        if s.id == scene_id:
            return s
    return None

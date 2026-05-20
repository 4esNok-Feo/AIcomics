from fastapi import APIRouter, Depends

from schemas.scene import SceneIn
from schemas.response import AnalyzeSceneResponse

from domain.scene import Scene
from use_cases.analyze_scene import AnalyzeSceneUseCase

router = APIRouter(prefix="/scenes", tags=["Scenes"])


@router.post("/analyze", response_model=AnalyzeSceneResponse)
def analyze_scene(
    payload: SceneIn,
    use_case: AnalyzeSceneUseCase = Depends()
):
    scene = Scene(**payload.dict())

    result = use_case.execute(scene)

    return AnalyzeSceneResponse(
        suggestions=result.suggestions,
        dialogue_options=result.dialogue_options,
        notes=result.notes
    )

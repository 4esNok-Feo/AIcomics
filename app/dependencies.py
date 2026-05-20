from services.memory_engine import MemoryEngine
from services.logic_validator import LogicValidator
from services.llm_orchestrator import LLMOrchestrator
from use_cases.analyze_scene import AnalyzeSceneUseCase


def get_analyze_scene_use_case() -> AnalyzeSceneUseCase:
    return AnalyzeSceneUseCase(
        memory=MemoryEngine(...),
        validator=LogicValidator(),
        orchestrator=LLMOrchestrator()
    )

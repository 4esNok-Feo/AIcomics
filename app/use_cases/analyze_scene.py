from uuid import UUID

from services.memory_engine import MemoryEngine
from services.logic_validator import LogicValidator
from services.llm_orchestrator import LLMOrchestrator, LLMResponse
from domain.scene import Scene


class AnalyzeSceneUseCase:

    def __init__(
        self,
        memory: MemoryEngine,
        validator: LogicValidator,
        orchestrator: LLMOrchestrator
    ):
        self.memory = memory
        self.validator = validator
        self.orchestrator = orchestrator

    def execute(self, scene: Scene) -> LLMResponse:
        # 1. Память
        universe = self.memory.load_universe(scene.universe_id)
        characters = self.memory.load_characters(scene.universe_id)

        # 2. Логика
        issues = self.validator.validate(scene, characters)

        # 3. ИИ-подсказки
        llm_response = self.orchestrator.analyze_scene(
            universe=universe,
            characters=characters,
            scene=scene,
            issues=issues
        )

        return llm_response

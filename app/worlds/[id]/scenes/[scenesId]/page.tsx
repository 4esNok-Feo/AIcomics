import SceneWorkspace from "@/components/SceneWorkspace";
import { getScene, getSceneVersions } from "@/lib/api";

type PageProps = {
  params: Promise<{
    id: string;
    scenesId: string;
  }>;
};

export default async function ScenePage({ params }: PageProps) {
  const { scenesId } = await params;

  const scene = await getScene(scenesId);
  const versions = await getSceneVersions(scenesId);

  return (
    <SceneWorkspace
      sceneId={scenesId}
      initialScene={{
        goal: scene.goal,
        conflict: scene.conflict,
        emotional_tone: scene.emotional_tone,
        text: scene.text,
        outcome: scene.outcome,
      }}
      versions={versions}
    />
  );
}

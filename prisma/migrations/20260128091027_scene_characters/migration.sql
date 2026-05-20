-- CreateTable
CREATE TABLE "SceneCharacter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sceneId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    CONSTRAINT "SceneCharacter_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SceneCharacter_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SceneCharacter_sceneId_characterId_key" ON "SceneCharacter"("sceneId", "characterId");

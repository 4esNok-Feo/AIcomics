-- CreateTable
CREATE TABLE "CharacterState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "characterId" TEXT NOT NULL,
    "sceneId" TEXT,
    "emotion" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "stressLevel" INTEGER NOT NULL DEFAULT 0,
    "relationships" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CharacterState_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CharacterState_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CharacterState_characterId_idx" ON "CharacterState"("characterId");

-- CreateIndex
CREATE INDEX "CharacterState_sceneId_idx" ON "CharacterState"("sceneId");

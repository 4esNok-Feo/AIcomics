/*
  Warnings:

  - Added the required column `updatedAt` to the `CharacterState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `worldId` to the `CharacterState` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CharacterState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "characterId" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "sceneId" TEXT,
    "emotion" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "stressLevel" INTEGER NOT NULL DEFAULT 0,
    "relationships" TEXT,
    "emotionalState" TEXT,
    "memorySummary" TEXT,
    "memoryVersion" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CharacterState_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CharacterState_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CharacterState" ("characterId", "createdAt", "emotion", "goal", "id", "relationships", "sceneId", "stressLevel") SELECT "characterId", "createdAt", "emotion", "goal", "id", "relationships", "sceneId", "stressLevel" FROM "CharacterState";
DROP TABLE "CharacterState";
ALTER TABLE "new_CharacterState" RENAME TO "CharacterState";
CREATE INDEX "CharacterState_characterId_idx" ON "CharacterState"("characterId");
CREATE INDEX "CharacterState_sceneId_idx" ON "CharacterState"("sceneId");
CREATE UNIQUE INDEX "CharacterState_characterId_worldId_key" ON "CharacterState"("characterId", "worldId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

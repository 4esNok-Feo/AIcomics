/*
  Warnings:

  - You are about to drop the column `text` on the `SceneVersion` table. All the data in the column will be lost.
  - Added the required column `content` to the `SceneVersion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `SceneVersion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `SceneVersion` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SceneVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sceneId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SceneVersion_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SceneVersion" ("createdAt", "id", "sceneId") SELECT "createdAt", "id", "sceneId" FROM "SceneVersion";
DROP TABLE "SceneVersion";
ALTER TABLE "new_SceneVersion" RENAME TO "SceneVersion";
CREATE INDEX "SceneVersion_sceneId_idx" ON "SceneVersion"("sceneId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

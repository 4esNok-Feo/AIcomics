/*
  Warnings:

  - Made the column `content` on table `Scene` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Scene" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Scene_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "World" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Scene" ("content", "createdAt", "id", "title", "worldId") SELECT "content", "createdAt", "id", "title", "worldId" FROM "Scene";
DROP TABLE "Scene";
ALTER TABLE "new_Scene" RENAME TO "Scene";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

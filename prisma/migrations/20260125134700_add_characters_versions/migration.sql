/*
  Warnings:

  - You are about to drop the column `fears` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `goals` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Scene` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `SceneVersion` table. All the data in the column will be lost.
  - You are about to drop the column `genre` on the `World` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `World` table. All the data in the column will be lost.
  - You are about to drop the column `tone` on the `World` table. All the data in the column will be lost.
  - Added the required column `text` to the `Scene` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `World` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `World` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Character" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "personality" TEXT,
    "backstory" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Character_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "World" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Character" ("id", "name", "personality", "role", "worldId") SELECT "id", "name", "personality", "role", "worldId" FROM "Character";
DROP TABLE "Character";
ALTER TABLE "new_Character" RENAME TO "Character";
CREATE TABLE "new_Scene" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Scene_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "World" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Scene" ("createdAt", "id", "title", "worldId") SELECT "createdAt", "id", "title", "worldId" FROM "Scene";
DROP TABLE "Scene";
ALTER TABLE "new_Scene" RENAME TO "Scene";
CREATE TABLE "new_SceneVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sceneId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SceneVersion_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SceneVersion" ("createdAt", "id", "sceneId", "text") SELECT "createdAt", "id", "sceneId", "text" FROM "SceneVersion";
DROP TABLE "SceneVersion";
ALTER TABLE "new_SceneVersion" RENAME TO "SceneVersion";
CREATE TABLE "new_World" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_World" ("createdAt", "description", "id") SELECT "createdAt", "description", "id" FROM "World";
DROP TABLE "World";
ALTER TABLE "new_World" RENAME TO "World";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

/*
  Warnings:

  - You are about to drop the column `backstory` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Scene` table. All the data in the column will be lost.
  - Added the required column `age` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `behavior` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quirks` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Made the column `personality` on table `Character` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Character" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "personality" TEXT NOT NULL,
    "behavior" TEXT NOT NULL,
    "quirks" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Character_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "World" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Character" ("createdAt", "id", "name", "personality", "worldId") SELECT "createdAt", "id", "name", "personality", "worldId" FROM "Character";
DROP TABLE "Character";
ALTER TABLE "new_Character" RENAME TO "Character";
CREATE TABLE "new_Scene" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "worldId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Scene_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "World" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Scene" ("createdAt", "id", "title", "worldId") SELECT "createdAt", "id", "title", "worldId" FROM "Scene";
DROP TABLE "Scene";
ALTER TABLE "new_Scene" RENAME TO "Scene";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Character" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "personality" TEXT NOT NULL,
    "behavior" TEXT NOT NULL,
    "traits" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Character_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "World" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Character" ("age", "behavior", "createdAt", "id", "name", "personality", "traits", "worldId") SELECT "age", "behavior", "createdAt", "id", "name", "personality", "traits", "worldId" FROM "Character";
DROP TABLE "Character";
ALTER TABLE "new_Character" RENAME TO "Character";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

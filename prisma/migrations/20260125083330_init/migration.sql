-- CreateTable
CREATE TABLE "World" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "genre" TEXT,
    "tone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "personality" TEXT,
    "goals" TEXT,
    "fears" TEXT,
    "notes" TEXT,
    CONSTRAINT "Character_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "World" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Scene" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Scene_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "World" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SceneVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sceneId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SceneVersion_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

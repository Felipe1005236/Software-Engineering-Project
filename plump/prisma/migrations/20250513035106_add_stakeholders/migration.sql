/*
  Warnings:

  - You are about to drop the column `organizationID` on the `Project` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Stakeholder" (
    "stakeholderID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "team" TEXT NOT NULL,
    "projectID" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Stakeholder_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project" ("projectID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "projectID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "teamID" INTEGER NOT NULL,
    CONSTRAINT "Project_teamID_fkey" FOREIGN KEY ("teamID") REFERENCES "Team" ("teamID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("phase", "projectID", "status", "teamID", "title") SELECT "phase", "projectID", "status", "teamID", "title" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_teamID_key" ON "Project"("teamID");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

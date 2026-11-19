/*
  Warnings:

  - You are about to drop the column `role` on the `Stakeholder` table. All the data in the column will be lost.
  - You are about to drop the column `team` on the `Stakeholder` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Stakeholder" (
    "stakeholderID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "projectID" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Stakeholder_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project" ("projectID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Stakeholder" ("createdAt", "name", "projectID", "stakeholderID", "updatedAt") SELECT "createdAt", "name", "projectID", "stakeholderID", "updatedAt" FROM "Stakeholder";
DROP TABLE "Stakeholder";
ALTER TABLE "new_Stakeholder" RENAME TO "Stakeholder";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

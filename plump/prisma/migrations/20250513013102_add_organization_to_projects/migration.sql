/*
  Warnings:

  - Added the required column `organizationID` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- First, get the first organization ID to use as default
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "projectID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "teamID" INTEGER NOT NULL,
    "organizationID" INTEGER NOT NULL,
    CONSTRAINT "Project_teamID_key" UNIQUE ("teamID"),
    CONSTRAINT "Project_organizationID_fkey" FOREIGN KEY ("organizationID") REFERENCES "Organization" ("organizationID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_teamID_fkey" FOREIGN KEY ("teamID") REFERENCES "Team" ("teamID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Copy data from old table to new table, using the first organization as default
INSERT INTO "new_Project" ("projectID", "title", "status", "phase", "teamID", "organizationID")
SELECT p."projectID", p."title", p."status", p."phase", p."teamID", 
       (SELECT o."organizationID" FROM "Organization" o LIMIT 1)
FROM "Project" p;

-- Drop the old table and rename the new one
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";

-- Recreate the unique index
CREATE UNIQUE INDEX "Project_teamID_key" ON "Project"("teamID");

PRAGMA foreign_keys=ON;

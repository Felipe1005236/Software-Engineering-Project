/*
  Warnings:

  - You are about to drop the column `manager` on the `Unit` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Unit" (
    "unitID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "managerID" INTEGER,
    "organizationID" INTEGER NOT NULL,
    CONSTRAINT "Unit_managerID_fkey" FOREIGN KEY ("managerID") REFERENCES "User" ("userID") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Unit_organizationID_fkey" FOREIGN KEY ("organizationID") REFERENCES "Organization" ("organizationID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Unit" ("description", "name", "organizationID", "unitID") SELECT "description", "name", "organizationID", "unitID" FROM "Unit";
DROP TABLE "Unit";
ALTER TABLE "new_Unit" RENAME TO "Unit";
CREATE UNIQUE INDEX "Unit_managerID_key" ON "Unit"("managerID");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

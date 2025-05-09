/*
  Warnings:

  - You are about to drop the `_TeamToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `description` on the `TimeTracking` table. All the data in the column will be lost.
  - You are about to drop the column `taskID` on the `TimeTracking` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `unitManager` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_TeamToUser_B_index";

-- DropIndex
DROP INDEX "_TeamToUser_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_TeamToUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Organization" (
    "organizationID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Unit" (
    "unitID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "manager" TEXT NOT NULL,
    "organizationID" INTEGER NOT NULL,
    CONSTRAINT "Unit_organizationID_fkey" FOREIGN KEY ("organizationID") REFERENCES "Organization" ("organizationID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeamMembership" (
    "membershipID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userID" INTEGER NOT NULL,
    "teamID" INTEGER NOT NULL,
    "teamRole" TEXT NOT NULL DEFAULT 'TEAM_MEMBER',
    "accessLevel" TEXT NOT NULL DEFAULT 'READ_ONLY',
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TeamMembership_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("userID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TeamMembership_teamID_fkey" FOREIGN KEY ("teamID") REFERENCES "Team" ("teamID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TimeTracking" (
    "timeTrackingID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userID" INTEGER NOT NULL,
    "projectID" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "dateWorked" DATETIME NOT NULL,
    "dateRecorded" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hoursSpent" REAL NOT NULL,
    CONSTRAINT "TimeTracking_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project" ("projectID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TimeTracking_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("userID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TimeTracking" ("dateRecorded", "dateWorked", "hoursSpent", "projectID", "role", "timeTrackingID", "userID") SELECT "dateRecorded", "dateWorked", "hoursSpent", "projectID", "role", "timeTrackingID", "userID" FROM "TimeTracking";
DROP TABLE "TimeTracking";
ALTER TABLE "new_TimeTracking" RENAME TO "TimeTracking";
CREATE UNIQUE INDEX "TimeTracking_userID_projectID_dateWorked_key" ON "TimeTracking"("userID", "projectID", "dateWorked");
CREATE TABLE "new_User" (
    "userID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "unitID" INTEGER,
    "activationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "primaryRole" TEXT NOT NULL DEFAULT 'USER',
    "type" TEXT NOT NULL DEFAULT 'INTERNAL',
    CONSTRAINT "User_unitID_fkey" FOREIGN KEY ("unitID") REFERENCES "Unit" ("unitID") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("activationDate", "active", "address", "email", "firstName", "lastName", "phone", "primaryRole", "type", "userID") SELECT "activationDate", "active", "address", "email", "firstName", "lastName", "phone", "primaryRole", "type", "userID" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "TeamMembership_userID_teamID_key" ON "TeamMembership"("userID", "teamID");

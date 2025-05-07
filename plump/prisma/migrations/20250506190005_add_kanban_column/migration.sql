/*
  Warnings:

  - You are about to drop the column `budgetID` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `dateID` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `healthID` on the `Project` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Comment" (
    "commentID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" INTEGER NOT NULL,
    "projectID" INTEGER NOT NULL,
    CONSTRAINT "Comment_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("userID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project" ("projectID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KanbanColumn" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "projectID" INTEGER NOT NULL,
    CONSTRAINT "KanbanColumn_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project" ("projectID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Budget" (
    "budgetID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectID" INTEGER NOT NULL,
    "totalBudget" REAL NOT NULL,
    "actualCost" REAL NOT NULL,
    "forecastCost" REAL NOT NULL,
    CONSTRAINT "Budget_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project" ("projectID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Budget" ("actualCost", "budgetID", "forecastCost", "projectID", "totalBudget") SELECT "actualCost", "budgetID", "forecastCost", "projectID", "totalBudget" FROM "Budget";
DROP TABLE "Budget";
ALTER TABLE "new_Budget" RENAME TO "Budget";
CREATE UNIQUE INDEX "Budget_projectID_key" ON "Budget"("projectID");
CREATE TABLE "new_HealthStatus" (
    "healthID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectID" INTEGER NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'GREEN',
    "schedule" TEXT NOT NULL DEFAULT 'GREEN',
    "cost" TEXT NOT NULL DEFAULT 'GREEN',
    "resource" TEXT NOT NULL DEFAULT 'GREEN',
    "overall" TEXT NOT NULL DEFAULT 'GREEN',
    CONSTRAINT "HealthStatus_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project" ("projectID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_HealthStatus" ("cost", "healthID", "overall", "projectID", "resource", "schedule", "scope") SELECT "cost", "healthID", "overall", "projectID", "resource", "schedule", "scope" FROM "HealthStatus";
DROP TABLE "HealthStatus";
ALTER TABLE "new_HealthStatus" RENAME TO "HealthStatus";
CREATE UNIQUE INDEX "HealthStatus_projectID_key" ON "HealthStatus"("projectID");
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
CREATE TABLE "new_ProjectDates" (
    "dateID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "targetDate" DATETIME NOT NULL,
    "startDate" DATETIME NOT NULL,
    "actualCompletion" DATETIME,
    "projectID" INTEGER NOT NULL,
    CONSTRAINT "ProjectDates_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project" ("projectID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProjectDates" ("actualCompletion", "dateID", "projectID", "startDate", "targetDate") SELECT "actualCompletion", "dateID", "projectID", "startDate", "targetDate" FROM "ProjectDates";
DROP TABLE "ProjectDates";
ALTER TABLE "new_ProjectDates" RENAME TO "ProjectDates";
CREATE UNIQUE INDEX "ProjectDates_projectID_key" ON "ProjectDates"("projectID");
CREATE TABLE "new_Task" (
    "taskID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectID" INTEGER NOT NULL,
    "dateID" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "percentageComplete" REAL NOT NULL,
    "priority" TEXT NOT NULL,
    "userID" INTEGER NOT NULL,
    "details" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "kanbanColumnId" INTEGER,
    CONSTRAINT "Task_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project" ("projectID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_dateID_fkey" FOREIGN KEY ("dateID") REFERENCES "TaskDates" ("dateID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("userID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_kanbanColumnId_fkey" FOREIGN KEY ("kanbanColumnId") REFERENCES "KanbanColumn" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("dateID", "details", "percentageComplete", "priority", "projectID", "status", "taskID", "title", "userID") SELECT "dateID", "details", "percentageComplete", "priority", "projectID", "status", "taskID", "title", "userID" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE UNIQUE INDEX "Task_dateID_key" ON "Task"("dateID");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

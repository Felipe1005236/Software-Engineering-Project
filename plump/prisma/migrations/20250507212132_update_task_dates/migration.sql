-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "taskID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectID" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "percentageComplete" REAL NOT NULL,
    "priority" TEXT NOT NULL,
    "userID" INTEGER NOT NULL,
    "details" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "targetDate" DATETIME NOT NULL,
    "actualCompletion" DATETIME,
    CONSTRAINT "Task_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project" ("projectID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("userID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("actualCompletion", "details", "percentageComplete", "priority", "projectID", "startDate", "status", "targetDate", "taskID", "title", "userID") SELECT "actualCompletion", "details", "percentageComplete", "priority", "projectID", "startDate", "status", "targetDate", "taskID", "title", "userID" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateTable
CREATE TABLE "User" (
    "userID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "unitManager" TEXT NOT NULL,
    "activationDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "primaryRole" TEXT NOT NULL DEFAULT 'USER',
    "type" TEXT NOT NULL DEFAULT 'INTERNAL'
);

-- CreateTable
CREATE TABLE "Team" (
    "teamID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdOn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Project" (
    "projectID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "teamID" INTEGER NOT NULL,
    "healthID" INTEGER NOT NULL,
    "budgetID" INTEGER NOT NULL,
    "dateID" INTEGER NOT NULL,
    CONSTRAINT "Project_teamID_fkey" FOREIGN KEY ("teamID") REFERENCES "Team" ("teamID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_healthID_fkey" FOREIGN KEY ("healthID") REFERENCES "HealthStatus" ("healthID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_budgetID_fkey" FOREIGN KEY ("budgetID") REFERENCES "Budget" ("budgetID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_dateID_fkey" FOREIGN KEY ("dateID") REFERENCES "ProjectDates" ("dateID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Budget" (
    "budgetID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectID" INTEGER NOT NULL,
    "totalBudget" REAL NOT NULL,
    "actualCost" REAL NOT NULL,
    "forecastCost" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "HealthStatus" (
    "healthID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectID" INTEGER NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'GREEN',
    "schedule" TEXT NOT NULL DEFAULT 'GREEN',
    "cost" TEXT NOT NULL DEFAULT 'GREEN',
    "resource" TEXT NOT NULL DEFAULT 'GREEN',
    "overall" TEXT NOT NULL DEFAULT 'GREEN'
);

-- CreateTable
CREATE TABLE "ProjectDates" (
    "dateID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "targetDate" DATETIME NOT NULL,
    "startDate" DATETIME NOT NULL,
    "actualCompletion" DATETIME,
    "projectID" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Task" (
    "taskID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectID" INTEGER NOT NULL,
    "dateID" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "percentageComplete" REAL NOT NULL,
    "priority" TEXT NOT NULL,
    "userID" INTEGER NOT NULL,
    "details" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Task_projectID_fkey" FOREIGN KEY ("projectID") REFERENCES "Project" ("projectID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_dateID_fkey" FOREIGN KEY ("dateID") REFERENCES "TaskDates" ("dateID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("userID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TaskDates" (
    "dateID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "targetDate" DATETIME NOT NULL,
    "startDate" DATETIME NOT NULL,
    "actualCompletion" DATETIME,
    "taskID" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_TeamToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_TeamToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Team" ("teamID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TeamToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("userID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Project_teamID_key" ON "Project"("teamID");

-- CreateIndex
CREATE UNIQUE INDEX "Project_healthID_key" ON "Project"("healthID");

-- CreateIndex
CREATE UNIQUE INDEX "Project_budgetID_key" ON "Project"("budgetID");

-- CreateIndex
CREATE UNIQUE INDEX "Project_dateID_key" ON "Project"("dateID");

-- CreateIndex
CREATE UNIQUE INDEX "Budget_projectID_key" ON "Budget"("projectID");

-- CreateIndex
CREATE UNIQUE INDEX "HealthStatus_projectID_key" ON "HealthStatus"("projectID");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectDates_projectID_key" ON "ProjectDates"("projectID");

-- CreateIndex
CREATE UNIQUE INDEX "Task_dateID_key" ON "Task"("dateID");

-- CreateIndex
CREATE UNIQUE INDEX "TaskDates_taskID_key" ON "TaskDates"("taskID");

-- CreateIndex
CREATE UNIQUE INDEX "_TeamToUser_AB_unique" ON "_TeamToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TeamToUser_B_index" ON "_TeamToUser"("B");

/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "password" TEXT NOT NULL,
    CONSTRAINT "User_unitID_fkey" FOREIGN KEY ("unitID") REFERENCES "Unit" ("unitID") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("activationDate", "active", "address", "email", "firstName", "lastName", "phone", "primaryRole", "type", "unitID", "userID") SELECT "activationDate", "active", "address", "email", "firstName", "lastName", "phone", "primaryRole", "type", "unitID", "userID" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

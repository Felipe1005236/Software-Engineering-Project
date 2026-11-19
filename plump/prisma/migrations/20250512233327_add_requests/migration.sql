-- CreateTable
CREATE TABLE "Request" (
    "requestID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "organizationID" INTEGER NOT NULL,
    "unitID" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Request_organizationID_fkey" FOREIGN KEY ("organizationID") REFERENCES "Organization" ("organizationID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Request_unitID_fkey" FOREIGN KEY ("unitID") REFERENCES "Unit" ("unitID") ON DELETE RESTRICT ON UPDATE CASCADE
);

/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `checkPoint` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `process` on the `Result` table. All the data in the column will be lost.
  - Added the required column `result` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detail` to the `Target` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Profile_userId_key";

-- DropIndex
DROP INDEX "User_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Profile";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Result" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamId" INTEGER NOT NULL,
    "targetId" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "result" TEXT NOT NULL,
    CONSTRAINT "Result_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Result_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Result" ("id", "status", "targetId", "teamId") SELECT "id", "status", "targetId", "teamId" FROM "Result";
DROP TABLE "Result";
ALTER TABLE "new_Result" RENAME TO "Result";
CREATE TABLE "new_Target" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "description" TEXT,
    "deadline" DATETIME,
    "detail" TEXT NOT NULL,
    "evaluationMethods" INTEGER
);
INSERT INTO "new_Target" ("deadline", "description", "id", "title") SELECT "deadline", "description", "id", "title" FROM "Target";
DROP TABLE "Target";
ALTER TABLE "new_Target" RENAME TO "Target";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

/*
  Warnings:

  - Added the required column `resultPoint` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detailPoint` to the `Target` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Result" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamId" INTEGER NOT NULL,
    "targetId" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "result" TEXT NOT NULL,
    "resultPoint" INTEGER NOT NULL,
    CONSTRAINT "Result_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Result_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Result" ("id", "result", "status", "targetId", "teamId") SELECT "id", "result", "status", "targetId", "teamId" FROM "Result";
DROP TABLE "Result";
ALTER TABLE "new_Result" RENAME TO "Result";
CREATE TABLE "new_Target" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "description" TEXT,
    "deadline" DATETIME,
    "detail" TEXT NOT NULL,
    "detailPoint" INTEGER NOT NULL,
    "evaluationMethods" INTEGER
);
INSERT INTO "new_Target" ("deadline", "description", "detail", "evaluationMethods", "id", "title") SELECT "deadline", "description", "detail", "evaluationMethods", "id", "title" FROM "Target";
DROP TABLE "Target";
ALTER TABLE "new_Target" RENAME TO "Target";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

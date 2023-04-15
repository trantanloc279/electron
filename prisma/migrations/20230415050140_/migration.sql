-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Target" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "description" TEXT,
    "deadline" DATETIME,
    "detail" TEXT NOT NULL,
    "detailPoint" INTEGER,
    "evaluationMethods" INTEGER
);
INSERT INTO "new_Target" ("deadline", "description", "detail", "detailPoint", "evaluationMethods", "id", "title") SELECT "deadline", "description", "detail", "detailPoint", "evaluationMethods", "id", "title" FROM "Target";
DROP TABLE "Target";
ALTER TABLE "new_Target" RENAME TO "Target";
CREATE TABLE "new_Result" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamId" INTEGER NOT NULL,
    "targetId" INTEGER NOT NULL,
    "status" INTEGER NOT NULL,
    "result" TEXT,
    "resultPoint" INTEGER,
    CONSTRAINT "Result_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Result_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Result" ("id", "result", "resultPoint", "status", "targetId", "teamId") SELECT "id", "result", "resultPoint", "status", "targetId", "teamId" FROM "Result";
DROP TABLE "Result";
ALTER TABLE "new_Result" RENAME TO "Result";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

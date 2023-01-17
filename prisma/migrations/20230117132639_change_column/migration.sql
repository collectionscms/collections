-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Superfast_Relation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "many_collection" TEXT,
    "many_field" TEXT,
    "one_collection" TEXT,
    "one_field" TEXT,
    "one_collection_field" TEXT,
    "one_allowed_collections" TEXT,
    "junction_field" TEXT,
    "sort_field" TEXT,
    "one_deselect_action" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Superfast_Relation" ("createdAt", "id", "junction_field", "many_collection", "many_field", "one_allowed_collections", "one_collection", "one_collection_field", "one_deselect_action", "one_field", "sort_field", "updatedAt") SELECT "createdAt", "id", "junction_field", "many_collection", "many_field", "one_allowed_collections", "one_collection", "one_collection_field", "one_deselect_action", "one_field", "sort_field", "updatedAt" FROM "Superfast_Relation";
DROP TABLE "Superfast_Relation";
ALTER TABLE "new_Superfast_Relation" RENAME TO "Superfast_Relation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

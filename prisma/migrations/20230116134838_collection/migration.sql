-- CreateTable
CREATE TABLE "Superfast_Collection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "collection" TEXT NOT NULL,
    "singleton" BOOLEAN NOT NULL DEFAULT false,
    "hidden" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Superfast_Field" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "collection" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "special" TEXT,
    "interface" TEXT,
    "readonly" BOOLEAN NOT NULL,
    "required" BOOLEAN NOT NULL,
    "hidden" BOOLEAN NOT NULL,
    "sort" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Superfast_FieldOption" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "superfast_FieldId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Superfast_FieldOption_superfast_FieldId_fkey" FOREIGN KEY ("superfast_FieldId") REFERENCES "Superfast_Field" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Superfast_Relation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "many_collection" TEXT NOT NULL,
    "many_field" TEXT NOT NULL,
    "one_collection" TEXT NOT NULL,
    "one_field" TEXT NOT NULL,
    "one_collection_field" TEXT NOT NULL,
    "one_allowed_collections" TEXT NOT NULL,
    "junction_field" TEXT NOT NULL,
    "sort_field" TEXT NOT NULL,
    "one_deselect_action" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Superfast_Collection_collection_key" ON "Superfast_Collection"("collection");

-- CreateIndex
CREATE UNIQUE INDEX "Superfast_Field_collection_key" ON "Superfast_Field"("collection");

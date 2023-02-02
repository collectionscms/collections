-- CreateTable
CREATE TABLE "Superfast_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "userName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT,
    "superfastRoleId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Superfast_User_superfastRoleId_fkey" FOREIGN KEY ("superfastRoleId") REFERENCES "Superfast_Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Superfast_Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "adminAccess" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Superfast_Permission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "collection" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "superfastRoleId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Superfast_Permission_superfastRoleId_fkey" FOREIGN KEY ("superfastRoleId") REFERENCES "Superfast_Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
CREATE TABLE "Superfast_Field_Option" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "superfastFieldId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Superfast_Field_Option_superfastFieldId_fkey" FOREIGN KEY ("superfastFieldId") REFERENCES "Superfast_Field" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Superfast_Relation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "many_collection" TEXT NOT NULL,
    "many_field" TEXT NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "Superfast_User_email_key" ON "Superfast_User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Superfast_Role_name_key" ON "Superfast_Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Superfast_Collection_collection_key" ON "Superfast_Collection"("collection");

-- CreateIndex
CREATE UNIQUE INDEX "Superfast_Field_id_collection_key" ON "Superfast_Field"("id", "collection");

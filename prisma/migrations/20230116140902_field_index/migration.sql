/*
  Warnings:

  - A unique constraint covering the columns `[id,collection]` on the table `Superfast_Field` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Superfast_Field_collection_key";

-- CreateIndex
CREATE UNIQUE INDEX "Superfast_Field_id_collection_key" ON "Superfast_Field"("id", "collection");

/*
  Warnings:

  - A unique constraint covering the columns `[projectId,name]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tag_projectId_name_key" ON "Tag"("projectId", "name");

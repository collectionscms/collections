/*
  Warnings:

  - Added the required column `draftKey` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `draftKey` to the `ContentRevision` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "draftKey" VARCHAR(255) NOT NULL DEFAULT substring(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "ContentRevision" ADD COLUMN     "draftKey" VARCHAR(255) NOT NULL DEFAULT substring(md5(random()::text), 1, 10);

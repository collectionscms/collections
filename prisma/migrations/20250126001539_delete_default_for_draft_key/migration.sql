-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "draftKey" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ContentRevision" ALTER COLUMN "draftKey" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "draftKey" SET DEFAULT substring(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "ContentRevision" ALTER COLUMN "draftKey" SET DEFAULT substring(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "isInit" BOOLEAN NOT NULL DEFAULT false;

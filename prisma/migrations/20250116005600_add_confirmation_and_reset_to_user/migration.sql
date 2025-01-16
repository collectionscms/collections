/*
  Warnings:

  - A unique constraint covering the columns `[provider,email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "draftKey" SET DEFAULT substring(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "ContentRevision" ALTER COLUMN "draftKey" SET DEFAULT substring(md5(random()::text), 1, 10);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "confirmationToken" VARCHAR(255),
ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "resetPasswordExpiration" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "User_provider_email_key" ON "User"("provider", "email");

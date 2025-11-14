/*
  Warnings:

  - You are about to drop the column `OauthId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "OauthId",
ADD COLUMN     "ProviderAuthId" TEXT;

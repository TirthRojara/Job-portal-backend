/*
  Warnings:

  - You are about to drop the column `type` on the `AuthOTP` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."AuthOTP" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "OauthId" TEXT,
ADD COLUMN     "authType" "public"."AuthType" NOT NULL DEFAULT 'EMAIL';

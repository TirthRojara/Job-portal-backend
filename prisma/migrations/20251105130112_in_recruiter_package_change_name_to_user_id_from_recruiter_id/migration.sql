/*
  Warnings:

  - You are about to drop the column `recruiterId` on the `RecruiterPackage` table. All the data in the column will be lost.
  - Added the required column `userId` to the `RecruiterPackage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."RecruiterPackage" DROP CONSTRAINT "RecruiterPackage_recruiterId_fkey";

-- AlterTable
ALTER TABLE "public"."RecruiterPackage" DROP COLUMN "recruiterId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."RecruiterPackage" ADD CONSTRAINT "RecruiterPackage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

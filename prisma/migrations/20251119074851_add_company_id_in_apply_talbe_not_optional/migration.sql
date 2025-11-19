/*
  Warnings:

  - Made the column `companyId` on table `Apply` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Apply" DROP CONSTRAINT "Apply_companyId_fkey";

-- AlterTable
ALTER TABLE "public"."Apply" ALTER COLUMN "companyId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Apply" ADD CONSTRAINT "Apply_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

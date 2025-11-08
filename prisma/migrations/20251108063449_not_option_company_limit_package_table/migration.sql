/*
  Warnings:

  - Made the column `companyLimit` on table `Package` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Package" ALTER COLUMN "companyLimit" SET NOT NULL;

/*
  Warnings:

  - Made the column `planId` on table `Package` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Package" ALTER COLUMN "planId" SET NOT NULL;

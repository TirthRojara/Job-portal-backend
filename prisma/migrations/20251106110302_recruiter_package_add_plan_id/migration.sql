/*
  Warnings:

  - Added the required column `planId` to the `RecruiterPackage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."RecruiterPackage" ADD COLUMN     "planId" TEXT NOT NULL;

/*
  Warnings:

  - Added the required column `level` to the `CandidateLanguage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Level" AS ENUM ('NATIVE', 'FLUENT', 'BASIC');

-- AlterTable
ALTER TABLE "public"."CandidateLanguage" ADD COLUMN     "level" "public"."Level" NOT NULL;

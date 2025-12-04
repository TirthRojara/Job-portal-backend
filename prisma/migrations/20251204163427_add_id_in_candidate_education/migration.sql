/*
  Warnings:

  - The primary key for the `CandidateEducation` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "public"."CandidateEducation" DROP CONSTRAINT "CandidateEducation_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "CandidateEducation_pkey" PRIMARY KEY ("id");

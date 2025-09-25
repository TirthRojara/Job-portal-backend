/*
  Warnings:

  - A unique constraint covering the columns `[id,candidateProfileId]` on the table `CandidateExperience` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CandidateExperience_id_candidateProfileId_key" ON "public"."CandidateExperience"("id", "candidateProfileId");

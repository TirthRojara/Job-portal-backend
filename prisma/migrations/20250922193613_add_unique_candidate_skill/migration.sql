/*
  Warnings:

  - A unique constraint covering the columns `[candidateProfileId,skillId]` on the table `CandidateSkill` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CandidateSkill_candidateProfileId_skillId_key" ON "public"."CandidateSkill"("candidateProfileId", "skillId");

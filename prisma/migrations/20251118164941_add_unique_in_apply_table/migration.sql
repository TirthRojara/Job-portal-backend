/*
  Warnings:

  - A unique constraint covering the columns `[candidateProfileId,jobId]` on the table `Apply` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Apply_candidateProfileId_jobId_key" ON "public"."Apply"("candidateProfileId", "jobId");

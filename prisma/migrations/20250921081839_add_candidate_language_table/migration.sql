-- CreateTable
CREATE TABLE "public"."CandidateLanguage" (
    "candidateProfileId" INTEGER NOT NULL,
    "languageName" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CandidateLanguage_candidateProfileId_languageName_key" ON "public"."CandidateLanguage"("candidateProfileId", "languageName");

-- AddForeignKey
ALTER TABLE "public"."CandidateLanguage" ADD CONSTRAINT "CandidateLanguage_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "public"."CandidateProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidateLanguage" ADD CONSTRAINT "CandidateLanguage_languageName_fkey" FOREIGN KEY ("languageName") REFERENCES "public"."Language"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

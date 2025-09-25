-- CreateEnum
CREATE TYPE "public"."Degree" AS ENUM ('BACHELOR', 'MASTER', 'PHD');

-- CreateTable
CREATE TABLE "public"."CandidateEducation" (
    "major" TEXT NOT NULL,
    "degree" "public"."Degree" NOT NULL DEFAULT 'BACHELOR',
    "yearStart" INTEGER NOT NULL,
    "yearEnd" INTEGER NOT NULL,
    "candidateProfileId" INTEGER NOT NULL,
    "educationId" INTEGER NOT NULL,

    CONSTRAINT "CandidateEducation_pkey" PRIMARY KEY ("candidateProfileId","educationId")
);

-- AddForeignKey
ALTER TABLE "public"."CandidateEducation" ADD CONSTRAINT "CandidateEducation_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "public"."CandidateProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CandidateEducation" ADD CONSTRAINT "CandidateEducation_educationId_fkey" FOREIGN KEY ("educationId") REFERENCES "public"."Education"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

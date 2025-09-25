-- CreateEnum
CREATE TYPE "public"."WorkPlace" AS ENUM ('ONSITE', 'REMOTE', 'HYBRID');

-- CreateTable
CREATE TABLE "public"."CandidateExperience" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "position" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "currentlyWorking" BOOLEAN NOT NULL DEFAULT false,
    "workPlace" "public"."WorkPlace" NOT NULL DEFAULT 'ONSITE',
    "location" TEXT NOT NULL,
    "candidateProfileId" INTEGER NOT NULL,

    CONSTRAINT "CandidateExperience_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CandidateExperience" ADD CONSTRAINT "CandidateExperience_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "public"."CandidateProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

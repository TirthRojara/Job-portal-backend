-- CreateEnum
CREATE TYPE "public"."ApplyStatus" AS ENUM ('PENDING', 'VIEWED', 'SELECTED', 'NOTSELECT', 'INTOUCH');

-- CreateTable
CREATE TABLE "public"."Apply" (
    "applyDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."ApplyStatus" NOT NULL DEFAULT 'PENDING',
    "candidateProfileId" INTEGER NOT NULL,
    "jobId" INTEGER NOT NULL,

    CONSTRAINT "Apply_pkey" PRIMARY KEY ("candidateProfileId","jobId")
);

-- AddForeignKey
ALTER TABLE "public"."Apply" ADD CONSTRAINT "Apply_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "public"."CandidateProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Apply" ADD CONSTRAINT "Apply_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

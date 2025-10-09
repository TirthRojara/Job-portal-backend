-- CreateTable
CREATE TABLE "public"."JobBenefit" (
    "jobId" INTEGER NOT NULL,
    "benefitName" TEXT NOT NULL,

    CONSTRAINT "JobBenefit_pkey" PRIMARY KEY ("jobId","benefitName")
);

-- AddForeignKey
ALTER TABLE "public"."JobBenefit" ADD CONSTRAINT "JobBenefit_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JobBenefit" ADD CONSTRAINT "JobBenefit_benefitName_fkey" FOREIGN KEY ("benefitName") REFERENCES "public"."Benefit"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "public"."RecruiterPackage" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATE NOT NULL,
    "recruiterId" INTEGER NOT NULL,
    "packageId" INTEGER NOT NULL,

    CONSTRAINT "RecruiterPackage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."RecruiterPackage" ADD CONSTRAINT "RecruiterPackage_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecruiterPackage" ADD CONSTRAINT "RecruiterPackage_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

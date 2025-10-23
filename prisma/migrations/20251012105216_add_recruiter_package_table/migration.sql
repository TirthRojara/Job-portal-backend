-- CreateTable
CREATE TABLE "public"."RecruiterPackage" (
    "id" SERIAL NOT NULL,
    "startDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATE NOT NULL,
    "recruiterId" INTEGER NOT NULL,
    "packageId" INTEGER NOT NULL,

    CONSTRAINT "RecruiterPackage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecruiterPackage_recruiterId_packageId_key" ON "public"."RecruiterPackage"("recruiterId", "packageId");

-- AddForeignKey
ALTER TABLE "public"."RecruiterPackage" ADD CONSTRAINT "RecruiterPackage_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecruiterPackage" ADD CONSTRAINT "RecruiterPackage_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

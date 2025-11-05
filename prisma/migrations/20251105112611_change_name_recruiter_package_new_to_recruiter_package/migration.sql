/*
  Warnings:

  - You are about to drop the `RecruiterPackageNew` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."RecruiterPackageNew" DROP CONSTRAINT "RecruiterPackageNew_packageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RecruiterPackageNew" DROP CONSTRAINT "RecruiterPackageNew_recruiterId_fkey";

-- DropTable
DROP TABLE "public"."RecruiterPackageNew";

-- CreateTable
CREATE TABLE "public"."RecruiterPackage" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATE NOT NULL,
    "razorpaySubscriptionId" TEXT,
    "status" "public"."RecruiterPackageStatus" NOT NULL,
    "billingCycleCount" INTEGER DEFAULT 0,
    "recruiterId" INTEGER NOT NULL,
    "packageId" INTEGER NOT NULL,

    CONSTRAINT "RecruiterPackage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecruiterPackage_razorpaySubscriptionId_key" ON "public"."RecruiterPackage"("razorpaySubscriptionId");

-- AddForeignKey
ALTER TABLE "public"."RecruiterPackage" ADD CONSTRAINT "RecruiterPackage_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecruiterPackage" ADD CONSTRAINT "RecruiterPackage_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

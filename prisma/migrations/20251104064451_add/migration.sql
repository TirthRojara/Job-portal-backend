/*
  Warnings:

  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecruiterPackage` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."RecruiterPackageStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('SUCCESSFUL', 'FAILED', 'REFUNDED');

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_packageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_recruiterId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RecruiterPackage" DROP CONSTRAINT "RecruiterPackage_packageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RecruiterPackage" DROP CONSTRAINT "RecruiterPackage_recruiterId_fkey";

-- DropTable
DROP TABLE "public"."Order";

-- DropTable
DROP TABLE "public"."RecruiterPackage";

-- DropEnum
DROP TYPE "public"."OrderStatus";

-- CreateTable
CREATE TABLE "public"."RecruiterPackageNew" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATE NOT NULL,
    "razorpaySubscriptionId" TEXT,
    "status" "public"."RecruiterPackageStatus" NOT NULL,
    "billingCycleCount" INTEGER DEFAULT 0,
    "recruiterId" INTEGER NOT NULL,
    "packageId" INTEGER NOT NULL,

    CONSTRAINT "RecruiterPackageNew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" SERIAL NOT NULL,
    "razorpaySubscriptionId" TEXT NOT NULL,
    "razorpayPlanId" TEXT NOT NULL,
    "status" "public"."SubscriptionStatus" NOT NULL,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "totalCount" INTEGER,
    "paidCount" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "packageId" INTEGER NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentHistory" (
    "id" SERIAL NOT NULL,
    "razorpayPaymentId" TEXT,
    "razorpaySubscriptionId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "public"."PaymentStatus" NOT NULL,
    "paymentMethod" TEXT,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecruiterPackageNew_razorpaySubscriptionId_key" ON "public"."RecruiterPackageNew"("razorpaySubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_razorpaySubscriptionId_key" ON "public"."Subscription"("razorpaySubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentHistory_razorpayPaymentId_key" ON "public"."PaymentHistory"("razorpayPaymentId");

-- AddForeignKey
ALTER TABLE "public"."RecruiterPackageNew" ADD CONSTRAINT "RecruiterPackageNew_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecruiterPackageNew" ADD CONSTRAINT "RecruiterPackageNew_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "public"."Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentHistory" ADD CONSTRAINT "PaymentHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

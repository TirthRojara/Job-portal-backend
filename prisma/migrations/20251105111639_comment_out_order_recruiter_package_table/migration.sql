/*
  Warnings:

  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecruiterPackage` table. If the table is not empty, all the data it contains will be lost.

*/
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

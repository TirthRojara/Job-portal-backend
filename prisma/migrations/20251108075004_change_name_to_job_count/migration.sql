/*
  Warnings:

  - You are about to drop the column `currentJobPosts` on the `CheckLimitForRecruiter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."CheckLimitForRecruiter" DROP COLUMN "currentJobPosts",
ADD COLUMN     "jobCount" INTEGER NOT NULL DEFAULT 0;

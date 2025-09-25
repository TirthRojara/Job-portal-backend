/*
  Warnings:

  - Changed the type of `teamSizeLabel` on the `Company` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Company" DROP COLUMN "teamSizeLabel",
ADD COLUMN     "teamSizeLabel" "public"."TeamSizeRange" NOT NULL;

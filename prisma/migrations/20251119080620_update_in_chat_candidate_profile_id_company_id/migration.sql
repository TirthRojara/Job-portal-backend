/*
  Warnings:

  - You are about to drop the column `candidateId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `recruiterId` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `candidateProfileId` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Chat" DROP COLUMN "candidateId",
DROP COLUMN "recruiterId",
ADD COLUMN     "candidateProfileId" INTEGER NOT NULL,
ADD COLUMN     "companyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "public"."CandidateProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

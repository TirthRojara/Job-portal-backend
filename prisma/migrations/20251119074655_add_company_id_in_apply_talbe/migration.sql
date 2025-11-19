-- AlterTable
ALTER TABLE "public"."Apply" ADD COLUMN     "companyId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Apply" ADD CONSTRAINT "Apply_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

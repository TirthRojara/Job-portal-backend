-- CreateTable
CREATE TABLE "public"."CompanyImage" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "CompanyImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CompanyImage" ADD CONSTRAINT "CompanyImage_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "public"."CheckLimitForRecruiter" (
    "id" SERIAL NOT NULL,
    "currentJobPosts" INTEGER NOT NULL DEFAULT 0,
    "recruiterId" INTEGER NOT NULL,

    CONSTRAINT "CheckLimitForRecruiter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CheckLimitForRecruiter_recruiterId_key" ON "public"."CheckLimitForRecruiter"("recruiterId");

-- AddForeignKey
ALTER TABLE "public"."CheckLimitForRecruiter" ADD CONSTRAINT "CheckLimitForRecruiter_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

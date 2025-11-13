/*
  Warnings:

  - A unique constraint covering the columns `[email,isVerified]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."User_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_email_isVerified_key" ON "public"."User"("email", "isVerified");

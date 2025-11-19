/*
  Warnings:

  - The primary key for the `Apply` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "public"."Apply" DROP CONSTRAINT "Apply_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Apply_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "public"."Chat" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "recruiterId" INTEGER NOT NULL,
    "messages" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

/*
  Warnings:

  - A unique constraint covering the columns `[chatRoomId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Chat_chatRoomId_key" ON "public"."Chat"("chatRoomId");

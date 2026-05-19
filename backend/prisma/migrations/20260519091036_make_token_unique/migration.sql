/*
  Warnings:

  - A unique constraint covering the columns `[unsubscribeToken]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_unsubscribeToken_key" ON "user"("unsubscribeToken");

/*
  Warnings:

  - You are about to drop the column `userId` on the `Postcard` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `Postcard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Postcard" DROP COLUMN "userId",
ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "receiverId" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "xp" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Postcard" ADD CONSTRAINT "Postcard_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Postcard" ADD CONSTRAINT "Postcard_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

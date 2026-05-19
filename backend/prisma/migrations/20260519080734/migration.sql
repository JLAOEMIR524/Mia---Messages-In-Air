-- AlterTable
ALTER TABLE "user" ADD COLUMN     "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "unsubscribeToken" TEXT NOT NULL DEFAULT '';

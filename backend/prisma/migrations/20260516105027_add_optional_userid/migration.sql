-- CreateTable
CREATE TABLE "Postcard" (
    "id" SERIAL NOT NULL,
    "questId" INTEGER,
    "image" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "receiverAddress" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,

    CONSTRAINT "Postcard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Postcard" ADD CONSTRAINT "Postcard_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

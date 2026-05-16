-- CreateTable
CREATE TABLE "Sticker" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "requiredXp" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "Sticker_pkey" PRIMARY KEY ("id")
);

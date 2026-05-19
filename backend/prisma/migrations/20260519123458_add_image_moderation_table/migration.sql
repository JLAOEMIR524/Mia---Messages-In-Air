-- CreateTable
CREATE TABLE "moderated_image" (
    "id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moderated_image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "moderated_image_hash_key" ON "moderated_image"("hash");

-- CreateIndex
CREATE INDEX "moderated_image_userId_idx" ON "moderated_image"("userId");

-- CreateIndex
CREATE INDEX "moderated_image_createdAt_idx" ON "moderated_image"("createdAt");

-- AddForeignKey
ALTER TABLE "moderated_image" ADD CONSTRAINT "moderated_image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

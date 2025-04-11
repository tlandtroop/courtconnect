/*
  Warnings:

  - You are about to drop the column `rating` on the `Court` table. All the data in the column will be lost.
  - You are about to drop the column `courtsVisited` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gamesPlayed` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `winRate` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[googlePlaceId]` on the table `Court` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Court" DROP COLUMN "rating",
ADD COLUMN     "googlePlaceId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "courtsVisited",
DROP COLUMN "gamesPlayed",
DROP COLUMN "rating",
DROP COLUMN "winRate";

-- CreateIndex
CREATE UNIQUE INDEX "Court_googlePlaceId_key" ON "Court"("googlePlaceId");

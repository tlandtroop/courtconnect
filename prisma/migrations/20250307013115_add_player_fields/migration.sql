/*
  Warnings:

  - You are about to drop the column `hasLights` on the `Court` table. All the data in the column will be lost.
  - You are about to drop the column `hasRestrooms` on the `Court` table. All the data in the column will be lost.
  - You are about to drop the column `hasWaterFountain` on the `Court` table. All the data in the column will be lost.
  - You are about to drop the column `isBasketball` on the `Court` table. All the data in the column will be lost.
  - You are about to drop the column `isPickleball` on the `Court` table. All the data in the column will be lost.
  - The primary key for the `Game` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `_UserFavorites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserFavorites" DROP CONSTRAINT "_UserFavorites_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserFavorites" DROP CONSTRAINT "_UserFavorites_B_fkey";

-- AlterTable
ALTER TABLE "Court" DROP COLUMN "hasLights",
DROP COLUMN "hasRestrooms",
DROP COLUMN "hasWaterFountain",
DROP COLUMN "isBasketball",
DROP COLUMN "isPickleball",
ADD COLUMN     "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "courtType" TEXT,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Game" DROP CONSTRAINT "Game_pkey",
ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'scheduled',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "courtId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Game_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Game_id_seq";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "skillLevel" TEXT NOT NULL DEFAULT 'beginner',
ADD COLUMN     "winRate" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
ALTER COLUMN "rating" SET DEFAULT 2.5;

-- DropTable
DROP TABLE "_UserFavorites";

-- CreateTable
CREATE TABLE "_CourtToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourtToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GameParticipants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GameParticipants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CourtToUser_B_index" ON "_CourtToUser"("B");

-- CreateIndex
CREATE INDEX "_GameParticipants_B_index" ON "_GameParticipants"("B");

-- CreateIndex
CREATE INDEX "Court_city_state_idx" ON "Court"("city", "state");

-- CreateIndex
CREATE INDEX "Court_latitude_longitude_idx" ON "Court"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "Game_date_idx" ON "Game"("date");

-- CreateIndex
CREATE INDEX "Game_courtId_idx" ON "Game"("courtId");

-- CreateIndex
CREATE INDEX "Game_organizerId_idx" ON "Game"("organizerId");

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "User"("clerkId");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "Court"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourtToUser" ADD CONSTRAINT "_CourtToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Court"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourtToUser" ADD CONSTRAINT "_CourtToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameParticipants" ADD CONSTRAINT "_GameParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameParticipants" ADD CONSTRAINT "_GameParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

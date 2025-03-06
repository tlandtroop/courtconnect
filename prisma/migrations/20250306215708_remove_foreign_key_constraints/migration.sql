/*
  Warnings:

  - The primary key for the `Game` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Game` table. All the data in the column will be lost.
  - The `id` column on the `Game` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `_GameParticipants` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `courtId` on the `Game` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_courtId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_organizerId_fkey";

-- DropForeignKey
ALTER TABLE "_GameParticipants" DROP CONSTRAINT "_GameParticipants_A_fkey";

-- DropForeignKey
ALTER TABLE "_GameParticipants" DROP CONSTRAINT "_GameParticipants_B_fkey";

-- AlterTable
ALTER TABLE "Game" DROP CONSTRAINT "Game_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "endTime",
DROP COLUMN "updatedAt",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "courtId",
ADD COLUMN     "courtId" INTEGER NOT NULL,
ADD CONSTRAINT "Game_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "_GameParticipants";

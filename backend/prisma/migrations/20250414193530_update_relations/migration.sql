/*
  Warnings:

  - The primary key for the `Test` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `Test` table. All the data in the column will be lost.
  - You are about to drop the column `questions` on the `Test` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Test` table. All the data in the column will be lost.
  - The `id` column on the `Test` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `name` to the `Test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Test` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `testId` on the `TestResult` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "TestResult" DROP CONSTRAINT "TestResult_testId_fkey";

-- AlterTable
ALTER TABLE "Test" DROP CONSTRAINT "Test_pkey",
DROP COLUMN "description",
DROP COLUMN "questions",
DROP COLUMN "title",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Test_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TestResult" DROP COLUMN "testId",
ADD COLUMN     "testId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

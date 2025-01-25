/*
  Warnings:

  - Added the required column `test` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "test" TEXT NOT NULL;

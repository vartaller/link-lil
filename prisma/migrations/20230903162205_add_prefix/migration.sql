/*
  Warnings:

  - Added the required column `prefix` to the `Streamer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Streamer` ADD COLUMN `prefix` VARCHAR(191) NOT NULL;

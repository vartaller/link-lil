/*
  Warnings:

  - You are about to drop the column `long_url` on the `url` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[full_url]` on the table `url` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `url_long_url_key` ON `url`;

-- AlterTable
ALTER TABLE `url` DROP COLUMN `long_url`,
    ADD COLUMN `full_url` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `url_full_url_key` ON `url`(`full_url`);

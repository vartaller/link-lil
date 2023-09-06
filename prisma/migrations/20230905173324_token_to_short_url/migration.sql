/*
  Warnings:

  - You are about to drop the column `token` on the `url` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[short_url]` on the table `url` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `url_token_key` ON `url`;

-- AlterTable
ALTER TABLE `url` DROP COLUMN `token`,
    ADD COLUMN `short_url` VARCHAR(191) NULL,
    MODIFY `long_url` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `url_short_url_key` ON `url`(`short_url`);

/*
  Warnings:

  - You are about to drop the `Streamer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Streamer`;

-- CreateTable
CREATE TABLE `url` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prefix` VARCHAR(191) NULL,
    `long_url` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `url_long_url_key`(`long_url`),
    UNIQUE INDEX `url_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

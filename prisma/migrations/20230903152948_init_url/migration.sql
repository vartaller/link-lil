-- CreateTable
CREATE TABLE `Streamer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `long_url` VARCHAR(191) NOT NULL,
    `short_url` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Streamer_long_url_key`(`long_url`),
    UNIQUE INDEX `Streamer_short_url_key`(`short_url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

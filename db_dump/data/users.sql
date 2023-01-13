-- Adminer 4.6.3 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

USE `awegust`;

INSERT INTO `users` (`id`, `username`, `password`, `email`, `first_name`, `last_name`, `phone`, `image`, `cms`, `role`, `is_activated`, `token`, `created_at`, `updated_at`, `deleted_at`, `is_permanent`) VALUES
(1,	'admin.biboy',	'password123',	'boybi.oyales@gmail.com',	'Biboy',	'Oyales',	'4085553739',	49,	1,	'',	0,	'wIMhjpQDtKa6iGuN4RkltOb4y5rn0xv86aIkL3vlagr4m9zA8HDmXWNFIOEI8RUKgfKmAoyU6Db',	NULL,	'2020-08-29 14:27:29',	NULL,	1)
ON DUPLICATE KEY UPDATE `id` = VALUES(`id`), `username` = VALUES(`username`), `password` = VALUES(`password`), `email` = VALUES(`email`), `first_name` = VALUES(`first_name`), `last_name` = VALUES(`last_name`), `phone` = VALUES(`phone`), `image` = VALUES(`image`), `cms` = VALUES(`cms`), `role` = VALUES(`role`), `is_activated` = VALUES(`is_activated`), `token` = VALUES(`token`), `created_at` = VALUES(`created_at`), `updated_at` = VALUES(`updated_at`), `deleted_at` = VALUES(`deleted_at`), `is_permanent` = VALUES(`is_permanent`);

-- 2020-09-19 07:24:50

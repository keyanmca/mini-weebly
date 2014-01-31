CREATE DATABASE `mini-weebly`;

DROP TABLE IF EXISTS `mini-weebly`.`users`;
CREATE TABLE `mini-weebly`.`users` (
	`userId` INTEGER NOT NULL AUTO_INCREMENT,
	`userName` VARCHAR(256) NOT NULL,
	`password` VARCHAR(256),
	`created_at` TIMESTAMP,
	`is_deleted` TINYINT DEFAULT 0,
	PRIMARY KEY (`userId`)
);

DROP TABLE IF EXISTS `mini-weebly`.`templates`;
CREATE TABLE `mini-weebly`.`templates` (
	`templateId` INTEGER NOT NULL AUTO_INCREMENT,
	`userId` INTEGER NOT NULL,
	`name` VARCHAR(256) NOT NULL,
	`created_at` TIMESTAMP,
	`is_deleted` TINYINT DEFAULT 0,
	PRIMARY KEY (`templateId`),
	FOREIGN KEY (`userId`) REFERENCES `users`(`userId`)
);


DROP TABLE IF EXISTS `mini-weebly`.`template-versions`;
CREATE TABLE `mini-weebly`.`template-versions` (
	`templateId` INTEGER NOT NULL,
	`version` INTEGER NOT NULL,
	`body` TEXT NOT NULL,
	`created_at` TIMESTAMP,
	`hash` VARCHAR(50),
	PRIMARY KEY (`templateId`, `version`),
	FOREIGN KEY (`templateId`) REFERENCES `templates`(`templateId`)
);


DROP TABLE IF EXISTS `mini-weebly`.`pages`;
CREATE TABLE `mini-weebly`.`pages` (
	`pageId` INTEGER NOT NULL,
	`name` VARCHAR(256) NOT NULL,
	`created_at` TIMESTAMP,
	`is_deleted` TINYINT DEFAULT 0,
	PRIMARY KEY (`pageId`)
);



DROP TABLE IF EXISTS `mini-weebly`.`page-versions`;
CREATE TABLE `mini-weebly`.`page-versions` (
	`pageId` INTEGER NOT NULL,
	`version` INTEGER NOT NULL,
	`body` TEXT NOT NULL,
	`created_at` TIMESTAMP,
	`hash` VARCHAR(50),
	PRIMARY KEY (`pageId`, `version`),
	FOREIGN KEY (`pageId`) REFERENCES `pages`(`pageId`)
);



INSERT INTO `users` (`userId`, `userName`) VALUES (1, 'test');
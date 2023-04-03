-- Database name: db_airbnb

-- Adminer 4.8.1 MySQL 8.0.31 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `Address`;
CREATE TABLE `Address` (
  `addressId` int NOT NULL AUTO_INCREMENT,
  `addressName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `province` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `addressImage` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`addressId`),
  UNIQUE KEY `Address_addressId_key` (`addressId`),
  UNIQUE KEY `Address_addressImage_key` (`addressImage`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Address` (`addressId`, `addressName`, `province`, `country`, `addressImage`) VALUES
(1,	'address1',	'province1',	'country1',	NULL),
(2,	'address1',	'province1',	'country1',	'/public/img/address/1679993057576_address1.jpg'),
(3,	'address1',	'province1',	'country1',	'/public/img/address/1680406019051_address1.jpg'),
(4,	'address1',	'province1',	'country1',	'/public/img/address/1679977177704_address1.jpg'),
(6,	'address1',	'province1',	'country2',	'/public/img/address/1679992808526_address1.jpg');

DROP TABLE IF EXISTS `BookRoom`;
CREATE TABLE `BookRoom` (
  `bookRoomId` int NOT NULL AUTO_INCREMENT,
  `userBookId` int NOT NULL,
  `roomBookedId` int NOT NULL,
  `checkinDate` date NOT NULL,
  `checkoutDate` date NOT NULL,
  `totalGuests` int NOT NULL,
  PRIMARY KEY (`bookRoomId`),
  UNIQUE KEY `BookRoom_bookRoomId_key` (`bookRoomId`),
  KEY `BookRoom_userBookId_fkey` (`userBookId`),
  KEY `BookRoom_roomBookedId_fkey` (`roomBookedId`),
  CONSTRAINT `BookRoom_roomBookedId_fkey` FOREIGN KEY (`roomBookedId`) REFERENCES `Room` (`roomId`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `BookRoom_userBookId_fkey` FOREIGN KEY (`userBookId`) REFERENCES `User` (`userId`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `BookRoom` (`bookRoomId`, `userBookId`, `roomBookedId`, `checkinDate`, `checkoutDate`, `totalGuests`) VALUES
(5,	2,	5,	'2023-04-01',	'2023-04-01',	2);

DROP TABLE IF EXISTS `Comment`;
CREATE TABLE `Comment` (
  `commentId` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `commentedAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `userCommentId` int NOT NULL,
  `roomCommentedId` int NOT NULL,
  PRIMARY KEY (`commentId`),
  UNIQUE KEY `Comment_commentId_key` (`commentId`),
  KEY `Comment_userCommentId_fkey` (`userCommentId`),
  KEY `Comment_roomCommentedId_fkey` (`roomCommentedId`),
  CONSTRAINT `Comment_roomCommentedId_fkey` FOREIGN KEY (`roomCommentedId`) REFERENCES `Room` (`roomId`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Comment_userCommentId_fkey` FOREIGN KEY (`userCommentId`) REFERENCES `User` (`userId`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Comment` (`commentId`, `content`, `commentedAt`, `userCommentId`, `roomCommentedId`) VALUES
(3,	'very good!!',	'2023-04-02 03:43:31.703',	2,	5);

DROP TABLE IF EXISTS `Room`;
CREATE TABLE `Room` (
  `roomId` int NOT NULL AUTO_INCREMENT,
  `roomName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int NOT NULL,
  `totalBedrooms` int NOT NULL,
  `totalBeds` int NOT NULL,
  `totalBathrooms` int NOT NULL,
  `hasWashingMachine` tinyint(1) NOT NULL,
  `hasIron` tinyint(1) NOT NULL,
  `hasTv` tinyint(1) NOT NULL,
  `hasAirCon` tinyint(1) NOT NULL,
  `hasWifi` tinyint(1) NOT NULL,
  `hasKitchen` tinyint(1) NOT NULL,
  `hasParkingLot` tinyint(1) NOT NULL,
  `hasPool` tinyint(1) NOT NULL,
  `roomImage` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ownerId` int NOT NULL,
  `locationId` int NOT NULL,
  PRIMARY KEY (`roomId`),
  UNIQUE KEY `Room_roomId_key` (`roomId`),
  UNIQUE KEY `Room_roomImage_key` (`roomImage`),
  KEY `Room_ownerId_fkey` (`ownerId`),
  KEY `Room_locationId_fkey` (`locationId`),
  CONSTRAINT `Room_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Address` (`addressId`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Room_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User` (`userId`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Room` (`roomId`, `roomName`, `description`, `price`, `totalBedrooms`, `totalBeds`, `totalBathrooms`, `hasWashingMachine`, `hasIron`, `hasTv`, `hasAirCon`, `hasWifi`, `hasKitchen`, `hasParkingLot`, `hasPool`, `roomImage`, `ownerId`, `locationId`) VALUES
(5,	'roomName1',	'description1',	10,	3,	1,	1,	0,	0,	0,	0,	0,	0,	0,	0,	'/public/img/room/1680406478638_room1.jpg',	3,	2);

DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'MALE',
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  PRIMARY KEY (`userId`),
  UNIQUE KEY `User_userId_key` (`userId`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `User` (`userId`, `userName`, `email`, `password`, `phone`, `birthday`, `avatar`, `gender`, `role`) VALUES
(1,	'a',	'a@a.a',	'$2b$10$K2fXTMYxqqsiW0shgMmSy.jE24JKt5Ltb2FO.Dvh2ZJNdbIqX7dke',	'0311111111',	'2000-01-01',	NULL,	'MALE',	'ADMIN'),
(2,	'bb',	'b@a.a',	'$2b$10$oCkErDhMInTKdcAfELe6FOnRyaeBHZWYqTV5q/NCAB.1rDT9drfWO',	'0311111112',	'2000-01-02',	'/public/img/avatar/1680407241329_avatar1.png',	'FEMALE',	'USER'),
(3,	'c',	'c@a.a',	'$2b$10$RxJad2Pwisb8Sy6LjMBK3.HVXBmy6mHX2W6Yl30HN.dMKqlgIYe5i',	'0311111113',	'2000-01-03',	NULL,	'FEMALE',	'USER');

-- 2023-04-03 08:56:36
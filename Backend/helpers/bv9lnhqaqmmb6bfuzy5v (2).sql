-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: bv9lnhqaqmmb6bfuzy5v-mysql.services.clever-cloud.com:3306
-- Generation Time: Dec 10, 2024 at 07:32 AM
-- Server version: 8.0.22-13
-- PHP Version: 8.2.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bv9lnhqaqmmb6bfuzy5v`
--

-- --------------------------------------------------------

--
-- Table structure for table `adminlogs`
--

CREATE TABLE `adminlogs` (
  `log_id` int NOT NULL,
  `admin_id` int DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `adminlogs`
--

INSERT INTO `adminlogs` (`log_id`, `admin_id`, `action`, `timestamp`) VALUES
(1, 2, 'เพิ่มสินค้า', '2024-09-23 06:09:33');

-- --------------------------------------------------------

--
-- Table structure for table `area_calculation_history`
--

CREATE TABLE `area_calculation_history` (
  `calculation_id` int NOT NULL,
  `assignment_id` int DEFAULT NULL,
  `location_name` varchar(255) DEFAULT NULL,
  `width` decimal(10,2) NOT NULL,
  `height` decimal(10,2) NOT NULL,
  `air_conditioners_needed` decimal(10,2) DEFAULT NULL,
  `area_type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `area_calculation_history`
--

INSERT INTO `area_calculation_history` (`calculation_id`, `assignment_id`, `location_name`, `width`, `height`, `air_conditioners_needed`, `area_type`) VALUES
(1, 1, 'ห้องประชุม มธ', 200.00, 500.00, 3.00, 'ห้องประชุม\r\n'),
(2, 1, 'test', 5.00, 5.00, 2.00, 'ห้องนอนปกติ - ไม่โดนแดดโดยตรง');

-- --------------------------------------------------------

--
-- Table structure for table `attributes`
--

CREATE TABLE `attributes` (
  `attribute_id` int NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `attributes`
--

INSERT INTO `attributes` (`attribute_id`, `name`) VALUES
(1, 'BTU1'),
(2, 'Model');

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `brand_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`brand_id`, `name`, `description`) VALUES
(1, 'Haier', 'ไฮเออร์1');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `name`, `description`) VALUES
(1, 'AC', 'Airconditioner'),
(2, 'อะไหล่', 'อะไหล่ใน AC'),
(3, 'พัดลม', 'พัดลมไอน้ำ');

-- --------------------------------------------------------

--
-- Table structure for table `equipment_borrowing`
--

CREATE TABLE `equipment_borrowing` (
  `borrowing_id` int NOT NULL,
  `tech_id` int NOT NULL,
  `product_id` int NOT NULL,
  `borrow_date` datetime NOT NULL,
  `return_date` datetime DEFAULT NULL,
  `task_id` int NOT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `equipment_borrowing`
--

INSERT INTO `equipment_borrowing` (`borrowing_id`, `tech_id`, `product_id`, `borrow_date`, `return_date`, `task_id`, `image_url`) VALUES
(18, 1, 3, '2024-11-20 12:17:00', '2024-11-21 12:17:00', 200, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1731993458/image/borrowed-equipment/ijbcbp7cdlufdxmzm0yb.jpg'),
(19, 1, 7, '2024-11-22 12:20:00', '2024-11-23 12:20:00', 201, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1731993626/image/borrowed-equipment/k4jef9ayaef3ytjlikzp.jpg'),
(20, 1, 3, '2024-11-14 10:33:00', '2024-11-15 10:33:00', 203, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1732073653/image/borrowed-equipment/gt6r0usftexvy32gbvl9.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `gender`
--

CREATE TABLE `gender` (
  `gender_id` int NOT NULL,
  `gender_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `gender`
--

INSERT INTO `gender` (`gender_id`, `gender_name`) VALUES
(1, 'Male'),
(2, 'Female');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT '0.00',
  `task_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `product_name` varchar(50) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `total_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `task_id` int DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `order_id` int DEFAULT NULL,
  `status_id` int NOT NULL DEFAULT '1',
  `image_url` varchar(255) DEFAULT NULL,
  `method_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `user_id`, `task_id`, `amount`, `order_id`, `status_id`, `image_url`, `method_id`, `created_at`) VALUES
(1, 6, 26, 500.00, NULL, 2, NULL, 1, '2024-09-30 18:49:37'),
(16, 6, 26, 500.00, NULL, 1, NULL, 1, '2024-11-19 07:25:54');

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `method_id` int NOT NULL,
  `method_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `payment_methods`
--

INSERT INTO `payment_methods` (`method_id`, `method_name`) VALUES
(1, 'bank_transfer\r\n'),
(2, 'cash');

-- --------------------------------------------------------

--
-- Table structure for table `productattributes`
--

CREATE TABLE `productattributes` (
  `product_attribute_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `attribute_id` int DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `productattributes`
--

INSERT INTO `productattributes` (`product_attribute_id`, `product_id`, `attribute_id`, `value`) VALUES
(1, 7, 2, '5000'),
(2, 7, 2, 'Haier');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10,2) DEFAULT NULL,
  `stock_quantity` int DEFAULT NULL,
  `brand_id` int DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `warehouse_id` int DEFAULT NULL,
  `product_type_id` int NOT NULL DEFAULT '1',
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `price`, `stock_quantity`, `brand_id`, `category_id`, `warehouse_id`, `product_type_id`, `image_url`) VALUES
(3, 'น้ำยาถังแอร์', 'น้ำยาถังแอร์', 555.00, 4, 1, 2, 1, 2, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1731508376/image/product-image/tdffnsyez1lfuvrsiypc.jpg'),
(7, 'สายส่ง O2', 'สายส่ง O2', 500.00, 6, 1, 2, 1, 2, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1730205436/image/product-image/gllrjvg4f3ua0if2gofx.jpg'),
(8, 'แอร์ 36000BTU', 'แอร์ 36000BTU', 20000.00, 5, 1, 1, 1, 1, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1731303469/image/product-image/bdzo2ran3w3jpangqnbc.jpg'),
(9, 'แอร์ 60000BTU', 'แอร์ 60000BTU', 32000.00, 2, 1, 1, 1, 1, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1731303511/image/product-image/auzogejxhg5j136xyfhr.jpg'),
(10, 'แอร์ 120000BTU', 'แอร์ 120000BTU', 45000.00, 8, 1, 1, 1, 1, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1731303568/image/product-image/g5a1tek8uzzvtzvhwgok.jpg'),
(11, 'แอร์ 20ตัน', 'แอร์ 20ตัน', 60000.00, 5, 1, 1, 1, 1, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1731303611/image/product-image/uxoqcldpmcygu4oavnhb.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `product_type`
--

CREATE TABLE `product_type` (
  `product_type_id` int NOT NULL,
  `product_type_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `product_type`
--

INSERT INTO `product_type` (`product_type_id`, `product_type_name`) VALUES
(1, 'rental'),
(2, 'borrow'),
(3, 'sale');

-- --------------------------------------------------------

--
-- Table structure for table `rental`
--

CREATE TABLE `rental` (
  `rental_id` int NOT NULL,
  `task_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `rental_start_date` date DEFAULT NULL,
  `rental_end_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `rental`
--

INSERT INTO `rental` (`rental_id`, `task_id`, `product_id`, `rental_start_date`, `rental_end_date`) VALUES
(15, 202, NULL, NULL, '2024-11-21'),
(16, 204, NULL, NULL, '2024-11-21'),
(17, 205, NULL, NULL, '2024-12-20'),
(18, 206, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int NOT NULL,
  `task_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `tech_id` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `comment` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `task_id`, `user_id`, `tech_id`, `rating`, `comment`, `created_at`) VALUES
(1, 26, 6, 1, 5, 'ทำงานได้ดี', '2024-09-23 05:56:52');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int NOT NULL,
  `role_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`) VALUES
(1, 'customer'),
(2, 'technician'),
(3, 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `service_areas`
--

CREATE TABLE `service_areas` (
  `service_area_id` int NOT NULL,
  `tech_id` int NOT NULL,
  `area_name` varchar(100) DEFAULT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `service_areas`
--

INSERT INTO `service_areas` (`service_area_id`, `tech_id`, `area_name`, `description`) VALUES
(1, 1, 'กรุงเทพและปริมณฑณ', 'กรุงเทพ และนนทบุรี');

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `status_id` int NOT NULL,
  `status_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`status_id`, `status_name`) VALUES
(1, 'pending'),
(2, 'completed'),
(3, 'cancel'),
(4, 'approve'),
(5, 'active'),
(6, 'inactive'),
(7, 'hiring'),
(8, 'interviewed'),
(9, 'rejected'),
(10, 'borrowing');

-- --------------------------------------------------------

--
-- Table structure for table `taskassignments`
--

CREATE TABLE `taskassignments` (
  `assignment_id` int NOT NULL,
  `task_id` int DEFAULT NULL,
  `tech_id` int DEFAULT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `taskassignments`
--

INSERT INTO `taskassignments` (`assignment_id`, `task_id`, `tech_id`, `assigned_at`) VALUES
(1, 12, 1, '2024-09-19 09:04:00'),
(31, 26, 1, '2024-11-08 13:13:55');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `task_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `start_date` date DEFAULT NULL,
  `finish_date` date DEFAULT NULL,
  `task_type_id` int DEFAULT NULL,
  `quantity_used` int DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `appointment_date` datetime DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '0',
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status_id` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`task_id`, `user_id`, `description`, `created_at`, `start_date`, `finish_date`, `task_type_id`, `quantity_used`, `address`, `appointment_date`, `latitude`, `longitude`, `isActive`, `updatedAt`, `status_id`) VALUES
(12, 6, 'งานเช่าแอร์ตัน', '2024-09-18 12:43:30', '2024-11-21', '2024-11-01', 1, NULL, 'กรุงเทพ พหลโยธิน ', '2024-09-25 19:42:00', 13.64198320, 100.72608948, 1, '2024-11-14 09:38:44', 2),
(26, 6, 'งานเช่าพัดลมไอน้ำ', '2024-09-22 16:35:29', NULL, NULL, 1, NULL, 'กรุงเทพ พหลโยธิน', '2024-09-19 23:35:00', 13.80674218, 100.50052643, 1, '2024-11-14 09:38:51', 2),
(200, 3, 'ยืมอุปกรณฺ์', '2024-11-19 05:17:39', NULL, NULL, 11, NULL, NULL, NULL, NULL, NULL, 1, '2024-11-20 03:34:53', 4),
(201, 3, 'ยืมอุปกรณฺ์', '2024-11-19 05:20:27', NULL, NULL, 11, NULL, NULL, NULL, NULL, NULL, 1, '2024-11-19 05:25:59', 4),
(202, 6, 'asdsa', '2024-11-20 02:05:00', NULL, NULL, 1, NULL, 'sadsad', '2024-11-20 00:04:00', 13.71804018, 100.49180740, 0, '2024-11-20 02:05:10', 1),
(203, 3, 'ยืมอุปกรณฺ์', '2024-11-20 03:34:13', NULL, NULL, 11, NULL, NULL, NULL, NULL, NULL, 1, '2024-11-20 03:34:13', 1),
(204, 6, 'test', '2024-11-20 03:37:00', NULL, NULL, 1, NULL, 'address 1', '2024-11-20 00:36:00', 13.74835604, 101.15089130, 1, '2024-11-20 03:37:00', 1),
(205, 6, 'test', '2024-12-09 08:41:57', NULL, NULL, 1, NULL, 'Siam Paragon, 991, Rama I Road, Siam, Pathum Wan Subdistrict, Pathum Wan District, Bangkok, 10330, Thailand', '2024-12-17 15:41:00', 13.74677845, 100.53495403, 0, '2024-12-09 09:15:11', 1),
(206, 3, 'asdasd', '2024-12-09 09:14:59', NULL, NULL, 1, 5, 'Siam Paragon, 991, Rama I Road, Siam, Pathum Wan Subdistrict, Pathum Wan District, Bangkok, 10330, Thailand', '2024-12-18 20:14:00', 13.74677845, 100.53495403, 0, '2024-12-09 09:15:09', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tasktypes`
--

CREATE TABLE `tasktypes` (
  `task_type_id` int NOT NULL,
  `type_name` varchar(100) NOT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tasktypes`
--

INSERT INTO `tasktypes` (`task_type_id`, `type_name`, `description`) VALUES
(1, 'งานเช่าเครื่องปรับอากาศ', 'เช่าเครื่องปรับอากาศ พร้อมติดตั้ง'),
(9, 'ขายสินค้า', 'ขายอุปกรณ์เครื่องปรับอากาศ'),
(11, 'ยืมอุปกรณ์', 'ยืมอุปกรณ์');

-- --------------------------------------------------------

--
-- Table structure for table `task_log`
--

CREATE TABLE `task_log` (
  `log_id` int NOT NULL,
  `task_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `task_log`
--

INSERT INTO `task_log` (`log_id`, `task_id`, `user_id`, `action`, `created_at`) VALUES
(5, 206, 3, 'เพิ่มงาน', '2024-12-09 09:14:59');

-- --------------------------------------------------------

--
-- Table structure for table `technicians`
--

CREATE TABLE `technicians` (
  `tech_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `nationality` varchar(50) DEFAULT NULL,
  `isOutsource` bit(1) DEFAULT NULL,
  `work_experience` text,
  `special_skills` text,
  `background_check_status` enum('pending','completed','failed') DEFAULT 'pending',
  `bank_account_number` varchar(20) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `status_id` int NOT NULL DEFAULT '1',
  `id_card_image_url` varchar(255) DEFAULT NULL,
  `driver_license_image_url` varchar(255) DEFAULT NULL,
  `criminal_record_image_url` varchar(255) DEFAULT NULL,
  `additional_image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `technicians`
--

INSERT INTO `technicians` (`tech_id`, `user_id`, `nationality`, `isOutsource`, `work_experience`, `special_skills`, `background_check_status`, `bank_account_number`, `start_date`, `status_id`, `id_card_image_url`, `driver_license_image_url`, `criminal_record_image_url`, `additional_image_url`) VALUES
(1, 3, 'ไทย', b'0', 'จบใหม่', 'การตอบคำถามเชิงเทคนิคกับลูกค้า', 'completed', NULL, '2024-09-13', 1, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `technician_applicants`
--

CREATE TABLE `technician_applicants` (
  `applicant_id` int NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `application_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `position_applied` varchar(100) DEFAULT NULL,
  `notes` text,
  `interview_date` date DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `status_id` int DEFAULT '1',
  `id_card_image_url` varchar(255) DEFAULT NULL,
  `driver_license_image_url` varchar(255) DEFAULT NULL,
  `criminal_record_image_url` varchar(255) DEFAULT NULL,
  `additional_image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `technician_applicants`
--

INSERT INTO `technician_applicants` (`applicant_id`, `date_of_birth`, `address`, `email`, `phone_number`, `application_date`, `position_applied`, `notes`, `interview_date`, `first_name`, `last_name`, `status_id`, `id_card_image_url`, `driver_license_image_url`, `criminal_record_image_url`, `additional_image_url`) VALUES
(1, '2003-09-03', 'กทม', 'natchapakjd@gmail.com', '0641160893', '2024-09-23 06:11:35', 'ช่างซ่อมบำรุง', 'โน้ตเพิ่มเติม', '2024-09-25', 'ช่าง', 'ในระบบ', 7, NULL, NULL, NULL, NULL),
(4, '2024-11-10', 'address', 'kookkaball68@gmail.com', '0641159783', '2024-11-11 06:36:13', 'ตำแหน่ง1', 'test', NULL, 'test1', 'test2', 7, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1731306972/image/applicant-images/gouwpp8w2iqeupoavl3p.jpg', NULL, NULL, NULL),
(5, '2024-11-21', 'address', 'kookkaball68@gmail.com', 'test1', '2024-11-13 08:30:05', 'ช่างติดตั้ง', 'test1', NULL, 'test1', 'test2', 1, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1731486605/image/applicant-images/tv5fy1m3jxs6vt35ux35.jpg', NULL, NULL, NULL),
(6, '2003-03-04', 'asdsad', 'natchapakjd@gmail.com', '0641159783', '2024-12-09 08:46:20', 'ช่างซ่อมบำรุง', 'asd', NULL, 'ะำห', 'ฟหก', 1, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstname` varchar(100) DEFAULT NULL COMMENT 'ชื่อจริงของผู้ใช้งาน',
  `lastname` varchar(100) DEFAULT NULL COMMENT 'นามสกุลของผู้ใช้งาน',
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL COMMENT 'เบอร์โทรศัพท์ของผู้ใช้งาน',
  `age` int DEFAULT NULL COMMENT 'อายุของผู้ใช้งาน',
  `address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `linetoken` text,
  `date_of_birth` date DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `role_id` int NOT NULL DEFAULT '1',
  `gender_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `firstname`, `lastname`, `email`, `phone`, `age`, `address`, `created_at`, `linetoken`, `date_of_birth`, `image_url`, `role_id`, `gender_id`) VALUES
(2, 'admin', '$2b$10$ThT9xSLUiZ4ZwAYZshVf6ulBktjc6tImodfFr8Uf9IME1SDI.Q.XW', 'firstname', 'lastname', 'admin@gmail.com', '0641159783', 5, 'กทม', '2024-09-11 12:32:23', 'U9cb564155dddeaa549d97a8747eed534', '2024-09-19', 'https://res.cloudinary.com/dq8euhi61/image/upload/v1727462309/image/user-image/czf9574soadtxq378hjz.jpg', 3, 1),
(3, 'tech', '$2b$10$ltJ786G/tiUyM/bIJ1z/LeSyAqzCstfaGZsTNipj.1X0n3yZPd/S6', 'ช่าง', 'ในระบบ', 'tech@gmail.com', '0641159783', 7, 'กทม', '2024-09-12 07:18:25', 'U9cb564155dddeaa549d97a8747eed534', '2024-09-17', NULL, 2, 1),
(6, 'member', '$2b$10$vTkQMsaHgsPOeXx.CtQYJ.ZAXjJv27HoevSjNNojGXNqoq025poXm', 'ลูกค้า', 'ในระบบ', 'asdasdas@gmailcom', '0641159783', 25, 'กทม', '2024-09-13 11:58:33', NULL, '2024-09-19', 'https://res.cloudinary.com/dq8euhi61/image/upload/v1727331372/image/user-image/b3gsanuh4utc3dvgnxoj.jpg', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `warehouses`
--

CREATE TABLE `warehouses` (
  `warehouse_id` int NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `capacity` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `warehouses`
--

INSERT INTO `warehouses` (`warehouse_id`, `location`, `capacity`) VALUES
(1, 'กทม', 20);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adminlogs`
--
ALTER TABLE `adminlogs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `area_calculation_history`
--
ALTER TABLE `area_calculation_history`
  ADD PRIMARY KEY (`calculation_id`),
  ADD KEY `assignment_id` (`assignment_id`);

--
-- Indexes for table `attributes`
--
ALTER TABLE `attributes`
  ADD PRIMARY KEY (`attribute_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`brand_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `equipment_borrowing`
--
ALTER TABLE `equipment_borrowing`
  ADD PRIMARY KEY (`borrowing_id`),
  ADD KEY `fk_task` (`task_id`);

--
-- Indexes for table `gender`
--
ALTER TABLE `gender`
  ADD PRIMARY KEY (`gender_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_orders_tasks` (`task_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `payments_ibfk_3` (`order_id`),
  ADD KEY `fk_payment_status` (`status_id`),
  ADD KEY `fk_payment_method` (`method_id`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`method_id`),
  ADD UNIQUE KEY `method_name` (`method_name`);

--
-- Indexes for table `productattributes`
--
ALTER TABLE `productattributes`
  ADD PRIMARY KEY (`product_attribute_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `attribute_id` (`attribute_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `brand_id` (`brand_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `warehouse_id` (`warehouse_id`),
  ADD KEY `fk_product_type_id` (`product_type_id`);

--
-- Indexes for table `product_type`
--
ALTER TABLE `product_type`
  ADD PRIMARY KEY (`product_type_id`);

--
-- Indexes for table `rental`
--
ALTER TABLE `rental`
  ADD PRIMARY KEY (`rental_id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `tech_id` (`tech_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `service_areas`
--
ALTER TABLE `service_areas`
  ADD PRIMARY KEY (`service_area_id`),
  ADD KEY `tech_id` (`tech_id`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`status_id`);

--
-- Indexes for table `taskassignments`
--
ALTER TABLE `taskassignments`
  ADD PRIMARY KEY (`assignment_id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `tech_id` (`tech_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`task_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `task_type_id` (`task_type_id`),
  ADD KEY `fk_task_status` (`status_id`);

--
-- Indexes for table `tasktypes`
--
ALTER TABLE `tasktypes`
  ADD PRIMARY KEY (`task_type_id`),
  ADD UNIQUE KEY `type_name` (`type_name`);

--
-- Indexes for table `task_log`
--
ALTER TABLE `task_log`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `task_id` (`task_id`);

--
-- Indexes for table `technicians`
--
ALTER TABLE `technicians`
  ADD PRIMARY KEY (`tech_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_technician_status` (`status_id`);

--
-- Indexes for table `technician_applicants`
--
ALTER TABLE `technician_applicants`
  ADD PRIMARY KEY (`applicant_id`),
  ADD KEY `fk_technician_applicant_status` (`status_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_role_id` (`role_id`),
  ADD KEY `fk_gender` (`gender_id`);

--
-- Indexes for table `warehouses`
--
ALTER TABLE `warehouses`
  ADD PRIMARY KEY (`warehouse_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adminlogs`
--
ALTER TABLE `adminlogs`
  MODIFY `log_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `area_calculation_history`
--
ALTER TABLE `area_calculation_history`
  MODIFY `calculation_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `attributes`
--
ALTER TABLE `attributes`
  MODIFY `attribute_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `brand_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `equipment_borrowing`
--
ALTER TABLE `equipment_borrowing`
  MODIFY `borrowing_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `gender`
--
ALTER TABLE `gender`
  MODIFY `gender_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `method_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `productattributes`
--
ALTER TABLE `productattributes`
  MODIFY `product_attribute_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `product_type`
--
ALTER TABLE `product_type`
  MODIFY `product_type_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rental`
--
ALTER TABLE `rental`
  MODIFY `rental_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `service_areas`
--
ALTER TABLE `service_areas`
  MODIFY `service_area_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
  MODIFY `status_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `taskassignments`
--
ALTER TABLE `taskassignments`
  MODIFY `assignment_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `task_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=207;

--
-- AUTO_INCREMENT for table `tasktypes`
--
ALTER TABLE `tasktypes`
  MODIFY `task_type_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `task_log`
--
ALTER TABLE `task_log`
  MODIFY `log_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `technicians`
--
ALTER TABLE `technicians`
  MODIFY `tech_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `technician_applicants`
--
ALTER TABLE `technician_applicants`
  MODIFY `applicant_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `warehouses`
--
ALTER TABLE `warehouses`
  MODIFY `warehouse_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `adminlogs`
--
ALTER TABLE `adminlogs`
  ADD CONSTRAINT `adminlogs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `area_calculation_history`
--
ALTER TABLE `area_calculation_history`
  ADD CONSTRAINT `area_calculation_history_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `taskassignments` (`assignment_id`);

--
-- Constraints for table `equipment_borrowing`
--
ALTER TABLE `equipment_borrowing`
  ADD CONSTRAINT `fk_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_tasks` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payment_method` FOREIGN KEY (`method_id`) REFERENCES `payment_methods` (`method_id`),
  ADD CONSTRAINT `fk_payment_status` FOREIGN KEY (`status_id`) REFERENCES `status` (`status_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`),
  ADD CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `productattributes`
--
ALTER TABLE `productattributes`
  ADD CONSTRAINT `productattributes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  ADD CONSTRAINT `productattributes_ibfk_2` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`attribute_id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_product_type_id` FOREIGN KEY (`product_type_id`) REFERENCES `product_type` (`product_type_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses` (`warehouse_id`);

--
-- Constraints for table `rental`
--
ALTER TABLE `rental`
  ADD CONSTRAINT `rental_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rental_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`tech_id`) REFERENCES `technicians` (`tech_id`);

--
-- Constraints for table `service_areas`
--
ALTER TABLE `service_areas`
  ADD CONSTRAINT `service_areas_ibfk_1` FOREIGN KEY (`tech_id`) REFERENCES `technicians` (`tech_id`);

--
-- Constraints for table `taskassignments`
--
ALTER TABLE `taskassignments`
  ADD CONSTRAINT `taskassignments_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`),
  ADD CONSTRAINT `taskassignments_ibfk_2` FOREIGN KEY (`tech_id`) REFERENCES `technicians` (`tech_id`);

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `fk_task_status` FOREIGN KEY (`status_id`) REFERENCES `status` (`status_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`task_type_id`) REFERENCES `tasktypes` (`task_type_id`),
  ADD CONSTRAINT `tasks_ibfk_3` FOREIGN KEY (`task_type_id`) REFERENCES `tasktypes` (`task_type_id`);

--
-- Constraints for table `task_log`
--
ALTER TABLE `task_log`
  ADD CONSTRAINT `task_log_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE;

--
-- Constraints for table `technicians`
--
ALTER TABLE `technicians`
  ADD CONSTRAINT `fk_technician_status` FOREIGN KEY (`status_id`) REFERENCES `status` (`status_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `technicians_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `technician_applicants`
--
ALTER TABLE `technician_applicants`
  ADD CONSTRAINT `fk_technician_applicant_status` FOREIGN KEY (`status_id`) REFERENCES `status` (`status_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_gender` FOREIGN KEY (`gender_id`) REFERENCES `gender` (`gender_id`),
  ADD CONSTRAINT `fk_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:51576
-- Generation Time: Nov 02, 2024 at 07:33 AM
-- Server version: 5.7.24
-- PHP Version: 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jaroensup`
--

-- --------------------------------------------------------

--
-- Table structure for table `adminlogs`
--

CREATE TABLE `adminlogs` (
  `log_id` int(11) NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
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
  `calculation_id` int(11) NOT NULL,
  `assignment_id` int(11) DEFAULT NULL,
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
(1, NULL, 'ห้องประชุม มธ', '200.00', '500.00', '3.00', 'ห้องประชุม\r\n');

-- --------------------------------------------------------

--
-- Table structure for table `attributes`
--

CREATE TABLE `attributes` (
  `attribute_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `attributes`
--

INSERT INTO `attributes` (`attribute_id`, `name`) VALUES
(1, 'BTU'),
(2, 'Model');

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `brand_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`brand_id`, `name`, `description`) VALUES
(1, 'Haier', 'ไฮเออร์');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
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
  `borrowing_id` int(11) NOT NULL,
  `tech_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `borrow_date` datetime NOT NULL,
  `return_date` datetime DEFAULT NULL,
  `task_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `gender`
--

CREATE TABLE `gender` (
  `gender_id` int(11) NOT NULL,
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
  `id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int(11) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT '0.00',
  `task_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `created_at`, `user_id`, `total_price`, `task_id`) VALUES
(5, '2024-10-29 13:36:11', 6, '555.00', 92),
(27, '2024-10-29 17:57:50', 6, '1110.00', 115),
(28, '2024-10-29 17:58:06', 6, '2665.00', 116);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `total_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_name`, `quantity`, `price`, `product_id`, `total_price`) VALUES
(6, 5, 'น้ำยาถังแอร์', 1, '555.00', 3, '555.00'),
(23, 27, 'น้ำยาถังแอร์', 2, '555.00', 3, '1110.00'),
(24, 28, 'สายส่ง O2', 2, '500.00', 7, '1000.00'),
(25, 28, 'น้ำยาถังแอร์', 3, '555.00', 3, '1665.00');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `task_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `order_id` int(11) DEFAULT NULL,
  `status_id` int(11) NOT NULL DEFAULT '1',
  `image_url` varchar(255) DEFAULT NULL,
  `method_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `user_id`, `task_id`, `amount`, `payment_date`, `order_id`, `status_id`, `image_url`, `method_id`, `created_at`) VALUES
(1, 6, 26, '500.00', '2024-09-20 20:00:00', NULL, 5, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1729492971/kelby2ttopkfpcwikyxw.png', 1, '2024-09-30 18:49:37'),
(2, 2, 12, '500.00', '2024-10-25 10:41:00', NULL, 4, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1729147278/bt8334ter8wywhrlbfyx.jpg', 1, '2024-10-17 06:41:16'),
(4, 6, 92, '5000.00', '2024-10-29 13:40:07', 5, 1, NULL, 1, '2024-10-29 13:40:07');

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `method_id` int(11) NOT NULL,
  `method_name` varchar(255) NOT NULL
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
  `product_attribute_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `attribute_id` int(11) DEFAULT NULL,
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
  `product_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10,2) DEFAULT NULL,
  `stock_quantity` int(11) DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `warehouse_id` int(11) DEFAULT NULL,
  `product_type_id` int(11) NOT NULL DEFAULT '1',
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `price`, `stock_quantity`, `brand_id`, `category_id`, `warehouse_id`, `product_type_id`, `image_url`) VALUES
(3, 'น้ำยาถังแอร์', 'น้ำยาถังแอร์', '555.00', 10, 1, 1, 1, 1, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1730205391/image/product-image/jfeg1fb3vk90fu9yexqt.jpg'),
(7, 'สายส่ง O2', 'สายส่ง O2', '500.00', 10, 1, 2, 1, 1, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1730205436/image/product-image/gllrjvg4f3ua0if2gofx.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `product_type`
--

CREATE TABLE `product_type` (
  `product_type_id` int(11) NOT NULL,
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
  `rental_id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `rental_start_date` date DEFAULT NULL,
  `rental_end_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `rental`
--

INSERT INTO `rental` (`rental_id`, `task_id`, `product_id`, `rental_start_date`, `rental_end_date`) VALUES
(9, 93, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `task_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `tech_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
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
  `role_id` int(11) NOT NULL,
  `role_name` varchar(255) NOT NULL
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
  `service_area_id` int(11) NOT NULL,
  `tech_id` int(11) NOT NULL,
  `area_name` varchar(255) NOT NULL,
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
  `status_id` int(11) NOT NULL,
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
(10, 'ิborrowing');

-- --------------------------------------------------------

--
-- Table structure for table `taskassignments`
--

CREATE TABLE `taskassignments` (
  `assignment_id` int(11) NOT NULL,
  `task_id` int(11) DEFAULT NULL,
  `tech_id` int(11) DEFAULT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `taskassignments`
--

INSERT INTO `taskassignments` (`assignment_id`, `task_id`, `tech_id`, `assigned_at`) VALUES
(1, 12, 1, '2024-09-19 09:04:00'),
(3, 26, 1, '2024-09-23 08:45:57');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `task_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `start_date` date DEFAULT NULL,
  `finish_date` date DEFAULT NULL,
  `task_type_id` int(11) DEFAULT NULL,
  `quantity_used` int(11) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `appointment_date` datetime DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '0',
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status_id` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`task_id`, `user_id`, `description`, `created_at`, `start_date`, `finish_date`, `task_type_id`, `quantity_used`, `address`, `appointment_date`, `latitude`, `longitude`, `isActive`, `updatedAt`, `status_id`) VALUES
(12, 6, 'งานเช่าแอร์ตัน', '2024-09-18 12:43:30', NULL, NULL, 1, NULL, 'กรุงเทพ พหลโยธิน ', '2024-09-25 19:42:00', '13.64198320', '100.72608948', 1, '2024-10-08 13:13:50', 2),
(26, 6, 'งานเช่าพัดลมไอน้ำ', '2024-09-22 16:35:29', NULL, NULL, 1, NULL, 'กรุงเทพ พหลโยธิน', '2024-09-19 23:35:00', '13.80674218', '100.50052643', 1, '2024-10-18 08:34:46', 2),
(92, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 13:36:11', NULL, NULL, 9, 1, NULL, NULL, NULL, NULL, 1, '2024-10-29 13:36:11', 1),
(93, 6, 'asdad', '2024-10-29 16:38:43', NULL, NULL, 1, 1, 'asdasd', '2024-10-17 14:38:00', '13.75410216', '100.48562648', 0, '2024-10-29 16:39:02', 1),
(94, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:09:19', NULL, NULL, 9, 5, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:09:18', 1),
(95, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:11:14', NULL, NULL, 9, 2, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:11:13', 1),
(96, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:19:40', NULL, NULL, 9, 5, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:19:39', 1),
(97, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:21:10', NULL, NULL, 9, 2, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:21:10', 1),
(98, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:27:17', NULL, NULL, 9, 9, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:27:17', 1),
(99, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:43:51', NULL, NULL, 9, 7, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:43:51', 1),
(100, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:43:58', NULL, NULL, 9, 7, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:43:57', 1),
(101, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:44:04', NULL, NULL, 9, 7, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:44:04', 1),
(102, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:44:21', NULL, NULL, 9, 7, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:44:21', 1),
(103, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:44:32', NULL, NULL, 9, 7, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:44:31', 1),
(104, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:44:37', NULL, NULL, 9, 6, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:44:36', 1),
(105, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:44:45', NULL, NULL, 9, 6, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:44:45', 1),
(106, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:44:53', NULL, NULL, 9, 6, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:44:52', 1),
(107, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:45:31', NULL, NULL, 9, 3, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:45:30', 1),
(108, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:45:39', NULL, NULL, 9, 1, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:45:39', 1),
(109, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:47:14', NULL, NULL, 9, 3, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:47:14', 1),
(110, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:48:48', NULL, NULL, 9, 5, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:48:48', 1),
(111, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:50:29', NULL, NULL, 9, 3, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:50:28', 1),
(112, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:52:43', NULL, NULL, 9, 2, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:52:42', 1),
(113, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:52:57', NULL, NULL, 9, 5, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:52:57', 1),
(114, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:53:48', NULL, NULL, 9, 2, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:53:48', 1),
(115, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:57:50', NULL, NULL, 9, 2, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:57:50', 1),
(116, 6, 'ซื้อขายอุปกรณ์', '2024-10-29 17:58:06', NULL, NULL, 9, 5, NULL, NULL, NULL, NULL, 1, '2024-10-29 17:58:06', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tasktypes`
--

CREATE TABLE `tasktypes` (
  `task_type_id` int(11) NOT NULL,
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
  `log_id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `task_log`
--

INSERT INTO `task_log` (`log_id`, `task_id`, `user_id`, `action`, `created_at`) VALUES
(1, 93, 6, 'Created task', '2024-10-29 16:38:43');

-- --------------------------------------------------------

--
-- Table structure for table `technicians`
--

CREATE TABLE `technicians` (
  `tech_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `specialization` varchar(100) DEFAULT NULL,
  `nationality` varchar(50) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT '0.00',
  `isOutsource` bit(1) DEFAULT NULL,
  `work_experience` text,
  `special_skills` text,
  `certificates` text,
  `background_check_status` enum('pending','completed','failed') DEFAULT 'pending',
  `bank_account_number` varchar(20) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `notes` text,
  `status_id` int(11) NOT NULL DEFAULT '1',
  `id_card_image_url` varchar(255) DEFAULT NULL,
  `driver_license_image_url` varchar(255) DEFAULT NULL,
  `criminal_record_image_url` varchar(255) DEFAULT NULL,
  `additional_image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `technicians`
--

INSERT INTO `technicians` (`tech_id`, `user_id`, `specialization`, `nationality`, `rating`, `isOutsource`, `work_experience`, `special_skills`, `certificates`, `background_check_status`, `bank_account_number`, `start_date`, `notes`, `status_id`, `id_card_image_url`, `driver_license_image_url`, `criminal_record_image_url`, `additional_image_url`) VALUES
(1, 3, 'งานซ่อมเครื่องปรับอากาศ', 'ไทย', '5.00', b'0', 'จบใหม่', 'การตอบคำถามเชิงเทคนิคกับลูกค้า', NULL, 'completed', NULL, '2024-09-13', NULL, 1, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `technician_applicants`
--

CREATE TABLE `technician_applicants` (
  `applicant_id` int(11) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `application_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `position_applied` varchar(100) DEFAULT NULL,
  `notes` text,
  `interview_date` date DEFAULT NULL,
  `interviewer` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `status_id` int(11) DEFAULT '1',
  `id_card_image_url` varchar(255) DEFAULT NULL,
  `driver_license_image_url` varchar(255) DEFAULT NULL,
  `criminal_record_image_url` varchar(255) DEFAULT NULL,
  `additional_image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `technician_applicants`
--

INSERT INTO `technician_applicants` (`applicant_id`, `date_of_birth`, `address`, `email`, `phone_number`, `application_date`, `position_applied`, `notes`, `interview_date`, `interviewer`, `first_name`, `last_name`, `status_id`, `id_card_image_url`, `driver_license_image_url`, `criminal_record_image_url`, `additional_image_url`) VALUES
(1, '2003-09-03', 'กทม', 'natchapakjd@gmail.com', '0641160893', '2024-09-23 06:11:35', 'ช่างซ่อมบำรุง', 'โน้ตเพิ่มเติม', '2024-09-25', 'admin', 'ช่าง', 'ในระบบ', 7, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `linetoken` text,
  `date_of_birth` date DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `role_id` int(11) NOT NULL DEFAULT '1',
  `gender_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `firstname`, `lastname`, `email`, `phone`, `age`, `address`, `created_at`, `linetoken`, `date_of_birth`, `image_url`, `role_id`, `gender_id`) VALUES
(2, 'admin', '$2b$10$ThT9xSLUiZ4ZwAYZshVf6ulBktjc6tImodfFr8Uf9IME1SDI.Q.XW', 'firstname', 'lastname', 'admin@gmail.com', '0641159783', 5, 'กทม', '2024-09-11 12:32:23', NULL, '2024-09-19', 'https://res.cloudinary.com/dq8euhi61/image/upload/v1727462309/image/user-image/czf9574soadtxq378hjz.jpg', 3, 1),
(3, 'tech', '$2b$10$ltJ786G/tiUyM/bIJ1z/LeSyAqzCstfaGZsTNipj.1X0n3yZPd/S6', 'ช่าง', 'ในระบบ', 'tech@gmail.com', '0641159783', 7, 'กทม', '2024-09-12 07:18:25', NULL, '2024-09-17', NULL, 2, 1),
(6, 'member', '$2b$10$FaSFGRxhPP0dH2IYi9D5kOhiBz0He.to1V8UQQYMVqE8K0aQT4rue', 'ลูกค้า', 'ในระบบ', 'asdasdas@gmailcom', '0641159783', 25, 'กทม', '2024-09-13 11:58:33', 'U9cb564155dddeaa549d97a8747eed534', '2024-09-19', 'https://res.cloudinary.com/dq8euhi61/image/upload/v1727331372/image/user-image/b3gsanuh4utc3dvgnxoj.jpg', 1, 1),
(7, 'test', '$2b$10$TkFQUUGGsgRYrmVKHDYiZe2Qk30s4QnhC0SAgj8sNH.bZyNcRGGKq', 'test', 'test', 'test@gmail.com', '0641159783', 5, 'กรุงเทพ พหลโยธิน', '2024-10-18 08:57:22', NULL, '2024-10-16', NULL, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `warehouses`
--

CREATE TABLE `warehouses` (
  `warehouse_id` int(11) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL
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
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `area_calculation_history`
--
ALTER TABLE `area_calculation_history`
  MODIFY `calculation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `attributes`
--
ALTER TABLE `attributes`
  MODIFY `attribute_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `brand_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `equipment_borrowing`
--
ALTER TABLE `equipment_borrowing`
  MODIFY `borrowing_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gender`
--
ALTER TABLE `gender`
  MODIFY `gender_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `method_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `productattributes`
--
ALTER TABLE `productattributes`
  MODIFY `product_attribute_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `product_type`
--
ALTER TABLE `product_type`
  MODIFY `product_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rental`
--
ALTER TABLE `rental`
  MODIFY `rental_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `service_areas`
--
ALTER TABLE `service_areas`
  MODIFY `service_area_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `taskassignments`
--
ALTER TABLE `taskassignments`
  MODIFY `assignment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `task_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=117;

--
-- AUTO_INCREMENT for table `tasktypes`
--
ALTER TABLE `tasktypes`
  MODIFY `task_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `task_log`
--
ALTER TABLE `task_log`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `technicians`
--
ALTER TABLE `technicians`
  MODIFY `tech_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `technician_applicants`
--
ALTER TABLE `technician_applicants`
  MODIFY `applicant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `warehouses`
--
ALTER TABLE `warehouses`
  MODIFY `warehouse_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: bv9lnhqaqmmb6bfuzy5v-mysql.services.clever-cloud.com:3306
-- Generation Time: Mar 09, 2025 at 10:32 AM
-- Server version: 8.0.22-13
-- PHP Version: 8.2.27

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
(41, 2, 'สร้างคำสั่งซื้อไอดี 106', '2025-03-09 09:05:02'),
(42, 2, 'เพิ่มพื้นที่ใหม่โดยคำนวณพื้นที่(ชื่อสถานที่): เทสระบบ', '2025-03-09 10:09:31'),
(43, 2, 'แก้ไขพื้นที่เดิม(หมายเลข): 208', '2025-03-09 10:10:03'),
(44, 2, 'เพิ่มพื้นที่ใหม่โดยคำนวณพื้นที่(ชื่อสถานที่): ฟปฟปแ', '2025-03-09 10:11:16'),
(45, 2, 'แก้ไขพื้นที่เดิม(หมายเลข): 208', '2025-03-09 10:11:29'),
(46, 2, 'แก้ไขพื้นที่เดิม(หมายเลข): 208', '2025-03-09 10:11:51'),
(47, 2, 'แก้ไขพื้นที่เดิม(หมายเลข): 208', '2025-03-09 10:12:38'),
(48, 2, 'แก้ไขพื้นที่เดิม(หมายเลข): 208', '2025-03-09 10:13:21'),
(49, 2, 'แก้ไขพื้นที่เดิม(หมายเลข): 208', '2025-03-09 10:13:57'),
(50, 2, 'แก้ไขพื้นที่เดิม(หมายเลข): 208', '2025-03-09 10:15:30'),
(51, 2, 'แก้ไขพื้นที่เดิม(หมายเลข): 208', '2025-03-09 10:18:14'),
(52, 2, 'แก้ไขพื้นที่เดิม(หมายเลข): 208', '2025-03-09 10:18:58'),
(53, 2, 'แก้ไขพื้นที่เดิม(หมายเลข): 208', '2025-03-09 10:21:08'),
(54, 2, 'แก้ไขพื้นที่เดิม(หมายเลข): 208', '2025-03-09 10:25:09'),
(55, 2, 'แก้ไขพื้นที่เดิม(หมายเลข): 208', '2025-03-09 10:26:20'),
(56, 2, 'เพิ่มพื้นที่ใหม่โดยคำนวณพื้นที่(ชื่อสถานที่): asdasdasasd', '2025-03-09 10:26:38'),
(57, 2, 'แก้ไขพื้นที่เดิม(หมายเลข): 208', '2025-03-09 10:27:02'),
(58, 2, 'แก้ไขพื้นที่เดิม(หมายเลข): 208', '2025-03-09 10:29:07'),
(59, 2, 'แก้ไขพื้นที่เดิม(หมายเลข): 208', '2025-03-09 10:29:45');

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
  `air_5ton_used` int DEFAULT '0',
  `air_10ton_used` int DEFAULT '0',
  `air_20ton_used` int DEFAULT '0',
  `grid_pattern` text,
  `room_type_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `area_calculation_history`
--

INSERT INTO `area_calculation_history` (`calculation_id`, `assignment_id`, `location_name`, `width`, `height`, `air_conditioners_needed`, `air_5ton_used`, `air_10ton_used`, `air_20ton_used`, `grid_pattern`, `room_type_id`) VALUES
(208, 188, 'เชิบๆ', 60.00, 60.00, 18.00, 0, 13, 5, '[{\"id\":\"ac-1741516172248\",\"index\":0,\"row\":0,\"col\":0,\"type\":\"240000\",\"rotation\":90},{\"id\":\"ac-1741516172270\",\"index\":59,\"row\":0,\"col\":59,\"type\":\"240000\",\"rotation\":90},{\"id\":\"ac-1741516172297\",\"index\":3540,\"row\":59,\"col\":0,\"type\":\"240000\",\"rotation\":270},{\"id\":\"ac-1741516172331\",\"index\":3599,\"row\":59,\"col\":59,\"type\":\"240000\",\"rotation\":270},{\"id\":\"ac-1741516172362\",\"index\":19,\"row\":0,\"col\":19,\"type\":\"240000\",\"rotation\":90},{\"id\":\"ac-1741516172381\",\"index\":32,\"row\":0,\"col\":32,\"type\":\"120000\",\"rotation\":90},{\"id\":\"ac-1741516172402\",\"index\":45,\"row\":0,\"col\":45,\"type\":\"120000\",\"rotation\":90},{\"id\":\"ac-1741516172420\",\"index\":780,\"row\":13,\"col\":0,\"type\":\"120000\",\"rotation\":0},{\"id\":\"ac-1741516172437\",\"index\":839,\"row\":13,\"col\":59,\"type\":\"120000\",\"rotation\":180},{\"id\":\"ac-1741516172454\",\"index\":1560,\"row\":26,\"col\":0,\"type\":\"120000\",\"rotation\":0},{\"id\":\"ac-1741516172468\",\"index\":1619,\"row\":26,\"col\":59,\"type\":\"120000\",\"rotation\":180},{\"id\":\"ac-1741516172484\",\"index\":2340,\"row\":39,\"col\":0,\"type\":\"120000\",\"rotation\":0},{\"id\":\"ac-1741516172499\",\"index\":2399,\"row\":39,\"col\":59,\"type\":\"120000\",\"rotation\":180},{\"id\":\"ac-1741516172514\",\"index\":3553,\"row\":59,\"col\":13,\"type\":\"120000\",\"rotation\":270},{\"id\":\"ac-1741516172528\",\"index\":3566,\"row\":59,\"col\":26,\"type\":\"120000\",\"rotation\":270},{\"id\":\"ac-1741516172543\",\"index\":3579,\"row\":59,\"col\":39,\"type\":\"120000\",\"rotation\":270},{\"id\":\"ac-1741516172560\",\"index\":793,\"row\":13,\"col\":13,\"type\":\"120000\",\"rotation\":0},{\"id\":\"ac-1741516172575\",\"index\":806,\"row\":13,\"col\":26,\"type\":\"120000\",\"rotation\":0}]', 1),
(209, 188, 'ฟปฟปแ', 30.00, 30.00, 6.00, 0, 0, 6, '[{\"id\":\"ac-1741515054516\",\"index\":0,\"row\":0,\"col\":0,\"type\":\"240000\",\"rotation\":90},{\"id\":\"ac-1741515054518\",\"index\":29,\"row\":0,\"col\":29,\"type\":\"240000\",\"rotation\":90},{\"id\":\"ac-1741515054525\",\"index\":870,\"row\":29,\"col\":0,\"type\":\"240000\",\"rotation\":270},{\"id\":\"box-1741515056756\",\"index\":899,\"row\":29,\"col\":29,\"type\":\"twentyton\",\"rotation\":270},{\"id\":\"box-1741515062661\",\"index\":885,\"row\":29,\"col\":15,\"type\":\"twentyton\",\"rotation\":270},{\"id\":\"box-1741515066084\",\"index\":14,\"row\":0,\"col\":14,\"type\":\"twentyton\",\"rotation\":90}]', 1),
(210, 188, 'asdasdasasd', 30.00, 30.00, 5.00, 0, 0, 5, '[{\"id\":\"ac-1741515989113\",\"index\":0,\"row\":0,\"col\":0,\"type\":\"240000\",\"rotation\":90},{\"id\":\"ac-1741515989115\",\"index\":29,\"row\":0,\"col\":29,\"type\":\"240000\",\"rotation\":90},{\"id\":\"ac-1741515989120\",\"index\":870,\"row\":29,\"col\":0,\"type\":\"240000\",\"rotation\":270},{\"id\":\"box-1741515991185\",\"index\":899,\"row\":29,\"col\":29,\"type\":\"twentyton\",\"rotation\":180},{\"id\":\"box-1741515992706\",\"index\":404,\"row\":13,\"col\":14,\"type\":\"twentyton\",\"rotation\":90}]', 1),
(211, 188, 'เทส', 30.00, 30.00, 0.00, 0, 0, 0, '[]', 2);

-- --------------------------------------------------------

--
-- Table structure for table `area_images`
--

CREATE TABLE `area_images` (
  `id` int NOT NULL,
  `area_calculation_id` int NOT NULL,
  `image_url` text NOT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `area_images`
--

INSERT INTO `area_images` (`id`, `area_calculation_id`, `image_url`, `uploaded_at`) VALUES
(18, 211, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741516250/area_images/tka5tnhass1hxfe2xcfh.png', '2025-03-09 17:30:50');

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
-- Table structure for table `borrowing_details`
--

CREATE TABLE `borrowing_details` (
  `borrowing_detail_id` int NOT NULL,
  `borrowing_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  `borrow_date` date DEFAULT NULL,
  `return_date` date DEFAULT NULL,
  `task_id` int NOT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `gender`
--

CREATE TABLE `gender` (
  `gender_id` int NOT NULL,
  `gender_name` varchar(20) DEFAULT NULL
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

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `created_at`, `user_id`, `total_price`, `task_id`) VALUES
(105, '2025-03-08 08:46:33', 6, 64000.00, 363),
(106, '2025-03-09 09:05:02', 2, 64000.00, 407);

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

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_name`, `quantity`, `price`, `product_id`, `total_price`) VALUES
(138, 105, 'แอร์ 60000BTU', 2, 32000.00, 9, 64000.00),
(139, 106, 'แอร์ 60000BTU', 2, 32000.00, 9, 64000.00);

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
(28, 6, 363, 64000.00, NULL, 1, NULL, 1, '2025-03-08 08:46:34');

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
  `image_url` varchar(255) DEFAULT NULL,
  `model_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `price`, `stock_quantity`, `brand_id`, `category_id`, `warehouse_id`, `product_type_id`, `image_url`, `model_url`) VALUES
(3, 'น้ำยาถังแอร์', 'น้ำยาถังแอร์', 555.00, 3, 1, 2, 1, 2, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1731508376/image/product-image/tdffnsyez1lfuvrsiypc.jpg', NULL),
(7, 'สายส่ง O2', 'สายส่ง O2', 500.00, 6, 1, 2, 1, 2, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1730205436/image/product-image/gllrjvg4f3ua0if2gofx.jpg', NULL),
(9, 'แอร์ 60000BTU', 'แอร์ 60000BTU', 32000.00, 97, 1, 1, 1, 1, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1731303511/image/product-image/auzogejxhg5j136xyfhr.jpg', NULL),
(10, 'แอร์ 120000BTU', 'แอร์ 120000BTU', 45000.00, 98, 1, 1, 1, 1, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1731303568/image/product-image/g5a1tek8uzzvtzvhwgok.jpg', NULL),
(11, 'แอร์ 20ตัน', 'แอร์ 20ตัน', 60000.00, 100, 1, 1, 1, 1, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1731303611/image/product-image/uxoqcldpmcygu4oavnhb.jpg', NULL);

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
  `rental_end_date` date DEFAULT NULL,
  `quantity` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `rental`
--

INSERT INTO `rental` (`rental_id`, `task_id`, `product_id`, `rental_start_date`, `rental_end_date`, `quantity`) VALUES
(98, 360, NULL, '2025-03-13', '2025-03-20', 0),
(105, 360, 9, '2025-03-13', '2025-03-20', 2),
(106, 360, 10, '2025-03-13', '2025-03-20', 2),
(107, 361, NULL, '2025-03-10', '2025-03-12', 0),
(108, 361, 9, '2025-03-10', '2025-03-12', 3),
(109, 361, 10, '2025-03-10', '2025-03-12', 3),
(110, 362, NULL, '2025-03-10', '2025-03-13', 0),
(111, 364, NULL, '2025-03-13', '2025-03-14', 0),
(112, 362, 9, '2025-03-10', '2025-03-13', 2),
(113, 362, 11, '2025-03-10', '2025-03-13', 2),
(114, 360, 9, '2025-03-13', '2025-03-20', 2),
(115, 360, 10, '2025-03-13', '2025-03-20', 2),
(116, 365, NULL, '2025-03-10', '2025-03-13', 0),
(117, 366, NULL, '2025-03-11', '2025-03-15', 0),
(118, 367, NULL, '2025-03-13', '2025-03-15', 0),
(119, 368, NULL, '2025-03-13', '2025-03-15', 0),
(120, 369, NULL, '2025-03-19', '2025-03-22', 0),
(121, 370, NULL, '2025-03-15', '2025-03-29', 0),
(122, 371, NULL, '2025-03-20', '2025-03-22', 0),
(123, 361, 9, '2025-03-10', '2025-03-12', 2),
(124, 361, 10, '2025-03-10', '2025-03-12', 2),
(125, 362, 9, '2025-03-10', '2025-03-13', 1);

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
(5, 364, 6, 1, 5, 'ดีมากๆ', '2025-03-08 15:18:43');

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
-- Table structure for table `room_types`
--

CREATE TABLE `room_types` (
  `id` int NOT NULL,
  `room_name` varchar(255) NOT NULL,
  `btu_required` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `room_types`
--

INSERT INTO `room_types` (`id`, `room_name`, `btu_required`) VALUES
(1, 'ห้องนอนปกติ - ไม่โดนแดดโดยตรง', 750),
(2, 'ห้องนอนปกติ - โดนแดดมาก', 800),
(3, 'ห้องทำงาน - ไม่โดนแดดโดยตรง', 850),
(4, 'ห้องทำงาน - โดนแดดมาก', 900),
(5, 'ร้านอาหาร/ร้านค้า - ไม่โดนแดด', 950),
(6, 'ร้านอาหาร/ร้านค้า - โดนแดดมาก', 1000),
(7, 'ห้องประชุม', 1100),
(8, 'ห้องประชุมขนาดใหญ่เพดานสูง', 1200),
(9, 'สนามเปิด/พื้นที่เปิด', 1300);

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
(188, 361, 1, '2025-03-09 10:08:18'),
(189, 361, 4, '2025-03-09 10:08:18');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `task_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `task_type_id` int DEFAULT NULL,
  `quantity_used` int DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `appointment_date` datetime DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '0',
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status_id` int NOT NULL DEFAULT '1',
  `total` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`task_id`, `user_id`, `description`, `created_at`, `task_type_id`, `quantity_used`, `address`, `appointment_date`, `latitude`, `longitude`, `isActive`, `updatedAt`, `status_id`, `total`) VALUES
(360, 6, 'ะำ', '2025-03-05 17:54:47', 1, 9, 'Siam Paragon, 991, Rama I Road, Siam, Pathum Wan Subdistrict, Pathum Wan District, Bangkok, 10330, Thailand', '2025-03-14 23:13:00', 13.74677845, 100.53495403, 0, '2025-03-08 15:33:27', 4, 6000),
(361, 6, 'ฟหกหฟก', '2025-03-08 08:40:12', 1, 10, 'Siam Paragon, 991, Rama I Road, Siam, Pathum Wan Subdistrict, Pathum Wan District, Bangkok, 10330, Thailand', '2025-03-10 08:00:00', 13.74677845, 100.53495403, 1, '2025-03-09 10:08:18', 5, 5000),
(362, 6, 'sasadsad', '2025-03-08 08:43:08', 1, 5, 'asdsad', '2025-03-10 17:00:00', 13.74861345, 100.49830288, 1, '2025-03-09 10:08:08', 4, 0),
(363, 6, 'ซื้อขายอุปกรณ์', '2025-03-08 15:46:20', 9, 2, NULL, NULL, NULL, NULL, 1, '2025-03-08 08:46:33', 1, 0),
(364, 6, 'asdsad', '2025-03-08 10:20:50', 12, 0, 'asdsad', '2025-03-13 20:00:00', NULL, NULL, 1, '2025-03-08 15:18:33', 2, 0),
(365, 6, 'เทสระบบ', '2025-03-08 15:20:03', 1, 0, 'sadsaddsa', '2025-03-10 23:20:00', NULL, NULL, 1, '2025-03-08 15:20:03', 1, 0),
(366, 6, 'เทสระบบ', '2025-03-08 15:20:27', 1, 0, 'asdasdหฟกฟหก', '2025-03-11 23:30:00', NULL, NULL, 1, '2025-03-08 15:20:27', 1, 0),
(367, 6, 'ฟหกฟหก', '2025-03-08 15:21:08', 1, 0, 'ฟหกหฟกฟหก', '2025-03-13 22:20:00', NULL, NULL, 1, '2025-03-08 15:21:08', 1, 0),
(368, 6, 'หกฟกหฟก', '2025-03-08 15:21:28', 1, 0, 'หฟกฟหกฟหก', '2025-03-13 22:30:00', NULL, NULL, 1, '2025-03-08 15:21:28', 1, 0),
(369, 6, 'ฟหกหฟกฟห', '2025-03-08 15:21:43', 1, 0, 'กฟหกหฟก', '2025-03-19 22:21:00', NULL, NULL, 1, '2025-03-08 15:21:43', 1, 0),
(370, 6, 'ฟหกหฟก', '2025-03-08 15:22:00', 1, 0, 'หฟกหฟกหฟก', '2025-03-15 22:21:00', NULL, NULL, 1, '2025-03-08 15:22:00', 1, 0),
(371, 6, 'ฟหกหฟก', '2025-03-08 15:22:14', 1, 0, 'หฟกฟหก', '2025-03-20 22:22:00', NULL, NULL, 1, '2025-03-08 15:22:14', 1, 0),
(372, NULL, 'ยืมอุปกรณฺ์', '2025-03-09 06:47:56', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 06:47:56', 1, 0),
(373, NULL, 'ยืมอุปกรณ์', '2025-03-09 06:50:11', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 06:50:11', 1, 0),
(374, NULL, 'ยืมอุปกรณ์', '2025-03-09 06:50:20', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 06:50:20', 1, 0),
(375, NULL, 'ยืมอุปกรณ์', '2025-03-09 06:50:20', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 06:50:20', 1, 0),
(376, NULL, 'ยืมอุปกรณ์', '2025-03-09 06:50:42', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 06:50:42', 1, 0),
(377, NULL, 'ยืมอุปกรณ์', '2025-03-09 06:51:09', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 06:51:09', 1, 0),
(380, 2, 'ยืมอุปกรณ์', '2025-03-09 06:56:09', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 06:56:09', 1, 0),
(386, 2, 'ยืมอุปกรณ์', '2025-03-09 07:04:10', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 07:04:10', 1, 0),
(387, 2, 'ยืมอุปกรณ์', '2025-03-09 07:05:56', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 07:05:56', 1, 0),
(388, 2, 'ยืมอุปกรณ์', '2025-03-09 07:06:50', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 07:06:50', 1, 0),
(390, 3, 'ยืมอุปกรณ์', '2025-03-09 07:08:22', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 07:15:02', 2, 0),
(391, 3, 'ยืมอุปกรณ์', '2025-03-09 07:08:46', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 07:15:00', 2, 0),
(392, 3, 'ยืมอุปกรณ์', '2025-03-09 07:27:46', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 07:28:29', 2, 0),
(393, 17, 'ยืมอุปกรณ์', '2025-03-09 07:39:41', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 07:53:44', 2, 0),
(394, 3, 'ยืมอุปกรณ์', '2025-03-09 07:40:21', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 07:53:58', 2, 0),
(395, 3, 'ยืมอุปกรณ์', '2025-03-09 07:40:58', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 07:52:20', 2, 0),
(396, 3, 'ยืมอุปกรณ์', '2025-03-09 08:01:53', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 08:01:53', 1, 0),
(397, 3, 'ยืมอุปกรณ์', '2025-03-09 08:03:20', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 08:03:20', 1, 0),
(398, 3, 'ยืมอุปกรณ์', '2025-03-09 08:06:01', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 08:06:01', 1, 0),
(399, 3, 'ยืมอุปกรณ์', '2025-03-09 08:06:11', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 08:06:11', 1, 0),
(400, 3, 'ยืมอุปกรณ์', '2025-03-09 08:06:53', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 08:06:53', 1, 0),
(401, 3, 'ยืมอุปกรณ์', '2025-03-09 08:07:08', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 08:07:08', 1, 0),
(402, 3, 'ยืมอุปกรณ์', '2025-03-09 08:07:36', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 08:07:36', 1, 0),
(403, 17, 'ยืมอุปกรณ์', '2025-03-09 08:09:46', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 08:24:56', 2, 0),
(404, 3, 'ยืมอุปกรณ์', '2025-03-09 08:29:05', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 08:42:32', 2, 0),
(405, 3, 'ยืมอุปกรณ์', '2025-03-09 08:43:29', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 08:43:29', 1, 0),
(406, 3, 'ยืมอุปกรณ์', '2025-03-09 08:45:04', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 08:45:04', 1, 0),
(407, 2, 'ซื้อขายอุปกรณ์', '2025-03-09 16:05:01', 9, 2, NULL, NULL, NULL, NULL, 1, '2025-03-09 09:05:02', 1, 0),
(408, 17, 'ยืมอุปกรณ์', '2025-03-09 09:06:06', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 09:06:06', 1, 0);

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
(11, 'ยืมอุปกรณ์', 'ยืมอุปกรณ์'),
(12, 'ล้างเครื่่องปรับอากาศ', 'ล้างเครื่่องปรับอากาศ');

-- --------------------------------------------------------

--
-- Table structure for table `task_images`
--

CREATE TABLE `task_images` (
  `id` int NOT NULL,
  `task_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `uploaded_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `task_images`
--

INSERT INTO `task_images` (`id`, `task_id`, `image_url`, `uploaded_at`) VALUES
(12, 360, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741198622/task_images/s4knsgvt2ktnpxojelj8.png', '2025-03-06 01:16:51'),
(14, 362, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741431187/task_images/zjl1syqwnm3xtaeeddv1.png', '2025-03-08 17:52:54');

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
(64, 360, 6, 'สั่งงานเช่า', '2025-03-05 17:54:47'),
(65, 360, 6, 'ยกเลิกบริการงานเช่า(หมายเลข): 360 ', '2025-03-05 18:18:37'),
(66, 361, 6, 'สั่งงานเช่า', '2025-03-08 08:40:13'),
(67, 362, 6, 'สั่งงานเช่า', '2025-03-08 08:43:09'),
(68, 363, 6, 'สั่งออเดอร์', '2025-03-08 08:46:34'),
(69, 364, 6, 'สั่งงานเช่า', '2025-03-08 10:20:50'),
(70, 360, 6, 'แก้ไขงาน', '2025-03-08 12:56:26'),
(71, 361, 6, 'แก้ไขงาน', '2025-03-08 13:01:02'),
(72, 361, 6, 'แก้ไขงาน', '2025-03-08 13:01:27'),
(73, 360, 6, 'แก้ไขงาน', '2025-03-08 13:04:47'),
(74, 360, 6, 'แก้ไขงาน', '2025-03-08 13:07:53'),
(75, 360, 6, 'แก้ไขงาน', '2025-03-08 13:08:30'),
(76, 360, 6, 'แก้ไขงาน', '2025-03-08 13:08:54'),
(77, 360, 6, 'แก้ไขงาน', '2025-03-08 13:14:01'),
(78, 360, 6, 'แก้ไขงาน', '2025-03-08 13:15:15'),
(79, 361, 6, 'แก้ไขงาน', '2025-03-08 13:15:59'),
(80, 361, 6, 'แก้ไขงาน', '2025-03-08 13:16:25'),
(81, 361, 6, 'แก้ไขงาน', '2025-03-08 13:18:42'),
(82, 360, 6, 'แก้ไขงาน', '2025-03-08 14:00:21'),
(83, 365, 6, 'สั่งงานเช่า', '2025-03-08 15:20:03'),
(84, 366, 6, 'สั่งงานเช่า', '2025-03-08 15:20:27'),
(85, 367, 6, 'สั่งงานเช่า', '2025-03-08 15:21:08'),
(86, 368, 6, 'สั่งงานเช่า', '2025-03-08 15:21:29'),
(87, 369, 6, 'สั่งงานเช่า', '2025-03-08 15:21:44'),
(88, 370, 6, 'สั่งงานเช่า', '2025-03-08 15:22:01'),
(89, 371, 6, 'สั่งงานเช่า', '2025-03-08 15:22:15'),
(90, 402, 3, 'ยืมอุปกรณ์', '2025-03-09 08:07:36'),
(91, 403, 3, 'ยืมอุปกรณ์', '2025-03-09 08:09:47'),
(92, 404, 3, 'ยืมอุปกรณ์', '2025-03-09 08:29:06'),
(93, 405, 3, 'ยืมอุปกรณ์', '2025-03-09 08:43:29'),
(94, 406, 3, 'ยืมอุปกรณ์', '2025-03-09 08:45:05'),
(95, 408, 17, 'ยืมอุปกรณ์', '2025-03-09 09:06:07');

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
(1, 3, 'ไทย', b'1', 'จบใหม่', 'การตอบคำถามเชิงเทคนิคกับลูกค้า', 'completed', 'test', '2025-01-08', 7, 'a', 'a', 'a', 'a'),
(4, 17, 'ไทย', b'1', '-', '-', 'completed', 'xxx-xxx-xxxx', '2025-03-03', 1, '', '', '', '');

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
(1, '2025-01-16', 'กทม', 'natchapakjd@gmail.com', '0641160893', '2024-09-23 06:11:35', 'ช่างซ่อมบำรุง', 'โน้ตเพิ่มเติม', '2025-01-14', 'ช่าง', 'ในระบบ', 7, NULL, NULL, NULL, NULL),
(4, '2024-11-10', 'address', 'kookkaball68@gmail.com', '0641159783', '2024-11-11 06:36:13', 'ตำแหน่ง1', 'test', NULL, 'test1', 'test2', 7, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1731306972/image/applicant-images/gouwpp8w2iqeupoavl3p.jpg', NULL, NULL, NULL),
(5, '2024-11-21', 'address', 'kookkaball68@gmail.com', 'test1', '2024-11-13 08:30:05', 'ช่างติดตั้ง', 'test1', NULL, 'test1', 'test2', 7, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1731486605/image/applicant-images/tv5fy1m3jxs6vt35ux35.jpg', NULL, NULL, NULL);

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
(3, 'tech', '$2b$10$ltJ786G/tiUyM/bIJ1z/LeSyAqzCstfaGZsTNipj.1X0n3yZPd/S6', 'ช่าง', 'ในระบบ', 'tech@gmail.com', '0641159783', 7, 'กทม', '2024-09-12 07:18:25', 'U9cb564155dddeaa549d97a8747eed534', '2024-12-03', 'https://res.cloudinary.com/dq8euhi61/image/upload/v1734339351/image/user-image/ccej4bx32lwk4mkse6ym.png', 2, 1),
(6, 'member', '$2b$10$vTkQMsaHgsPOeXx.CtQYJ.ZAXjJv27HoevSjNNojGXNqoq025poXm', 'ลูกค้าedit', 'ในระบบ', 'asdasdas@gmail.com', '0641159783', 25, 'กทม', '2024-09-13 11:58:33', NULL, '2003-03-03', NULL, 1, 1),
(16, 'asdasd', '$2b$10$XnMMco59bzBIQI5BqjpOSez1gBTOVK9uxja3XlXXcFhhUD3LLGenC', 'as', 'asdsad', 'natchapakjxx@gmail.com', '0641159783', 18, 'asdsad', '2025-03-01 11:20:29', NULL, '2022-03-01', NULL, 1, 1),
(17, 'tech2', '$2b$10$fZLiNY0SFAiLS33h9O.X6.H00nknuB/2Yw64wHDglxqB7NPW2/RiW', 'tech2', 'tech2 lastname', 'tech2@gmail.com', '0641159783', 22, 'as', '2025-03-04 15:07:28', NULL, '2003-03-03', NULL, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `warehouses`
--

CREATE TABLE `warehouses` (
  `warehouse_id` int NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  `air_5_ton` int DEFAULT '0',
  `air_10_ton` int DEFAULT '0',
  `air_20_ton` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `warehouses`
--

INSERT INTO `warehouses` (`warehouse_id`, `location`, `capacity`, `air_5_ton`, `air_10_ton`, `air_20_ton`) VALUES
(1, 'กทม', 295, 97, 98, 100),
(2, 'โชคชัย4 62', 30, 0, 0, 0);

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
  ADD KEY `assignment_id` (`assignment_id`),
  ADD KEY `room_type_id` (`room_type_id`);

--
-- Indexes for table `area_images`
--
ALTER TABLE `area_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `area_calculation_id` (`area_calculation_id`);

--
-- Indexes for table `attributes`
--
ALTER TABLE `attributes`
  ADD PRIMARY KEY (`attribute_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `borrowing_details`
--
ALTER TABLE `borrowing_details`
  ADD PRIMARY KEY (`borrowing_detail_id`),
  ADD KEY `borrowing_id` (`borrowing_id`),
  ADD KEY `product_id` (`product_id`);

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
  ADD KEY `tech_id` (`tech_id`),
  ADD KEY `task_id` (`task_id`);

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
-- Indexes for table `room_types`
--
ALTER TABLE `room_types`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `task_images`
--
ALTER TABLE `task_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`);

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
  MODIFY `log_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `area_calculation_history`
--
ALTER TABLE `area_calculation_history`
  MODIFY `calculation_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=212;

--
-- AUTO_INCREMENT for table `area_images`
--
ALTER TABLE `area_images`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `attributes`
--
ALTER TABLE `attributes`
  MODIFY `attribute_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `borrowing_details`
--
ALTER TABLE `borrowing_details`
  MODIFY `borrowing_detail_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

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
  MODIFY `borrowing_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `gender`
--
ALTER TABLE `gender`
  MODIFY `gender_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=140;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

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
  MODIFY `product_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `product_type`
--
ALTER TABLE `product_type`
  MODIFY `product_type_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rental`
--
ALTER TABLE `rental`
  MODIFY `rental_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=126;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `room_types`
--
ALTER TABLE `room_types`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

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
  MODIFY `assignment_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=190;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `task_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=409;

--
-- AUTO_INCREMENT for table `tasktypes`
--
ALTER TABLE `tasktypes`
  MODIFY `task_type_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `task_images`
--
ALTER TABLE `task_images`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `task_log`
--
ALTER TABLE `task_log`
  MODIFY `log_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `technicians`
--
ALTER TABLE `technicians`
  MODIFY `tech_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `technician_applicants`
--
ALTER TABLE `technician_applicants`
  MODIFY `applicant_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `warehouses`
--
ALTER TABLE `warehouses`
  MODIFY `warehouse_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  ADD CONSTRAINT `area_calculation_history_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `taskassignments` (`assignment_id`),
  ADD CONSTRAINT `area_calculation_history_ibfk_2` FOREIGN KEY (`room_type_id`) REFERENCES `room_types` (`id`);

--
-- Constraints for table `area_images`
--
ALTER TABLE `area_images`
  ADD CONSTRAINT `area_images_ibfk_1` FOREIGN KEY (`area_calculation_id`) REFERENCES `area_calculation_history` (`calculation_id`) ON DELETE CASCADE;

--
-- Constraints for table `borrowing_details`
--
ALTER TABLE `borrowing_details`
  ADD CONSTRAINT `borrowing_details_ibfk_1` FOREIGN KEY (`borrowing_id`) REFERENCES `equipment_borrowing` (`borrowing_id`),
  ADD CONSTRAINT `borrowing_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `equipment_borrowing`
--
ALTER TABLE `equipment_borrowing`
  ADD CONSTRAINT `equipment_borrowing_ibfk_1` FOREIGN KEY (`tech_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `equipment_borrowing_ibfk_2` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`);

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
-- Constraints for table `task_images`
--
ALTER TABLE `task_images`
  ADD CONSTRAINT `task_images_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE;

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

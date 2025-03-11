-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: bv9lnhqaqmmb6bfuzy5v-mysql.services.clever-cloud.com:3306
-- Generation Time: Mar 11, 2025 at 07:43 PM
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
(59, 2, 'แก้ไขพื้นที่เดิม(หมายเลข): 208', '2025-03-09 10:29:45'),
(60, 2, 'ลบคำสั่งซื้อไอดี 114', '2025-03-10 10:46:59'),
(61, 2, 'ลบคำสั่งซื้อไอดี 114', '2025-03-10 10:47:04'),
(62, 2, 'เพิ่มสินค้าใหม่ชื่อ โต๊ะสแตนเลท', '2025-03-10 11:24:52'),
(63, 2, 'เพิ่มสินค้าใหม่ชื่อ เตาแก๊ส 2 หัว', '2025-03-10 11:27:47'),
(64, 2, 'เพิ่มสินค้าใหม่ชื่อ เตาแก๊ส 2 หัว', '2025-03-10 11:31:32'),
(65, 2, 'แก้ไขสินค้า26: description: เตาแก๊ส สแตนเลส 2หัว -> เตาแก๊ส สแตนเลส 2หัว พร้อมใช้งาน, product_image: undefined -> [object File]', '2025-03-10 11:32:01'),
(66, 2, 'ลบสินค้าไอดี 25 ชื่อสินค้า: เตาแก๊ส 2 หัว', '2025-03-10 11:32:08'),
(67, 2, 'เพิ่มสินค้าใหม่ชื่อ ตู้แช่ไวน์', '2025-03-10 11:32:56'),
(68, 2, 'เพิ่มสินค้าใหม่ชื่อ เก้าอี้สแตนเลส ', '2025-03-10 11:33:57'),
(69, 2, 'เพิ่มสินค้าใหม่ชื่อ ซิงค์ล้างจานสแตนเลท2หลุม', '2025-03-10 11:34:47'),
(70, 2, 'เพิ่มสินค้าใหม่ชื่อ เก้าอี้สแตนเลทขาเดี่ยว', '2025-03-10 11:35:20'),
(71, 2, 'เพิ่มสินค้าใหม่ชื่อ ถังแก๊ส', '2025-03-10 11:36:35'),
(72, 2, 'เพิ่มสินค้าใหม่ชื่อ คอมเพรสเซอร์แอร์', '2025-03-10 11:37:58'),
(73, 2, 'เพิ่มสินค้าใหม่ชื่อ ถังไนโตรเจน', '2025-03-10 11:38:35'),
(74, 2, 'เพิ่มสินค้าใหม่ชื่อ สายวัดไนโตรเจน', '2025-03-10 11:39:02'),
(75, 2, 'แก้ไขสินค้า3: price: 555 -> 0, brand_id: 1 -> 2, category_id: 2 -> 13, product_image: undefined -> null', '2025-03-10 11:40:57'),
(76, 2, 'แก้ไขสินค้า3: product_image: undefined -> [object File]', '2025-03-10 11:41:25'),
(77, 2, 'แก้ไขสินค้า7: name: สายส่ง O2 -> สายส่งออกซิเจน, description: สายส่ง O2 -> สายส่งออกซิเจน, price: 500 -> 0, brand_id: 1 -> 2, category_id: 2 -> 14, product_image: undefined -> [object File]', '2025-03-10 11:42:15'),
(78, 2, 'เพิ่มสินค้าใหม่ชื่อ ชุดเกจวัดแรงดันน้ำยาแอร์', '2025-03-10 11:44:20'),
(79, 2, 'เพิ่มสินค้าใหม่ชื่อ ะทส', '2025-03-10 11:53:30'),
(80, 2, 'ลบสินค้าไอดี 36 ชื่อสินค้า: ะทส', '2025-03-10 11:53:36'),
(81, 2, 'แก้ไขสินค้า34: product_type_id: 1 -> 2, product_image: undefined -> null', '2025-03-10 12:16:48'),
(82, 2, 'แก้ไขสินค้า33: product_type_id: 1 -> 2, product_image: undefined -> null', '2025-03-10 12:17:18'),
(83, 2, 'แก้ไขสินค้า32: product_type_id: 1 -> 2, product_image: undefined -> null', '2025-03-10 12:17:40'),
(84, 2, 'แก้ไขสินค้า31: product_type_id: 1 -> 2, product_image: undefined -> null', '2025-03-10 12:18:06'),
(85, 2, 'แก้ไขพื้นที่เดิม(หมายเลข): 208', '2025-03-10 15:30:09'),
(86, 2, 'แก้ไขพื้นที่เดิม(หมายเลข): 208', '2025-03-10 16:26:53'),
(87, 2, 'เพิ่มพื้นที่ใหม่โดยคำนวณพื้นที่(ชื่อสถานที่): ss', '2025-03-10 19:38:35'),
(88, 2, 'ลบพื้นที่(หมายเลข): 213 ss', '2025-03-10 19:38:40'),
(89, 2, 'ลบพื้นที่(หมายเลข): 212 ', '2025-03-10 19:38:42'),
(90, 2, 'ลบพื้นที่(หมายเลข): 211 เทส', '2025-03-10 19:38:45'),
(91, 2, 'ลบพื้นที่(หมายเลข): 210 asdasdasasd', '2025-03-10 19:38:50');

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
(208, 188, 'ท่าทราย', 56.00, 99.00, 50.00, 15, 25, 10, '[{\"id\":\"ac-1741623942883\",\"index\":0,\"row\":0,\"col\":0,\"type\":\"240000\",\"rotation\":90},{\"id\":\"ac-1741623942929\",\"index\":55,\"row\":0,\"col\":55,\"type\":\"240000\",\"rotation\":90},{\"id\":\"ac-1741623942981\",\"index\":5488,\"row\":98,\"col\":0,\"type\":\"240000\",\"rotation\":270},{\"id\":\"ac-1741623943033\",\"index\":5543,\"row\":98,\"col\":55,\"type\":\"240000\",\"rotation\":270},{\"id\":\"ac-1741623943089\",\"index\":19,\"row\":0,\"col\":19,\"type\":\"240000\",\"rotation\":90},{\"id\":\"ac-1741623943141\",\"index\":1064,\"row\":19,\"col\":0,\"type\":\"240000\",\"rotation\":0},{\"id\":\"ac-1741623943192\",\"index\":1119,\"row\":19,\"col\":55,\"type\":\"240000\",\"rotation\":180},{\"id\":\"ac-1741623943250\",\"index\":2128,\"row\":38,\"col\":0,\"type\":\"240000\",\"rotation\":0},{\"id\":\"ac-1741623943297\",\"index\":2183,\"row\":38,\"col\":55,\"type\":\"240000\",\"rotation\":180},{\"id\":\"ac-1741623943342\",\"index\":3192,\"row\":57,\"col\":0,\"type\":\"240000\",\"rotation\":0},{\"id\":\"ac-1741623943378\",\"index\":32,\"row\":0,\"col\":32,\"type\":\"120000\",\"rotation\":90},{\"id\":\"ac-1741623943415\",\"index\":2911,\"row\":51,\"col\":55,\"type\":\"120000\",\"rotation\":180},{\"id\":\"ac-1741623943446\",\"index\":3639,\"row\":64,\"col\":55,\"type\":\"120000\",\"rotation\":180},{\"id\":\"ac-1741623943476\",\"index\":3920,\"row\":70,\"col\":0,\"type\":\"120000\",\"rotation\":0},{\"id\":\"ac-1741623943509\",\"index\":4367,\"row\":77,\"col\":55,\"type\":\"120000\",\"rotation\":180},{\"id\":\"ac-1741623943539\",\"index\":4648,\"row\":83,\"col\":0,\"type\":\"120000\",\"rotation\":0},{\"id\":\"ac-1741623943569\",\"index\":5501,\"row\":98,\"col\":13,\"type\":\"120000\",\"rotation\":270},{\"id\":\"ac-1741623943600\",\"index\":5514,\"row\":98,\"col\":26,\"type\":\"120000\",\"rotation\":270},{\"id\":\"ac-1741623943630\",\"index\":5527,\"row\":98,\"col\":39,\"type\":\"120000\",\"rotation\":270},{\"id\":\"ac-1741623943660\",\"index\":741,\"row\":13,\"col\":13,\"type\":\"120000\",\"rotation\":0},{\"id\":\"ac-1741623943690\",\"index\":754,\"row\":13,\"col\":26,\"type\":\"120000\",\"rotation\":0},{\"id\":\"ac-1741623943717\",\"index\":767,\"row\":13,\"col\":39,\"type\":\"120000\",\"rotation\":0},{\"id\":\"ac-1741623943744\",\"index\":1469,\"row\":26,\"col\":13,\"type\":\"120000\",\"rotation\":0},{\"id\":\"ac-1741623943769\",\"index\":1482,\"row\":26,\"col\":26,\"type\":\"120000\",\"rotation\":0},{\"id\":\"ac-1741623943794\",\"index\":1495,\"row\":26,\"col\":39,\"type\":\"120000\",\"rotation\":0},{\"id\":\"ac-1741623943822\",\"index\":2197,\"row\":39,\"col\":13,\"type\":\"120000\",\"rotation\":0},{\"id\":\"ac-1741623943848\",\"index\":2210,\"row\":39,\"col\":26,\"type\":\"120000\",\"rotation\":0},{\"id\":\"ac-1741623943880\",\"index\":2223,\"row\":39,\"col\":39,\"type\":\"120000\",\"rotation\":0},{\"id\":\"ac-1741623943912\",\"index\":2925,\"row\":52,\"col\":13,\"type\":\"120000\",\"rotation\":0},{\"id\":\"ac-1741623943944\",\"index\":2938,\"row\":52,\"col\":26,\"type\":\"120000\",\"rotation\":0},{\"id\":\"ac-1741623943975\",\"index\":2951,\"row\":52,\"col\":39,\"type\":\"120000\",\"rotation\":0},{\"id\":\"ac-1741623944008\",\"index\":3653,\"row\":65,\"col\":13,\"type\":\"120000\",\"rotation\":0},{\"id\":\"ac-1741623944038\",\"index\":3666,\"row\":65,\"col\":26,\"type\":\"120000\",\"rotation\":0},{\"id\":\"ac-1741623944069\",\"index\":3679,\"row\":65,\"col\":39,\"type\":\"120000\",\"rotation\":0},{\"id\":\"ac-1741623944101\",\"index\":4381,\"row\":78,\"col\":13,\"type\":\"120000\",\"rotation\":0},{\"id\":\"ac-1741623944129\",\"index\":9,\"row\":0,\"col\":9,\"type\":\"60000\",\"rotation\":90},{\"id\":\"ac-1741623944162\",\"index\":41,\"row\":0,\"col\":41,\"type\":\"60000\",\"rotation\":90},{\"id\":\"ac-1741623944198\",\"index\":504,\"row\":9,\"col\":0,\"type\":\"60000\",\"rotation\":0},{\"id\":\"ac-1741623944227\",\"index\":559,\"row\":9,\"col\":55,\"type\":\"60000\",\"rotation\":180},{\"id\":\"ac-1741623944256\",\"index\":1568,\"row\":28,\"col\":0,\"type\":\"60000\",\"rotation\":0},{\"id\":\"ac-1741623944284\",\"index\":1623,\"row\":28,\"col\":55,\"type\":\"60000\",\"rotation\":180},{\"id\":\"ac-1741623944314\",\"index\":2632,\"row\":47,\"col\":0,\"type\":\"60000\",\"rotation\":0},{\"id\":\"ac-1741623944343\",\"index\":4871,\"row\":86,\"col\":55,\"type\":\"60000\",\"rotation\":180},{\"id\":\"ac-1741623944374\",\"index\":4166,\"row\":74,\"col\":22,\"type\":\"60000\",\"rotation\":0},{\"id\":\"ac-1741623944404\",\"index\":4175,\"row\":74,\"col\":31,\"type\":\"60000\",\"rotation\":0},{\"id\":\"ac-1741623944436\",\"index\":4184,\"row\":74,\"col\":40,\"type\":\"60000\",\"rotation\":0},{\"id\":\"ac-1741623944469\",\"index\":4670,\"row\":83,\"col\":22,\"type\":\"60000\",\"rotation\":0},{\"id\":\"ac-1741623944502\",\"index\":4679,\"row\":83,\"col\":31,\"type\":\"60000\",\"rotation\":0},{\"id\":\"ac-1741623944535\",\"index\":4688,\"row\":83,\"col\":40,\"type\":\"60000\",\"rotation\":0},{\"id\":\"ac-1741623944568\",\"index\":4881,\"row\":87,\"col\":9,\"type\":\"60000\",\"rotation\":0}]', 9),
(209, 188, 'ฟปฟปแ', 30.00, 30.00, 6.00, 0, 0, 6, '[{\"id\":\"ac-1741515054516\",\"index\":0,\"row\":0,\"col\":0,\"type\":\"240000\",\"rotation\":90},{\"id\":\"ac-1741515054518\",\"index\":29,\"row\":0,\"col\":29,\"type\":\"240000\",\"rotation\":90},{\"id\":\"ac-1741515054525\",\"index\":870,\"row\":29,\"col\":0,\"type\":\"240000\",\"rotation\":270},{\"id\":\"box-1741515056756\",\"index\":899,\"row\":29,\"col\":29,\"type\":\"twentyton\",\"rotation\":270},{\"id\":\"box-1741515062661\",\"index\":885,\"row\":29,\"col\":15,\"type\":\"twentyton\",\"rotation\":270},{\"id\":\"box-1741515066084\",\"index\":14,\"row\":0,\"col\":14,\"type\":\"twentyton\",\"rotation\":90}]', 1);

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

--
-- Dumping data for table `borrowing_details`
--

INSERT INTO `borrowing_details` (`borrowing_detail_id`, `borrowing_id`, `product_id`, `quantity`) VALUES
(53, 29, 35, 1),
(54, 29, 34, 1),
(55, 29, 33, 1),
(56, 29, 32, 1);

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
(1, 'Haier', 'ไฮเออร์1'),
(2, 'ไม่ระบุ', 'ไม่ระบุ');

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
(1, 'แอร์ตัน', 'แอร์ตัน สำหรับงานเช่า'),
(2, 'อะไหล่', 'อะไหล่อุปกรณ์'),
(3, 'พัดลม', 'พัดลมไอน้ำ'),
(4, 'โต๊ะ', 'โต๊ะ'),
(5, 'ตู้แช่เย็น', 'ตู้แช่เย็น พร้อมใช้งาน'),
(6, 'เก้าอี้สแตนเลส ', '570x500x560 กว้างxยาวxสูง'),
(7, 'ซิงค์', 'ซิงค์ล้างจาน'),
(8, 'ถังแก๊ส', 'ถังแก๊ส'),
(9, 'คอมเพรสเซอร์แอร์', 'คอมเพรสเซอร์แอร์'),
(10, 'ถังไนโตรเจน', 'ถังไนโตรเจน\n'),
(11, 'สายวัดไนโตรเจน', 'สายวัดไนโตรเจน\n'),
(12, 'เตาแก๊ส', 'เตาแก๊ส'),
(13, 'น้ำยาถังแอร์', 'น้ำยาถังแอร์'),
(14, 'สายส่งออกซิเจน', 'สายส่งออกซิเจน'),
(15, 'ชุดเกจวัดแรงดันน้ำยาแอร์', 'ชุดเกจวัดแรงดันน้ำยาแอร์');

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

--
-- Dumping data for table `equipment_borrowing`
--

INSERT INTO `equipment_borrowing` (`borrowing_id`, `tech_id`, `borrow_date`, `return_date`, `task_id`, `image_url`) VALUES
(29, 3, '2025-03-11', '2025-03-13', 437, NULL);

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
(106, '2025-03-09 09:05:02', 2, 64000.00, 407),
(111, '2025-03-10 09:44:07', 6, 32000.00, 421),
(113, '2025-03-10 09:50:20', 6, 105000.00, 423),
(115, '2025-03-10 10:38:21', 6, 150000.00, 426),
(116, '2025-03-10 10:44:35', 6, 45000.00, 427),
(117, '2025-03-10 14:57:26', 6, 45000.00, 429),
(118, '2025-03-10 14:57:46', 6, 197000.00, 430),
(119, '2025-03-10 14:58:28', 6, 137000.00, 431),
(120, '2025-03-10 14:59:19', 6, 317000.00, 432),
(121, '2025-03-10 17:40:08', 6, 0.00, 439),
(122, '2025-03-10 17:46:46', 6, 0.00, 440),
(123, '2025-03-10 17:48:12', 6, 0.00, 442),
(124, '2025-03-10 17:49:38', 6, 0.00, 444);

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
(139, 106, 'แอร์ 60000BTU', 2, 32000.00, 9, 64000.00),
(148, 111, 'แอร์ 60000BTU', 1, 32000.00, 9, 32000.00),
(150, 113, 'แอร์ 120000BTU', 1, 45000.00, 10, 45000.00),
(151, 113, 'แอร์ 20ตัน', 1, 60000.00, 11, 60000.00),
(154, 115, 'แอร์ 120000BTU', 2, 45000.00, 10, 90000.00),
(155, 115, 'แอร์ 20ตัน', 1, 60000.00, 11, 60000.00),
(156, 116, 'แอร์ 120000BTU', 1, 45000.00, 10, 45000.00),
(157, 117, 'แอร์ 120000BTU', 1, 45000.00, 10, 45000.00),
(158, 118, 'แอร์ 120000BTU', 1, 45000.00, 10, 45000.00),
(159, 118, 'แอร์ 20ตัน', 2, 60000.00, 11, 120000.00),
(160, 118, 'แอร์ 60000BTU', 1, 32000.00, 9, 32000.00),
(161, 119, 'แอร์ 120000BTU', 1, 45000.00, 10, 45000.00),
(162, 119, 'แอร์ 20ตัน', 1, 60000.00, 11, 60000.00),
(163, 119, 'แอร์ 60000BTU', 1, 32000.00, 9, 32000.00),
(164, 120, 'แอร์ 120000BTU', 5, 45000.00, 10, 225000.00),
(165, 120, 'แอร์ 20ตัน', 1, 60000.00, 11, 60000.00),
(166, 120, 'แอร์ 60000BTU', 1, 32000.00, 9, 32000.00),
(167, 121, 'ชุดเกจวัดแรงดันน้ำยาแอร์', 8, 0.00, 35, 0.00),
(168, 122, 'ชุดเกจวัดแรงดันน้ำยาแอร์', 1, 0.00, 35, 0.00),
(169, 123, 'ชุดเกจวัดแรงดันน้ำยาแอร์', 1, 0.00, 35, 0.00),
(170, 123, 'สายวัดไนโตรเจน', 1, 0.00, 34, 0.00),
(171, 124, 'ชุดเกจวัดแรงดันน้ำยาแอร์', 8, 0.00, 35, 0.00),
(172, 124, 'สายวัดไนโตรเจน', 1, 0.00, 34, 0.00);

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
(28, 6, 363, 64000.00, NULL, 1, NULL, 1, '2025-03-08 08:46:34'),
(29, 6, 409, 3616000.00, NULL, 1, NULL, NULL, '2025-03-10 05:12:33'),
(30, 6, 410, 315000.00, NULL, 1, NULL, NULL, '2025-03-10 05:19:29'),
(31, 6, 418, 4500000.00, NULL, 1, NULL, NULL, '2025-03-10 09:31:22'),
(32, 6, 419, 6750000.00, NULL, 1, NULL, NULL, '2025-03-10 09:32:04'),
(33, 6, 422, 32000.00, NULL, 1, NULL, 1, '2025-03-10 09:44:10'),
(34, 6, 423, 105000.00, NULL, 1, NULL, NULL, '2025-03-10 09:50:21'),
(35, 6, 425, 11520000.00, NULL, 1, NULL, NULL, '2025-03-10 10:11:36'),
(36, 6, 426, 150000.00, NULL, 1, NULL, 1, '2025-03-10 10:38:22'),
(37, 6, 427, 45000.00, NULL, 1, NULL, NULL, '2025-03-10 10:44:36'),
(38, 6, 429, 45000.00, NULL, 1, NULL, NULL, '2025-03-10 14:57:27'),
(39, 6, 430, 197000.00, NULL, 1, NULL, NULL, '2025-03-10 14:57:47'),
(40, 6, 431, 137000.00, NULL, 1, NULL, NULL, '2025-03-10 14:58:29'),
(41, 6, 432, 317000.00, NULL, 1, NULL, NULL, '2025-03-10 14:59:20'),
(42, 6, 439, 0.00, NULL, 1, NULL, NULL, '2025-03-10 17:40:09'),
(43, 6, 440, 0.00, NULL, 1, NULL, 1, '2025-03-10 17:46:47'),
(44, 6, 442, 0.00, NULL, 1, NULL, 1, '2025-03-10 17:48:13'),
(45, 6, 444, 0.00, NULL, 1, NULL, NULL, '2025-03-10 17:49:38');

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
(3, 'น้ำยาถังแอร์', 'น้ำยาถังแอร์', 0.00, 3, 2, 13, 1, 2, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741606884/image/product-image/x36lsespb8jrk4ygzxgy.jpg', NULL),
(7, 'สายส่งออกซิเจน', 'สายส่งออกซิเจน', 0.00, 6, 2, 14, 1, 2, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741606934/image/product-image/smrqi4im7d5kflheocdg.jpg', NULL),
(9, 'แอร์ 60000BTU', 'แอร์ 60000BTU', 32000.00, 30, 1, 1, 1, 1, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1731303511/image/product-image/auzogejxhg5j136xyfhr.jpg', NULL),
(10, 'แอร์ 120000BTU', 'แอร์ 120000BTU', 45000.00, 30, 1, 1, 1, 1, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1731303568/image/product-image/g5a1tek8uzzvtzvhwgok.jpg', NULL),
(11, 'แอร์ 20ตัน', 'แอร์ 20ตัน', 60000.00, 30, 1, 1, 1, 1, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1731303611/image/product-image/uxoqcldpmcygu4oavnhb.jpg', NULL),
(24, 'โต๊ะสแตนเลท', '730x1050x750 มม. กว้างxยาวxสูง', 4900.00, 5, 2, 3, 1, 1, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741605891/image/product-image/vdbtkgg83oan3u0fkcu8.jpg', NULL),
(26, 'เตาแก๊ส 2 หัว', 'เตาแก๊ส สแตนเลส 2หัว พร้อมใช้งาน', 12000.00, 2, 2, 12, 1, 3, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741606320/image/product-image/q1ak4seqxbqohnfjijfg.jpg', NULL),
(27, 'ตู้แช่ไวน์', 'ทำความเย็นด้วยระบบ thermoelectric, บรรจุไวน์ได้ 12 ขวด, ไม่มีสาร cfc เป็นมิตรต่อสิ่งแวดล้อม', 8500.00, 1, 2, 5, 1, 3, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741606375/image/product-image/qaow1blhke1cyp6cqdm5.jpg', NULL),
(28, 'เก้าอี้สแตนเลส ', 'detail 570x500x560 กว้างxยาวxสูง', 2100.00, 1, 2, 6, 1, 1, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741606436/image/product-image/nppeghomizairmmesy82.jpg', NULL),
(29, 'ซิงค์ล้างจานสแตนเลท2หลุม', 'ซิงค์ล้างจานสแตนเลท2หลุม 500x830x800  กว้างxยาวxสูง ', 8900.00, 1, 2, 7, 1, 1, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741606486/image/product-image/v55hdebzxv0ght2kaid8.jpg', NULL),
(30, 'เก้าอี้สแตนเลทขาเดี่ยว', 'สูงจากพื้น 30 ซม. รัศมีที่นั่ง 30ซม', 400.00, 1, 2, 6, 1, 1, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741606518/image/product-image/hca0hfrilfzg9cvyabmc.jpg', NULL),
(31, 'ถังแก๊ส', 'ถังแก๊ส', 0.00, 1, 2, 8, 1, 2, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741606593/image/product-image/iitlyurerbhw3tqdk4tl.jpg', NULL),
(32, 'คอมเพรสเซอร์แอร์', 'คอมเพรสเซอร์แอร์ สำหรับการยืม', 0.00, 1, 2, 9, 1, 2, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741606677/image/product-image/htraltjgjmz9zxiyqut7.jpg', NULL),
(33, 'ถังไนโตรเจน', 'ถังไนโตรเจน\r\n', 0.00, 5, 2, 10, 1, 2, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741606714/image/product-image/gv2are4gil8clq4zse9v.jpg', NULL),
(34, 'สายวัดไนโตรเจน', 'สายวัดไนโตรเจน', 0.00, 5, 2, 11, 1, 2, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741606741/image/product-image/jsqh1uafsaeu7ffpuwt9.jpg', NULL),
(35, 'ชุดเกจวัดแรงดันน้ำยาแอร์', 'ชุดเกจวัดแรงดันน้ำยาแอร์', 0.00, 5, 2, 15, 1, 2, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741607059/image/product-image/vubhjvobebdhsk86qupl.jpg', NULL);

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
(125, 362, 9, '2025-03-10', '2025-03-13', 1),
(126, 411, NULL, '2025-03-12', '2025-03-16', 0),
(127, 412, NULL, '2025-03-12', '2025-03-16', 0),
(128, 413, NULL, '2025-03-12', '2025-03-16', 0),
(129, 414, NULL, '2025-03-12', '2025-03-16', 0),
(130, 415, NULL, '2025-03-12', '2025-03-16', 0),
(133, 420, NULL, '2025-03-12', '2025-03-14', 0),
(134, 428, NULL, '2025-03-12', '2025-03-14', 0),
(135, 433, NULL, '2025-03-13', '2025-03-16', 0),
(136, 434, NULL, '2025-03-12', '2025-03-14', 0),
(137, 435, NULL, '2025-03-12', '2025-03-14', 0),
(138, 436, NULL, '2025-03-12', '2025-03-14', 0),
(139, 361, 35, '2025-03-10', '2025-03-12', 1),
(140, 438, NULL, '2025-03-12', '2025-03-21', 0),
(141, 362, 35, '2025-03-10', '2025-03-13', 2),
(142, 362, 34, '2025-03-10', '2025-03-13', 2),
(143, 441, NULL, '2025-03-13', '2025-03-22', 0),
(144, 443, NULL, '2025-03-14', '2025-03-15', 0),
(145, 445, NULL, '2025-03-13', '2025-03-20', 0),
(146, 446, NULL, '2025-03-12', '2025-03-21', 0),
(147, 366, 35, '2025-03-11', '2025-03-15', 1),
(148, 366, 34, '2025-03-11', '2025-03-15', 4);

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
(190, 362, 1, '2025-03-10 17:42:07');

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
(361, 6, 'ฟหกหฟก', '2025-03-08 08:40:12', 1, 11, 'Siam Paragon, 991, Rama I Road, Siam, Pathum Wan Subdistrict, Pathum Wan District, Bangkok, 10330, Thailand', '2025-03-10 08:00:00', 13.74677845, 100.53495403, 1, '2025-03-10 17:18:31', 4, 5000),
(362, 6, 'sasadsad', '2025-03-08 08:43:08', 1, 9, 'asdsad', '2025-03-10 17:00:00', 13.74861345, 100.49830288, 1, '2025-03-10 17:44:03', 4, 0),
(363, 6, 'ซื้อขายอุปกรณ์', '2025-03-08 15:46:20', 9, 2, NULL, NULL, NULL, NULL, 1, '2025-03-08 08:46:33', 1, 0),
(364, 6, 'asdsad', '2025-03-08 10:20:50', 12, 0, 'asdsad', '2025-03-13 20:00:00', NULL, NULL, 1, '2025-03-08 15:18:33', 2, 0),
(365, 6, 'เทสระบบ', '2025-03-08 15:20:03', 1, 0, 'sadsaddsa', '2025-03-10 23:20:00', NULL, NULL, 1, '2025-03-08 15:20:03', 1, 0),
(366, 6, 'เทสระบบ', '2025-03-08 15:20:27', 1, 5, 'asdasdหฟกฟหก', '2025-03-11 23:30:00', NULL, NULL, 1, '2025-03-10 18:22:58', 4, 0),
(367, 6, 'ฟหกฟหก', '2025-03-08 15:21:08', 1, 0, 'ฟหกหฟกฟหก', '2025-03-13 22:20:00', NULL, NULL, 1, '2025-03-08 15:21:08', 1, 0),
(368, 6, 'หกฟกหฟก', '2025-03-08 15:21:28', 1, 0, 'หฟกฟหกฟหก', '2025-03-13 22:30:00', NULL, NULL, 1, '2025-03-08 15:21:28', 1, 0),
(369, 6, 'ฟหกหฟกฟห', '2025-03-08 15:21:43', 1, 0, 'กฟหกหฟก', '2025-03-19 22:21:00', NULL, NULL, 1, '2025-03-08 15:21:43', 1, 0),
(370, 6, 'ฟหกหฟก', '2025-03-08 15:22:00', 1, 0, 'หฟกหฟกหฟก', '2025-03-15 22:21:00', NULL, NULL, 1, '2025-03-08 15:22:00', 1, 0),
(371, 6, 'ฟหกหฟก', '2025-03-08 15:22:14', 1, 0, 'หฟกฟหก', '2025-03-20 22:22:00', NULL, NULL, 0, '2025-03-09 18:30:09', 1, 0),
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
(408, 17, 'ยืมอุปกรณ์', '2025-03-09 09:06:06', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-09 09:06:06', 1, 0),
(409, 6, 'ซื้อขายอุปกรณ์', '2025-03-10 05:12:33', 9, 113, NULL, NULL, NULL, NULL, 1, '2025-03-10 05:12:33', 1, 0),
(410, 6, 'ซื้อขายอุปกรณ์', '2025-03-10 05:19:29', 9, 7, NULL, NULL, NULL, NULL, 1, '2025-03-10 05:19:28', 1, 0),
(411, 6, 'สา่นขนานบย', '2025-03-10 05:25:09', 1, 0, 'pattaya 12300', '2025-03-12 12:26:00', NULL, NULL, 1, '2025-03-10 05:25:09', 1, 0),
(412, 6, 'สา่นขนานบย', '2025-03-10 05:25:12', 1, 0, 'pattaya 12300', '2025-03-12 12:26:00', NULL, NULL, 0, '2025-03-10 05:28:21', 1, 0),
(413, 6, 'สา่นขนานบย', '2025-03-10 05:25:13', 1, 0, 'pattaya 12300', '2025-03-12 12:26:00', NULL, NULL, 0, '2025-03-10 05:28:23', 1, 0),
(414, 6, 'สา่นขนานบย', '2025-03-10 05:25:13', 1, 0, 'pattaya 12300', '2025-03-12 12:26:00', NULL, NULL, 1, '2025-03-10 05:25:13', 1, 0),
(415, 6, 'สา่นขนานบย', '2025-03-10 05:25:13', 1, 0, 'pattaya 12300', '2025-03-12 12:26:00', NULL, NULL, 1, '2025-03-10 05:25:13', 1, 0),
(418, 6, 'ซื้อขายอุปกรณ์', '2025-03-10 16:31:20', 9, 100, NULL, NULL, NULL, NULL, 1, '2025-03-10 09:31:21', 1, 0),
(419, 6, 'ซื้อขายอุปกรณ์', '2025-03-10 16:32:02', 9, 113, NULL, NULL, NULL, NULL, 1, '2025-03-10 09:32:03', 1, 0),
(420, 6, 'assad', '2025-03-10 09:36:33', 1, 0, 'asdsad', '2025-03-12 16:36:00', NULL, NULL, 1, '2025-03-10 09:36:33', 1, 0),
(421, 6, 'ซื้อขายอุปกรณ์', '2025-03-10 16:44:05', 9, 1, NULL, NULL, NULL, NULL, 1, '2025-03-10 09:44:06', 1, 0),
(422, 6, 'ซื้อขายอุปกรณ์', '2025-03-10 16:44:08', 9, 1, NULL, NULL, NULL, NULL, 1, '2025-03-10 09:44:09', 1, 0),
(423, 6, 'ซื้อขายอุปกรณ์', '2025-03-10 16:50:19', 9, 2, NULL, NULL, NULL, NULL, 1, '2025-03-10 09:50:20', 1, 0),
(424, 3, 'ยืมอุปกรณ์', '2025-03-10 09:59:47', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-10 09:59:47', 1, 0),
(425, 6, 'ซื้อขายอุปกรณ์', '2025-03-10 17:11:34', 9, 192, NULL, NULL, NULL, NULL, 1, '2025-03-10 10:11:35', 1, 0),
(426, 6, 'ซื้อขายอุปกรณ์', '2025-03-10 17:38:20', 9, 3, NULL, NULL, NULL, NULL, 1, '2025-03-10 10:38:21', 1, 0),
(427, 6, 'ซื้อขายอุปกรณ์', '2025-03-10 17:44:33', 9, 1, NULL, NULL, NULL, NULL, 1, '2025-03-10 11:08:14', 2, 0),
(428, 6, 'ฟหกหฟกหฟ', '2025-03-10 14:50:04', 1, 0, 'ฟหกหฟก', '2025-03-12 21:49:00', 13.82207820, 100.49537659, 1, '2025-03-10 14:50:04', 1, 0),
(429, 6, 'ซื้อขายอุปกรณ์', '2025-03-10 21:57:26', 9, 1, NULL, NULL, NULL, NULL, 1, '2025-03-10 14:57:26', 1, 0),
(430, 6, 'ซื้อขายอุปกรณ์', '2025-03-10 21:57:46', 9, 4, NULL, NULL, NULL, NULL, 1, '2025-03-10 14:57:46', 1, 0),
(431, 6, 'ซื้อขายอุปกรณ์', '2025-03-10 21:58:27', 9, 3, NULL, NULL, NULL, NULL, 1, '2025-03-10 14:58:27', 1, 0),
(432, 6, 'ซื้อขายอุปกรณ์', '2025-03-10 21:59:19', 9, 7, NULL, NULL, NULL, NULL, 1, '2025-03-10 14:59:19', 1, 0),
(433, 6, 'kuy', '2025-03-10 16:02:40', 12, 0, '123/21', '2025-03-13 23:01:00', NULL, NULL, 1, '2025-03-10 18:20:07', 2, 0),
(434, 6, 'ลิงอุกะๆ', '2025-03-10 16:07:28', 1, 0, 'ท่าทราย, Ban Dong Daeng, Sila Lat District, Si Sa Ket Province, Thailand', '2025-03-12 23:07:00', 15.40963085, 104.02211867, 1, '2025-03-10 16:07:28', 1, 0),
(435, 6, 'ลิงอุกะๆ', '2025-03-10 16:07:29', 1, 0, 'ท่าทราย, Ban Dong Daeng, Sila Lat District, Si Sa Ket Province, Thailand', '2025-03-12 23:07:00', 15.40963085, 104.02211867, 0, '2025-03-10 16:10:45', 1, 0),
(436, 6, 'ลิงอุกะๆ', '2025-03-10 16:07:29', 1, 0, 'ท่าทราย, Ban Dong Daeng, Sila Lat District, Si Sa Ket Province, Thailand', '2025-03-12 23:07:00', 15.40963085, 104.02211867, 0, '2025-03-10 16:10:43', 1, 0),
(437, 3, 'ยืมอุปกรณ์', '2025-03-10 16:38:39', 11, NULL, NULL, NULL, NULL, NULL, 1, '2025-03-10 16:54:06', 2, 0),
(438, 6, 'lets go', '2025-03-10 17:27:59', 1, 0, 'Wat Dhammongkol, Soi Punnawithi 22, Bang Chak Subdistrict, Phra Khanong District, Bangkok, 10260, Thailand', '2025-03-12 00:27:00', 13.68808690, 100.61544530, 1, '2025-03-10 17:27:59', 1, 0),
(439, 6, 'ซื้อขายอุปกรณ์', '2025-03-10 17:40:08', 9, 8, NULL, NULL, NULL, NULL, 1, '2025-03-10 17:40:08', 1, 0),
(440, 6, 'ซื้อขายอุปกรณ์', '2025-03-10 17:46:46', 9, 1, NULL, NULL, NULL, NULL, 1, '2025-03-10 17:46:46', 1, 0),
(441, 6, 'เช่า', '2025-03-10 17:47:54', 1, 0, 'เทส', '2025-03-13 00:47:00', 13.77264735, 100.51123179, 1, '2025-03-10 17:47:54', 1, 0),
(442, 6, 'ซื้อขายอุปกรณ์', '2025-03-10 17:48:13', 9, 2, NULL, NULL, NULL, NULL, 1, '2025-03-10 17:48:12', 1, 0),
(443, 6, 'ล้าง', '2025-03-10 17:49:05', 12, 0, 'เทสล้าง', '2025-03-14 00:48:00', 13.73443555, 100.50043760, 1, '2025-03-10 17:49:05', 1, 0),
(444, 6, 'ซื้อขายอุปกรณ์', '2025-03-10 17:49:38', 9, 9, NULL, NULL, NULL, NULL, 1, '2025-03-10 17:49:38', 1, 0),
(445, 6, '3432423342234', '2025-03-10 17:57:11', 1, 0, '4234234234', '2025-03-13 02:57:00', NULL, NULL, 1, '2025-03-10 17:57:11', 1, 0),
(446, 6, 'หฟกฟหก', '2025-03-10 17:59:39', 1, 0, 'หฟกหฟก', '2025-03-12 00:59:00', NULL, NULL, 1, '2025-03-10 17:59:39', 1, 0);

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
(14, 362, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741431187/task_images/zjl1syqwnm3xtaeeddv1.png', '2025-03-08 17:52:54'),
(17, 411, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741584310/task_images/bv76hguv9im4f1yrhfnq.jpg', '2025-03-10 05:25:14'),
(18, 411, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741584313/task_images/tgi1egoa3rf3pomlbjvb.webp', '2025-03-10 05:25:14'),
(19, 412, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741584313/task_images/iiaxswvbmfhwonpb8qwu.jpg', '2025-03-10 05:25:17'),
(20, 412, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741584316/task_images/grrbgzfm6iikqtwkskol.webp', '2025-03-10 05:25:17'),
(21, 413, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741584314/task_images/r8fzhnjh8e08riukjonu.jpg', '2025-03-10 05:25:18'),
(22, 413, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741584317/task_images/vth2urhjrencl5v115if.webp', '2025-03-10 05:25:18'),
(23, 415, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741584315/task_images/wqnnft7pcixgsi3ntkim.jpg', '2025-03-10 05:25:18'),
(24, 415, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741584317/task_images/oakxaq6dxenbawqdag3t.webp', '2025-03-10 05:25:18'),
(25, 414, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741584315/task_images/fbisyo8j0bsillwogdxf.jpg', '2025-03-10 05:25:18'),
(26, 414, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741584317/task_images/mzxruridnwesndsm20r9.webp', '2025-03-10 05:25:18'),
(29, 361, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741585136/task_images/oqrg4zmur77pxulutzv5.jpg', '2025-03-10 05:38:57'),
(30, 361, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741585158/task_images/bvhnkg6k8jv3k1o3meua.jpg', '2025-03-10 05:39:19'),
(31, 361, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741585168/task_images/eouvbhqhwo9scyrrmbqv.gif', '2025-03-10 05:39:29'),
(32, 361, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741585184/task_images/llv6fjmn7niyjnjvdiuz.jpg', '2025-03-10 05:39:45'),
(34, 420, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741599396/task_images/lprzkkr3xjy5rhucrtmf.png', '2025-03-10 16:36:38'),
(35, 420, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741599397/task_images/aunvhfcmykfpfxdknxxh.png', '2025-03-10 16:36:38'),
(36, 420, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741599399/task_images/epdoboujhq5dcurjtvjc.png', '2025-03-10 16:36:38'),
(38, 428, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741618207/task_images/i4yzlgpnu2ml5bxgaybl.jpg', '2025-03-10 21:50:08'),
(39, 433, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741622562/task_images/ksifshrwqmhccytw8uxy.jpg', '2025-03-10 16:02:43'),
(40, 441, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741628876/task_images/pwufskqfhv9rfoahmr21.png', '2025-03-10 17:47:57'),
(41, 443, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741628948/task_images/s09fkfjvvwpj243n9fp4.png', '2025-03-10 17:49:09'),
(42, 361, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741631950/task_images/llgibxufgv9k5baz5et6.jpg', '2025-03-10 18:39:11'),
(43, 361, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741631951/task_images/x57z82tjf9hjqtagvxwa.jpg', '2025-03-10 18:39:12');

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
(95, 408, 17, 'ยืมอุปกรณ์', '2025-03-09 09:06:07'),
(96, 409, 6, 'สั่งออเดอร์', '2025-03-10 05:12:34'),
(97, 410, 6, 'สั่งออเดอร์', '2025-03-10 05:19:29'),
(98, 411, 6, 'สั่งงานเช่า', '2025-03-10 05:25:14'),
(99, 412, 6, 'สั่งงานเช่า', '2025-03-10 05:25:17'),
(100, 413, 6, 'สั่งงานเช่า', '2025-03-10 05:25:18'),
(101, 415, 6, 'สั่งงานเช่า', '2025-03-10 05:25:18'),
(102, 414, 6, 'สั่งงานเช่า', '2025-03-10 05:25:19'),
(106, 418, 6, 'สั่งออเดอร์', '2025-03-10 09:31:22'),
(107, 419, 6, 'สั่งออเดอร์', '2025-03-10 09:32:04'),
(108, 420, 6, 'สั่งงานเช่า', '2025-03-10 09:36:40'),
(109, 422, 6, 'สั่งออเดอร์', '2025-03-10 09:44:10'),
(110, 423, 6, 'สั่งออเดอร์', '2025-03-10 09:50:21'),
(111, 424, 3, 'Borrow Equipment', '2025-03-10 09:59:48'),
(112, 425, 6, 'สั่งออเดอร์', '2025-03-10 10:11:36'),
(113, 428, 6, 'สั่งงานเช่า', '2025-03-10 14:50:08'),
(114, 433, 6, 'สั่งงานเช่า', '2025-03-10 16:02:43'),
(115, 434, 6, 'สั่งงานเช่า', '2025-03-10 16:07:29'),
(116, 435, 6, 'สั่งงานเช่า', '2025-03-10 16:07:29'),
(117, 436, 6, 'สั่งงานเช่า', '2025-03-10 16:07:30'),
(118, 437, 3, 'ยืมอุปกรณ์', '2025-03-10 16:38:40'),
(119, 438, 6, 'สั่งงานเช่า', '2025-03-10 17:27:59'),
(120, 439, 6, 'สั่งออเดอร์', '2025-03-10 17:40:09'),
(121, 440, 6, 'สั่งออเดอร์', '2025-03-10 17:46:47'),
(122, 441, 6, 'สั่งงานเช่า', '2025-03-10 17:47:57'),
(123, 442, 6, 'สั่งออเดอร์', '2025-03-10 17:48:13'),
(124, 443, 6, 'สั่งงานเช่า', '2025-03-10 17:49:08'),
(125, 444, 6, 'สั่งออเดอร์', '2025-03-10 17:49:39'),
(126, 445, 6, 'สั่งงานเช่า', '2025-03-10 17:57:12'),
(127, 446, 6, 'สั่งงานเช่า', '2025-03-10 17:59:39'),
(130, 433, 6, 'แก้ไขงาน', '2025-03-10 18:20:08');

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
(5, '2024-11-21', 'address', 'kookkaball68@gmail.com', 'test1', '2024-11-13 08:30:05', 'ช่างติดตั้ง', 'test1', NULL, 'test1', 'test2', 7, 'https://res.cloudinary.com/dq8euhi61/image/upload/v1731486605/image/applicant-images/tv5fy1m3jxs6vt35ux35.jpg', NULL, NULL, NULL),
(10, '2003-02-11', '4425/121', 'benten-3112312320@hotmail.com', '0625061913', '2025-03-10 05:08:01', 'ช่างซ่อมบำรุง', 'ค', NULL, 'สิงหา', 'สาหิ', 1, NULL, NULL, NULL, NULL);

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
(2, 'admin', '$2b$10$ThT9xSLUiZ4ZwAYZshVf6ulBktjc6tImodfFr8Uf9IME1SDI.Q.XW', 'firstname', 'lastname', 'admin@gmail.com', '0641159783', 5, 'กทม', '2024-09-11 12:32:23', 'U9cb564155dddeaa549d97a8747eed534', '2027-12-26', NULL, 3, 1),
(3, 'tech', '$2b$10$ltJ786G/tiUyM/bIJ1z/LeSyAqzCstfaGZsTNipj.1X0n3yZPd/S6', 'ช่าง', 'ในระบบ', 'tech@gmail.com', '0641159783', 7, 'กทม', '2024-09-12 07:18:25', 'U9cb564155dddeaa549d97a8747eed534', '2024-12-03', NULL, 2, 1),
(6, 'member', '$2b$10$vTkQMsaHgsPOeXx.CtQYJ.ZAXjJv27HoevSjNNojGXNqoq025poXm', 'ลูกค้าedit', 'ในระบบ', 'asdasdas@gmail.com', '0641159783', 25, 'กทม', '2024-09-13 11:58:33', 'U9cb564155dddeaa549d97a8747eed534', '2003-03-03', 'https://res.cloudinary.com/dq8euhi61/image/upload/v1741622708/image/user-image/efcuhk3ult9rpb5vvdax.png', 1, 1),
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
  `air_20_ton` int DEFAULT '0',
  `max_capacity` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `warehouses`
--

INSERT INTO `warehouses` (`warehouse_id`, `location`, `capacity`, `air_5_ton`, `air_10_ton`, `air_20_ton`, `max_capacity`) VALUES
(1, 'กรุงเทพมหานคร', 90, 30, 30, 30, 300),
(2, 'โชคชัย4 62', 120, 60, 20, 40, 0);

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
  MODIFY `log_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- AUTO_INCREMENT for table `area_calculation_history`
--
ALTER TABLE `area_calculation_history`
  MODIFY `calculation_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=214;

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
  MODIFY `borrowing_detail_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `brand_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `equipment_borrowing`
--
ALTER TABLE `equipment_borrowing`
  MODIFY `borrowing_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `gender`
--
ALTER TABLE `gender`
  MODIFY `gender_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=173;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `method_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `productattributes`
--
ALTER TABLE `productattributes`
  MODIFY `product_attribute_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `product_type`
--
ALTER TABLE `product_type`
  MODIFY `product_type_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rental`
--
ALTER TABLE `rental`
  MODIFY `rental_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=149;

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
  MODIFY `assignment_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=192;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `task_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=447;

--
-- AUTO_INCREMENT for table `tasktypes`
--
ALTER TABLE `tasktypes`
  MODIFY `task_type_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `task_images`
--
ALTER TABLE `task_images`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `task_log`
--
ALTER TABLE `task_log`
  MODIFY `log_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;

--
-- AUTO_INCREMENT for table `technicians`
--
ALTER TABLE `technicians`
  MODIFY `tech_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `technician_applicants`
--
ALTER TABLE `technician_applicants`
  MODIFY `applicant_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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

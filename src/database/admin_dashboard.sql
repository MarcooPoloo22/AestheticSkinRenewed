-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table asr.audit_logs
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `audit_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `user_role` enum('admin','employee') NOT NULL,
  `action_type` varchar(50) NOT NULL,
  `table_name` varchar(255) NOT NULL,
  `new_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_value`)),
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `description` text DEFAULT NULL,
  `old_value` text DEFAULT NULL,
  PRIMARY KEY (`audit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.audit_logs: ~9 rows (approximately)
INSERT INTO `audit_logs` (`audit_id`, `user_id`, `user_name`, `user_role`, `action_type`, `table_name`, `new_value`, `timestamp`, `description`, `old_value`) VALUES
	(20, 44, 'Gabriello', 'admin', 'UPDATE', 'promos', '{"id":7,"name":"Promo 45877","description":"Desc 5","price":"123.00","file_url":null,"start_date":"2025-03-24 17:23:00","end_date":"2025-03-31 13:21:00","duration":5,"created_at":"2025-03-23 13:17:21","updated_at":"2025-03-23 13:33:06","branch_ids":"[]","staff_ids":"[]"}', '2025-03-23 06:26:14', NULL, '{"id":7,"name":"Promo 45877","description":"Desc 5","price":"123.00","file_url":null,"start_date":"2025-03-24 17:23:00","end_date":"2025-03-31 13:21:00","duration":5,"created_at":"2025-03-23 13:17:21","updated_at":"2025-03-23 13:33:06","branch_ids":"[]","staff_ids":"[]"}'),
	(21, 44, 'Gabriello', 'admin', 'UPDATE', 'promos', '{"id":7,"name":"Promo 45877","description":"Desc 5","price":"123.00","file_url":null,"start_date":"2025-03-24 17:23:00","end_date":"2025-03-31 13:21:00","duration":6,"created_at":"2025-03-23 13:17:21","updated_at":"2025-03-23 14:35:08","branch_ids":"[\\"7\\",\\"6\\"]","staff_ids":"[\\"1\\",\\"3\\"]"}', '2025-03-23 06:35:08', NULL, '{"id":7,"name":"Promo 45877","description":"Desc 5","price":"123.00","file_url":null,"start_date":"2025-03-24 17:23:00","end_date":"2025-03-31 13:21:00","duration":5,"created_at":"2025-03-23 13:17:21","updated_at":"2025-03-23 13:33:06","branch_ids":"[]","staff_ids":"[]"}'),
	(22, 44, 'Gabriello', 'admin', 'UPDATE', 'promos', '{"id":7,"name":"Promo 45877","description":"Desc 5","price":"123.00","file_url":null,"start_date":"2025-03-24 17:23:00","end_date":"2025-03-31 13:21:00","duration":6,"created_at":"2025-03-23 13:17:21","updated_at":"2025-03-23 14:40:33","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\"]"}', '2025-03-23 06:40:33', NULL, '{"id":7,"name":"Promo 45877","description":"Desc 5","price":"123.00","file_url":null,"start_date":"2025-03-24 17:23:00","end_date":"2025-03-31 13:21:00","duration":6,"created_at":"2025-03-23 13:17:21","updated_at":"2025-03-23 14:35:08","branch_ids":"[\\"7\\",\\"6\\"]","staff_ids":"[\\"1\\",\\"3\\"]"}'),
	(23, 44, 'Gabriello', 'admin', 'UPDATE', 'promos', '{"id":7,"name":"Promo 45877","description":"Desc 5","price":"123.00","file_url":null,"start_date":"2025-03-24 17:23:00","end_date":"2025-03-31 13:21:00","duration":6,"created_at":"2025-03-23 13:17:21","updated_at":"2025-03-23 14:40:52","branch_ids":"[]","staff_ids":"[]"}', '2025-03-23 06:40:52', NULL, '{"id":7,"name":"Promo 45877","description":"Desc 5","price":"123.00","file_url":null,"start_date":"2025-03-24 17:23:00","end_date":"2025-03-31 13:21:00","duration":6,"created_at":"2025-03-23 13:17:21","updated_at":"2025-03-23 14:40:33","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\"]"}'),
	(24, 44, 'Gabriello', 'admin', 'UPDATE', 'promos', '{"id":7,"name":"Promo 45877","description":"Desc 5","price":"123.00","file_url":null,"start_date":"2025-03-24 17:23:00","end_date":"2025-03-31 13:21:00","duration":6,"created_at":"2025-03-23 13:17:21","updated_at":"2025-03-23 14:41:09","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\"]"}', '2025-03-23 06:41:09', NULL, '{"id":7,"name":"Promo 45877","description":"Desc 5","price":"123.00","file_url":null,"start_date":"2025-03-24 17:23:00","end_date":"2025-03-31 13:21:00","duration":6,"created_at":"2025-03-23 13:17:21","updated_at":"2025-03-23 14:40:52","branch_ids":"[]","staff_ids":"[]"}'),
	(25, 44, 'Gabriello', 'admin', 'UPDATE', 'promos', '{"id":3,"name":"Armand 2","description":"Seeerrcvvicee","price":"11.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67dd0247dc581-hair_treatment.jpg","start_date":"2025-03-09 03:14:00","end_date":"2025-03-25 07:19:00","duration":7,"created_at":"2025-03-20 01:22:52","updated_at":"2025-03-23 14:42:32","branch_ids":"[\\"7\\",\\"6\\"]","staff_ids":"[\\"1\\",\\"3\\"]"}', '2025-03-23 06:42:32', NULL, '{"id":3,"name":"Armand 2","description":"Seeerrcvvicee","price":"11.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/67dd0247dc581-hair_treatment.jpg","start_date":"2025-03-09 03:14:00","end_date":"2025-03-25 07:19:00","duration":7,"created_at":"2025-03-20 01:22:52","updated_at":"2025-03-21 14:08:07","branch_ids":null,"staff_ids":null}'),
	(26, 44, 'Gabriello', 'admin', 'DELETE', 'promos', 'null', '2025-03-23 06:43:08', NULL, '{"id":7,"name":"Promo 45877","description":"Desc 5","price":"123.00","file_url":null,"start_date":"2025-03-24 17:23:00","end_date":"2025-03-31 13:21:00","duration":6,"created_at":"2025-03-23 13:17:21","updated_at":"2025-03-23 14:41:09","branch_ids":"[\\"6\\",\\"7\\"]","staff_ids":"[\\"1\\",\\"3\\"]"}'),
	(27, 44, 'Gabriello', 'admin', 'UPDATE', 'products', '{"id":2,"name":"Massage Therapy","description":"Relax your body and mind with therapeutic massages.","price":"1500.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/massage.jpg"}', '2025-03-23 07:15:56', NULL, '{"id":2,"name":"Massage Therapy","description":"Relax your body and mind with therapeutic massages.","price":"1499.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/massage.jpg"}'),
	(28, 57, 'Rovin', 'employee', 'DELETE', 'products', 'null', '2025-03-23 07:26:20', NULL, '{"id":1014,"name":"123123","description":"123123","price":"122312.00","file_url":"http:\\/\\/localhost\\/admin_dashboard_backend\\/uploads\\/bart.jpg"}');

-- Dumping structure for table asr.bookings
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contact_no` varchar(20) NOT NULL,
  `service_type` varchar(255) NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.bookings: ~3 rows (approximately)
INSERT INTO `bookings` (`id`, `user_id`, `first_name`, `last_name`, `email`, `contact_no`, `service_type`, `appointment_date`, `appointment_time`, `status`, `created_at`) VALUES
	(1, NULL, 'Randolph', 'Alvarado', 'xere.sa.12@gmail.com', '09232228423', 'Haircut', '2025-03-06', '10:00:00', 'pending', '2025-03-07 04:28:49'),
	(2, NULL, 'Gabriello', 'Gerald Herrera', 'rsori013@ucr.edu', '09052752202', 'Service', '2025-03-22', '11:00:00', 'pending', '2025-03-22 10:24:17'),
	(3, NULL, 'Gabriello', 'Gerald Herrera', 'rsori013@ucr.edu', '09052752202', 'Service', '2025-03-22', '01:00:00', 'pending', '2025-03-22 10:24:29');

-- Dumping structure for table asr.branches
CREATE TABLE IF NOT EXISTS `branches` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.branches: ~2 rows (approximately)
INSERT INTO `branches` (`id`, `name`) VALUES
	(6, 'Katipunan'),
	(7, 'Zabarte');

-- Dumping structure for table asr.contact_info
CREATE TABLE IF NOT EXISTS `contact_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) NOT NULL,
  `facebook` varchar(255) NOT NULL,
  `instagram` varchar(255) NOT NULL,
  `twitter` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.contact_info: ~1 rows (approximately)
INSERT INTO `contact_info` (`id`, `phone`, `facebook`, `instagram`, `twitter`) VALUES
	(1, '+63 9760314956', 'https://web.facebook.com/gabgerald11', 'https://web.facebook.com/gabgerald11', 'https://web.facebook.com/gabgerald11');

-- Dumping structure for table asr.faqs
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` varchar(255) NOT NULL,
  `answer` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1011 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.faqs: ~4 rows (approximately)
INSERT INTO `faqs` (`id`, `question`, `answer`) VALUES
	(1, 'Are the treatments safe?', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt... asjdahsjkda'),
	(2, 'What are your operating hours?', 'We are open from 9 AM to 6 PM, Monday to Friday.'),
	(7, 'Question 3', 'We are open from 9 AM to 6 PM, Monday to Friyayy'),
	(1010, 'Is it safe', 'Yes it s');

-- Dumping structure for table asr.password_resets
CREATE TABLE IF NOT EXISTS `password_resets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.password_resets: ~0 rows (approximately)

-- Dumping structure for table asr.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1017 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.products: ~8 rows (approximately)
INSERT INTO `products` (`id`, `name`, `description`, `price`, `file_url`) VALUES
	(2, 'Massage Therapyy', 'RELAXINGGG HMM', 1699.00, 'http://localhost/admin_dashboard_backend/uploads/bart.jpg'),
	(5, 'Hair Treatments', 'Revive and restore your hair with specialized treatments.', 1000.00, 'http://localhost/admin_dashboard_backend/uploads/bart.jpg'),
	(1008, 'Product Trial', 'Trial Description', 23.00, 'http://localhost/admin_dashboard_backend/uploads/bart.jpg'),
	(1009, 'Prod', 'Desc', 89.00, 'http://localhost/admin_dashboard_backend/uploads/cheesy burger.jpg'),
	(1012, '5th one', '199', 34.00, 'http://localhost/admin_dashboard_backend/uploads/cheesy burger.jpg'),
	(1013, 'Product Trial', 'Product DESCPPP', 123.00, 'http://localhost/admin_dashboard_backend/uploads/bart.jpg'),
	(1015, 'Product 178', '178 desc', 178.00, 'http://localhost/admin_dashboard_backend/uploads/body_scrub.jpg'),
	(1016, '123', '123', 123.00, 'http://localhost/admin_dashboard_backend/uploads/bart.jpg');

-- Dumping structure for table asr.promos
CREATE TABLE IF NOT EXISTS `promos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `duration` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `branch_ids` text DEFAULT NULL,
  `staff_ids` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.promos: ~2 rows (approximately)
INSERT INTO `promos` (`id`, `name`, `description`, `price`, `file_url`, `start_date`, `end_date`, `duration`, `created_at`, `updated_at`, `branch_ids`, `staff_ids`) VALUES
	(2, 'Armand 100000', 'Seeerrcvviceee', 100.00, 'http://localhost/admin_dashboard_backend/uploads/67dd023d17624-facial.jpg', '2025-03-09 03:14:00', '2025-03-25 07:19:00', 7, '2025-03-19 17:13:53', '2025-03-23 04:37:08', '["6","7"]', '["1","3"]'),
	(3, 'Armand 2', 'Seeerrcvvicee', 11.00, 'http://localhost/admin_dashboard_backend/uploads/67dd0247dc581-hair_treatment.jpg', '2025-03-09 03:14:00', '2025-03-25 07:19:00', 7, '2025-03-19 17:22:52', '2025-03-23 06:42:32', '["7","6"]', '["1","3"]');

-- Dumping structure for table asr.promo_branches
CREATE TABLE IF NOT EXISTS `promo_branches` (
  `promo_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  PRIMARY KEY (`promo_id`,`branch_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `promo_branches_ibfk_1` FOREIGN KEY (`promo_id`) REFERENCES `promos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `promo_branches_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.promo_branches: ~4 rows (approximately)
INSERT INTO `promo_branches` (`promo_id`, `branch_id`) VALUES
	(2, 6),
	(2, 7),
	(3, 6),
	(3, 7);

-- Dumping structure for table asr.promo_staff
CREATE TABLE IF NOT EXISTS `promo_staff` (
  `promo_id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  PRIMARY KEY (`promo_id`,`staff_id`),
  KEY `staff_id` (`staff_id`),
  CONSTRAINT `promo_staff_ibfk_1` FOREIGN KEY (`promo_id`) REFERENCES `promos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `promo_staff_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.promo_staff: ~4 rows (approximately)
INSERT INTO `promo_staff` (`promo_id`, `staff_id`) VALUES
	(2, 1),
	(2, 3),
	(3, 1),
	(3, 3);

-- Dumping structure for table asr.services
CREATE TABLE IF NOT EXISTS `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `duration` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.services: ~2 rows (approximately)
INSERT INTO `services` (`id`, `name`, `description`, `price`, `file_url`, `duration`) VALUES
	(8, 'Armand', 'This is a hydro Facial', 180.00, 'uploads/body_scrub.jpg', 4),
	(9, 'Servicesss', 'This is the description for Service 2', 3456.00, 'uploads/67dafe3b93e3d-hair_treatment.jpg', 6);

-- Dumping structure for table asr.service_branches
CREATE TABLE IF NOT EXISTS `service_branches` (
  `service_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  KEY `service_id` (`service_id`),
  KEY `service_branches_ibfk_2` (`branch_id`),
  CONSTRAINT `service_branches_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`),
  CONSTRAINT `service_branches_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.service_branches: ~3 rows (approximately)
INSERT INTO `service_branches` (`service_id`, `branch_id`) VALUES
	(9, 6),
	(8, 6),
	(8, 7);

-- Dumping structure for table asr.service_staff
CREATE TABLE IF NOT EXISTS `service_staff` (
  `service_id` int(11) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  KEY `service_id` (`service_id`),
  KEY `staff_id` (`staff_id`),
  CONSTRAINT `service_staff_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`),
  CONSTRAINT `service_staff_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.service_staff: ~4 rows (approximately)
INSERT INTO `service_staff` (`service_id`, `staff_id`) VALUES
	(9, 1),
	(8, 1),
	(8, 3),
	(8, 4);

-- Dumping structure for table asr.staff
CREATE TABLE IF NOT EXISTS `staff` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `branch_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `staff_ibfk_1` (`branch_id`),
  CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.staff: ~5 rows (approximately)
INSERT INTO `staff` (`id`, `name`, `branch_id`) VALUES
	(1, 'Armand Valdivieso', 6),
	(3, 'Stephen', 7),
	(4, 'Randolph Alvarado', 6),
	(8, 'Ms Gonzales', 7),
	(9, 'Mr. H2WO', 7);

-- Dumping structure for table asr.surgeries
CREATE TABLE IF NOT EXISTS `surgeries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `duration` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.surgeries: ~1 rows (approximately)
INSERT INTO `surgeries` (`id`, `title`, `description`, `start_date`, `end_date`, `price`, `image_url`, `duration`, `created_at`, `updated_at`) VALUES
	(2, 'Surgery 1', 'This is the description for Surgery 1', '2025-03-24 00:00:00', '2025-03-25 00:00:00', 3456.00, 'http://localhost/admin_dashboard_backend/uploads/surgeries/67db35b4196b6-facial.jpg', 12, '2025-03-19 20:57:12', '2025-03-23 00:59:05');

-- Dumping structure for table asr.surgery_branches
CREATE TABLE IF NOT EXISTS `surgery_branches` (
  `surgery_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  PRIMARY KEY (`surgery_id`,`branch_id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `surgery_branches_ibfk_1` FOREIGN KEY (`surgery_id`) REFERENCES `surgeries` (`id`) ON DELETE CASCADE,
  CONSTRAINT `surgery_branches_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.surgery_branches: ~2 rows (approximately)
INSERT INTO `surgery_branches` (`surgery_id`, `branch_id`) VALUES
	(2, 6),
	(2, 7);

-- Dumping structure for table asr.surgery_staff
CREATE TABLE IF NOT EXISTS `surgery_staff` (
  `surgery_id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  PRIMARY KEY (`surgery_id`,`staff_id`),
  KEY `staff_id` (`staff_id`),
  CONSTRAINT `surgery_staff_ibfk_1` FOREIGN KEY (`surgery_id`) REFERENCES `surgeries` (`id`) ON DELETE CASCADE,
  CONSTRAINT `surgery_staff_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.surgery_staff: ~3 rows (approximately)
INSERT INTO `surgery_staff` (`surgery_id`, `staff_id`) VALUES
	(2, 4),
	(2, 8),
	(2, 9);

-- Dumping structure for table asr.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `middle_initial` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `contact_no` varchar(15) NOT NULL,
  `verified` tinyint(1) DEFAULT 0,
  `verification_token` varchar(255) DEFAULT NULL,
  `role` enum('admin','employee','customer') NOT NULL DEFAULT 'customer',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table asr.users: ~5 rows (approximately)
INSERT INTO `users` (`id`, `first_name`, `middle_initial`, `last_name`, `email`, `password`, `contact_no`, `verified`, `verification_token`, `role`) VALUES
	(35, 'Randolph', 'M', 'Alvarado', 'alvaradorandolph@gmail.com', '$2y$10$k6Agkx6/Tzh9jzQhLQMkgOUFMmhYERgG6TxEKsjzVJTAmoYlGdHTm', '09052752202', 1, NULL, 'customer'),
	(40, 'Randolph', 'M', 'Alvarado', 'xere.sa.12@gmail.com', '$2y$10$LAm7aelI1Gwv2rduso08S.Pctik1AjK6/BNKMBqjOXeTWMpPakta2', '09232228423', 1, NULL, 'admin'),
	(44, 'Gabriello', 'A', 'Gerald Herrera', 'gabgerald@yahoo.com', '$2y$10$GCPNaNqPAOrPqXLxRokbJ.cFnQwhGsLfZeCBYHEtMMSBX2JJapSo6', '09428098248', 1, NULL, 'admin'),
	(45, 'Armand', 'G', 'Ledor', 'armand@yahoo.com', '$2y$10$u2snYTiSkIjj1eO/bnixk.WUrWkkN0y0dZxW6Ks8wgY1/z4RweHDG', '09428098248', 1, NULL, 'employee'),
	(57, 'Rovin', '', 'Soriano', 'rsori013@ucr.edu', '$2y$10$.nAAckSjqWEwiYc0ly2uEeemPk4wZP7/dS5PbG5YAl/gAhrCqsDBy', '7472382804', 1, NULL, 'employee');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

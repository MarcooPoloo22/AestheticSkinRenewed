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

-- Dumping structure for table admin_dashboard.contact_info
CREATE TABLE IF NOT EXISTS `contact_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) NOT NULL,
  `facebook` varchar(255) NOT NULL,
  `instagram` varchar(255) NOT NULL,
  `twitter` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table admin_dashboard.contact_info: ~0 rows (approximately)
INSERT INTO `contact_info` (`id`, `phone`, `facebook`, `instagram`, `twitter`) VALUES
	(1, '+63 9760314957', 'https://web.facebook.com/gabgerald11', 'https://web.facebook.com/gabgerald11', 'https://web.facebook.com/gabgerald11');

-- Dumping structure for table admin_dashboard.faqs
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` varchar(255) NOT NULL,
  `answer` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1010 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table admin_dashboard.faqs: ~4 rows (approximately)
INSERT INTO `faqs` (`id`, `question`, `answer`) VALUES
	(1, 'Are the treatments safe?', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt... asjdahsjkda'),
	(2, 'What are your operating hours?', 'We are open from 9 AM to 6 PM, Monday to Friday.'),
	(7, 'Question 3', 'We are open from 9 AM to 6 PM, Monday to Friyayy'),
	(9, 'Try 4', 'Answer 4');

-- Dumping structure for table admin_dashboard.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1008 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table admin_dashboard.products: ~5 rows (approximately)
INSERT INTO `products` (`id`, `name`, `description`, `price`, `file_url`) VALUES
	(2, 'Massage Therapy', 'Relax your body and mind with therapeutic massages.', 1500.00, 'http://localhost/admin_dashboard_backend/uploads/massage.jpg'),
	(3, 'Skin Rejuvenation', 'Advanced treatments for glowing, youthful skin.', 2000.00, 'http://localhost/admin_dashboard_backend/uploads/skin_rejuvenation.jpg'),
	(5, 'Hair Treatments', 'Revive and restore your hair with specialized treatments.', 1000.00, 'http://localhost/admin_dashboard_backend/uploads/bart.jpg'),
	(6, 'Hydro Facial', 'This is a hydro Facial', 3456.00, 'http://localhost/admin_dashboard_backend/uploads/bart.jpg'),
	(7, 'Hydro YAehsa', 'HAHHAHHEHEHEHEH', 671.00, 'http://localhost/admin_dashboard_backend/uploads/cheesy burger.jpg');

-- Dumping structure for table admin_dashboard.promos
CREATE TABLE IF NOT EXISTS `promos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` varchar(50) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1002 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table admin_dashboard.promos: ~2 rows (approximately)
INSERT INTO `promos` (`id`, `name`, `description`, `price`, `file_url`, `start_date`, `end_date`) VALUES
	(1, 'Sel', 'Pogi', '199', 'https://example.com/file.pdf', '2025-03-18 18:37:00', '2025-03-19 20:37:00');

-- Dumping structure for table admin_dashboard.services
CREATE TABLE IF NOT EXISTS `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1005 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table admin_dashboard.services: ~2 rows (approximately)
INSERT INTO `services` (`id`, `name`, `description`, `price`, `file_url`) VALUES
	(1, 'Service 1', 'This is the description for Service 1.', 500.00, 'http://localhost/admin_dashboard_backend/uploads/hair_treatment.jpg'),
	(2, 'Service 2', 'This is the description for Service 2.', 600.00, 'http://localhost/admin_dashboard_backend/uploads/bart.jpg');

-- Dumping structure for table admin_dashboard.surgery_appointments
CREATE TABLE IF NOT EXISTS `surgery_appointments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `start_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_date` date NOT NULL,
  `end_time` time NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table admin_dashboard.surgery_appointments: ~1 rows (approximately)
INSERT INTO `surgery_appointments` (`id`, `title`, `description`, `start_date`, `start_time`, `end_date`, `end_time`, `price`, `image`) VALUES
	(2, 'Surgery 1', 'This is the description for Surgery 1', '2025-03-18', '02:12:00', '2025-03-25', '00:10:00', 100.00, 'bart.jpg');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

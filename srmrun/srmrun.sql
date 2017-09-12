-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 06, 2017 at 01:35 PM
-- Server version: 5.7.14
-- PHP Version: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aaruush`
--

-- --------------------------------------------------------

--
-- Table structure for table `srmrun`
--

CREATE TABLE `srmrun` (
  `id` int(255) NOT NULL,
  `name` varchar(50) NOT NULL,
  `reg_num` varchar(50) NOT NULL,
  `degree` varchar(50) NOT NULL,
  `branch` varchar(50) NOT NULL,
  `year` varchar(50) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `type` varchar(50) NOT NULL,
  `t_size` varchar(50) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `srmrun`
--

INSERT INTO `srmrun` (`id`, `name`, `reg_num`, `degree`, `branch`, `year`, `phone`, `email`, `type`, `t_size`) VALUES
(1, 'sdf', 'asd', 'asd', 'sad', 'dsf', '3', 'dsf@g', '', ''),
(2, 'sdf', 'asd', 'asd', 'sad', 'dsf', '3', 'dsf@g', '', ''),
(4, 'dfs', 'sdf', 'sadd', 'qasdd', 'sad', '45', 'sdf@g', 'Faculty', 'XS');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `srmrun`
--
ALTER TABLE `srmrun`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `srmrun`
--
ALTER TABLE `srmrun`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

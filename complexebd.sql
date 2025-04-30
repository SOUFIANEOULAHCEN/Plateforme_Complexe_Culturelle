-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 22, 2025 at 01:38 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `complexebd`
--

-- --------------------------------------------------------

--
-- Table structure for table `commentaire`
--

CREATE TABLE `commentaire` (
  `id` int(11) NOT NULL,
  `contenu` text NOT NULL,
  `date_creation` datetime DEFAULT current_timestamp(),
  `utilisateur_id` int(11) NOT NULL,
  `evenement_id` int(11) NOT NULL,
  `note` int(11) DEFAULT NULL CHECK (`note` between 1 and 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `commentaire`
--

INSERT INTO `commentaire` (`id`, `contenu`, `date_creation`, `utilisateur_id`, `evenement_id`, `note`) VALUES
(1, 'Super concert, les musiciens étaient excellents!', '2025-06-16 09:00:00', 2, 1, 5),
(2, 'Atelier très instructif, merci!', '2025-05-11 10:30:00', 3, 2, 4),
(3, 'Conférence passionnante mais un peu trop courte', '2025-07-11 08:45:00', 2, 3, 4),
(4, 'Le formateur était très compétent', '2025-08-06 11:20:00', 3, 4, 5),
(5, 'Spectacle magnifique, à revoir absolument!', '2025-09-13 10:15:00', 2, 5, 5),
(6, 'L\'organisation pourrait être améliorée', '2025-06-17 14:30:00', 3, 1, 3),
(7, 'Matériel de qualité pour l\'atelier', '2025-05-12 16:20:00', 2, 2, 4);

-- --------------------------------------------------------

--
-- Table structure for table `espace`
--

CREATE TABLE `espace` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `type` enum('salle','atelier') NOT NULL,
  `sous_type` enum('théâtre','bibliothèque','informatique','musique','conférence','café','photographie','langue','arts') DEFAULT NULL,
  `capacite` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `espace`
--

INSERT INTO `espace` (`id`, `nom`, `type`, `sous_type`, `capacite`, `description`, `image_url`) VALUES
(1, 'Grand Théâtre', 'salle', 'théâtre', 200, NULL, NULL),
(2, 'Studio Photo', 'atelier', 'photographie', 15, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `evenement`
--

CREATE TABLE `evenement` (
  `id` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date_debut` datetime NOT NULL,
  `date_fin` datetime NOT NULL,
  `espace_id` int(11) NOT NULL,
  `type` enum('spectacle','atelier','conference','exposition','rencontre') NOT NULL,
  `affiche_url` varchar(255) DEFAULT NULL,
  `createur_id` int(11) NOT NULL,
  `prix` decimal(10,2) DEFAULT 0.00,
  `statut` enum('planifie','confirme','annule') DEFAULT 'planifie'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `evenement`
--

INSERT INTO `evenement` (`id`, `titre`, `description`, `date_debut`, `date_fin`, `espace_id`, `type`, `affiche_url`, `createur_id`, `prix`, `statut`) VALUES
(1, 'Concert Andalou', NULL, '2025-06-15 20:00:00', '2025-06-15 22:30:00', 1, 'spectacle', NULL, 1, 0.00, 'planifie'),
(2, 'Atelier Photo', NULL, '2025-05-10 14:00:00', '2025-05-10 17:00:00', 2, 'atelier', NULL, 1, 0.00, 'planifie'),
(3, 'Conférence Art Moderne', 'Discussion sur les tendances artistiques contemporaines', '2025-07-10 18:00:00', '2025-07-10 20:30:00', 1, 'conference', 'conf_art.jpg', 1, 50.00, 'confirme'),
(4, 'Atelier Peinture', 'Initiation à la peinture à l\'huile', '2025-08-05 14:00:00', '2025-08-05 17:00:00', 2, 'atelier', 'peinture.jpg', 1, 120.00, 'planifie'),
(5, 'Spectacle de Danse', 'Performance de danse contemporaine', '2025-09-12 20:00:00', '2025-09-12 22:00:00', 1, 'spectacle', 'danse.jpg', 1, 80.00, 'confirme');

-- --------------------------------------------------------

--
-- Table structure for table `participation_artiste`
--

CREATE TABLE `participation_artiste` (
  `id` int(11) NOT NULL,
  `artiste_id` int(11) NOT NULL,
  `evenement_id` int(11) NOT NULL,
  `role` varchar(255) NOT NULL,
  `description_role` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `participation_artiste`
--

INSERT INTO `participation_artiste` (`id`, `artiste_id`, `evenement_id`, `role`, `description_role`) VALUES
(1, 2, 1, 'Chanteuse principale', NULL),
(2, 3, 2, 'Formateur photo', NULL),
(3, 2, 3, 'Modérateur', 'Animation de la conférence'),
(4, 3, 4, 'Formateur', 'Enseignement des techniques de peinture'),
(5, 2, 5, 'Danseuse principale', 'Performance solo'),
(6, 3, 5, 'Chorégraphe', 'Mise en scène du spectacle');

-- --------------------------------------------------------

--
-- Table structure for table `reservation`
--

CREATE TABLE `reservation` (
  `id` int(11) NOT NULL,
  `evenement_id` int(11) NOT NULL,
  `utilisateur_id` int(11) NOT NULL,
  `date_reservation` datetime DEFAULT current_timestamp(),
  `nombre_places` int(11) DEFAULT 1,
  `statut` enum('confirme','annule','en_attente') DEFAULT 'confirme'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservation`
--

INSERT INTO `reservation` (`id`, `evenement_id`, `utilisateur_id`, `date_reservation`, `nombre_places`, `statut`) VALUES
(1, 1, 2, '2025-04-20 10:00:00', 2, 'confirme'),
(2, 1, 3, '2025-04-21 11:30:00', 1, 'confirme'),
(3, 2, 2, '2025-04-22 09:15:00', 1, 'annule'),
(4, 3, 3, '2025-05-01 14:20:00', 3, 'confirme'),
(5, 3, 2, '2025-05-02 16:45:00', 2, 'en_attente'),
(6, 4, 3, '2025-06-10 10:30:00', 1, 'confirme'),
(7, 5, 2, '2025-07-15 12:00:00', 4, 'confirme'),
(8, 5, 3, '2025-07-18 15:20:00', 2, 'confirme'),
(9, 2, 1, '2025-04-30 22:25:00', 20, 'en_attente'),
(10, 4, 4, '2025-04-21 22:25:00', 25, 'en_attente'),
(11, 4, 2, '2025-04-21 22:25:00', 20, 'en_attente');

-- --------------------------------------------------------

--
-- Table structure for table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('utilisateur','admin','superadmin') DEFAULT 'utilisateur',
  `date_inscription` datetime DEFAULT current_timestamp(),
  `is_talent` tinyint(1) DEFAULT 0,
  `domaine_artiste` varchar(255) DEFAULT NULL,
  `description_talent` text DEFAULT NULL,
  `image_profil` varchar(255) DEFAULT NULL,
  `statut_talent` enum('actif','inactif','en_validation') DEFAULT 'en_validation',
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `resetPasswordExpires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `nom`, `email`, `password`, `role`, `date_inscription`, `is_talent`, `domaine_artiste`, `description_talent`, `image_profil`, `statut_talent`, `resetPasswordToken`, `resetPasswordExpires`) VALUES
(1, 'Admin', 'admin@culture.ma', '$2y$10$TXdpYnOAfb04O9rVaGUzm.sDaQDFsL/CiVuz/B5eeilqCPomfeg8S', 'superadmin', '2025-04-19 00:37:05', 0, NULL, NULL, NULL, 'en_validation', NULL, NULL),
(2, 'Fatima Zahra', 'fatima@artiste.ma', '$2y$10$...', 'utilisateur', '2025-04-19 00:37:05', 1, 'Musique traditionnelle', 'Chanteuse et compositrice', NULL, 'en_validation', NULL, NULL),
(3, 'Ahmed Photographe', 'ahmed@photo.ma', '$2y$10$...', 'utilisateur', '2025-04-19 00:37:05', 1, 'Photographie', 'Spécialiste paysages du désert', NULL, 'en_validation', NULL, NULL),
(4, 'soufiane', 'soufiane.oulahcen9999@gmail.com', '$2b$10$cwCqatA6xBQxZYHlUPmiO.eTxOKy.PGrUc2inZmqeO78CUZ9SxvFi', 'admin', '2025-04-19 00:37:05', 0, '', '', NULL, '', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `commentaire`
--
ALTER TABLE `commentaire`
  ADD PRIMARY KEY (`id`),
  ADD KEY `utilisateur_id` (`utilisateur_id`),
  ADD KEY `evenement_id` (`evenement_id`);

--
-- Indexes for table `espace`
--
ALTER TABLE `espace`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `evenement`
--
ALTER TABLE `evenement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `espace_id` (`espace_id`),
  ADD KEY `createur_id` (`createur_id`);

--
-- Indexes for table `participation_artiste`
--
ALTER TABLE `participation_artiste`
  ADD PRIMARY KEY (`id`),
  ADD KEY `artiste_id` (`artiste_id`),
  ADD KEY `evenement_id` (`evenement_id`);

--
-- Indexes for table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `evenement_id` (`evenement_id`),
  ADD KEY `utilisateur_id` (`utilisateur_id`);

--
-- Indexes for table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `commentaire`
--
ALTER TABLE `commentaire`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `espace`
--
ALTER TABLE `espace`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `evenement`
--
ALTER TABLE `evenement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `participation_artiste`
--
ALTER TABLE `participation_artiste`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `commentaire`
--
ALTER TABLE `commentaire`
  ADD CONSTRAINT `commentaire_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`),
  ADD CONSTRAINT `commentaire_ibfk_2` FOREIGN KEY (`evenement_id`) REFERENCES `evenement` (`id`);

--
-- Constraints for table `evenement`
--
ALTER TABLE `evenement`
  ADD CONSTRAINT `evenement_ibfk_1` FOREIGN KEY (`espace_id`) REFERENCES `espace` (`id`),
  ADD CONSTRAINT `evenement_ibfk_2` FOREIGN KEY (`createur_id`) REFERENCES `utilisateur` (`id`);

--
-- Constraints for table `participation_artiste`
--
ALTER TABLE `participation_artiste`
  ADD CONSTRAINT `participation_artiste_ibfk_1` FOREIGN KEY (`artiste_id`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `participation_artiste_ibfk_2` FOREIGN KEY (`evenement_id`) REFERENCES `evenement` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`evenement_id`) REFERENCES `evenement` (`id`),
  ADD CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

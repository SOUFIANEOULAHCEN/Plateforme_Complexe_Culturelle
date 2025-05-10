-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 10, 2025 at 02:03 AM
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
(2, 'Studio Photo', 'atelier', 'photographie', 15, NULL, NULL),
(3, 'cozina', 'atelier', 'photographie', 20, 'bla bla bla', '');

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
(5, 'Spectacle de Danse', 'Performance de danse contemporaine', '2025-09-12 20:00:00', '2025-09-12 22:00:00', 1, 'spectacle', 'danse.jpg', 1, 80.00, 'confirme'),
(14, 'xxxxxxxxxxxxxxxxxxxxxxxxxx', ' mbdcjabj', '2025-04-23 18:10:00', '2025-04-23 20:10:00', 1, 'spectacle', NULL, 1, 30.00, 'planifie'),
(15, 'yyyyyyyyyyyyyyyyyyy', 'nSKCDNkdj', '2025-04-23 18:11:00', '2025-04-23 20:11:00', 1, 'spectacle', NULL, 1, 0.00, 'planifie'),
(16, 'Foire Artisanalex', '', '2025-04-23 18:40:00', '2025-04-23 20:40:00', 1, 'conference', NULL, 1, 0.00, 'planifie'),
(17, 'cozina', 'bla bla bal', '2025-09-24 22:55:00', '2025-09-26 00:55:00', 2, 'exposition', NULL, 1, 39.00, 'planifie'),
(21, 'bla bla bla xxxx', 'bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla ', '2025-05-03 02:56:28', '2025-05-03 02:56:28', 1, 'atelier', NULL, 1, 0.00, 'planifie'),
(22, 'bla bla bla xxxx', 'bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla ', '2025-05-03 02:56:28', '2025-05-03 02:56:28', 1, 'atelier', NULL, 1, 0.00, 'planifie'),
(23, 'event for sport ', 'sport event bla bla bla bla ', '2025-05-03 03:46:53', '2025-05-03 03:46:53', 3, 'rencontre', NULL, 1, 0.00, 'planifie'),
(24, 'bla ba bla ba bla ba bla ba bla ba ', 'sport eventskhjkckjdancklasd', '2025-05-23 20:55:32', '2025-05-24 20:55:32', 1, 'spectacle', NULL, 4, 0.00, 'planifie');

-- --------------------------------------------------------

--
-- Table structure for table `event_proposals`
--

CREATE TABLE `event_proposals` (
  `id` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date_debut` datetime NOT NULL,
  `date_fin` datetime NOT NULL,
  `espace_id` int(11) NOT NULL,
  `type` enum('spectacle','atelier','conference','exposition','rencontre') NOT NULL,
  `proposeur_email` varchar(255) NOT NULL,
  `proposeur_nom` varchar(255) NOT NULL,
  `proposeur_telephone` varchar(255) DEFAULT NULL,
  `statut` enum('en_attente','approuve','rejete') DEFAULT 'en_attente',
  `commentaire_admin` text DEFAULT NULL,
  `traite_par` int(11) DEFAULT NULL,
  `date_traitement` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_proposals`
--

INSERT INTO `event_proposals` (`id`, `titre`, `description`, `date_debut`, `date_fin`, `espace_id`, `type`, `proposeur_email`, `proposeur_nom`, `proposeur_telephone`, `statut`, `commentaire_admin`, `traite_par`, `date_traitement`, `createdAt`, `updatedAt`) VALUES
(1, 'bla bla bla bla bla', 'bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla ', '2025-05-03 02:40:04', '2025-05-22 01:40:04', 0, '', 'soufiane@gmail.com', 'soufiane', '0624193209', 'rejete', 'bla bla bla bla ', 1, '2025-05-03 00:53:34', '2025-05-03 01:41:15', '2025-05-03 00:53:34'),
(2, 'bla bla bla xxxx', 'bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla ', '2025-05-03 02:56:28', '2025-05-03 02:56:28', 1, 'atelier', 'soufiane@gmail.com', 'xxxxxxxxxxxxxxxxx', '0600010002', 'approuve', 'bla bla bla ', 1, '2025-05-03 01:04:24', '2025-05-03 01:57:35', '2025-05-03 01:04:24'),
(3, 'titre titre titre titre titre ', 'titre titre titre titre titre titre titre titre titre titre titre titre titre titre titre titre titre titre titre ', '2025-05-03 03:02:10', '2025-05-29 02:02:11', 2, 'spectacle', 'ayman@gmail.com', 'ayman', '098765432089', 'rejete', '', NULL, '2025-05-03 01:36:47', '2025-05-03 02:14:16', '2025-05-03 01:36:47'),
(5, 'event for sport ', 'sport event bla bla bla bla ', '2025-05-03 03:46:53', '2025-05-03 03:46:53', 3, 'rencontre', 'soufiane.oulahcen9999@gmail.com', 'soufiane', '0622854647', 'rejete', 'je m\'excuse Mr soufiane pour cette confilt , votre demande a ete refuser ', 1, '2025-05-03 01:50:45', '2025-05-03 02:48:30', '2025-05-03 01:50:45'),
(6, 'bla ba bla ba bla ba bla ba bla ba ', 'sport eventskhjkckjdancklasd', '2025-05-23 20:55:32', '2025-05-24 20:55:32', 1, 'spectacle', 'soufiane.oulahcen9999@gmail.com', 'soufiane', '0624193209', 'approuve', 'hjhkdjfhjdkashcvjafd', 4, '2025-05-06 19:57:21', '2025-05-06 20:56:51', '2025-05-06 19:57:21');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `utilisateurId` int(11) DEFAULT NULL,
  `message` varchar(255) NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `type` enum('info','warning','success','error','event_proposal') DEFAULT 'info',
  `reference_id` int(11) DEFAULT NULL,
  `reference_type` varchar(255) DEFAULT NULL,
  `for_admins_only` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `utilisateurId`, `message`, `is_read`, `type`, `reference_id`, `reference_type`, `for_admins_only`, `createdAt`, `updatedAt`) VALUES
(1, 5, 'bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla ', 1, 'event_proposal', 1, NULL, 1, '2025-04-28 16:45:02', '2025-04-28 16:12:02'),
(2, 5, 'bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla ', 1, 'event_proposal', 1, NULL, 1, '2025-04-28 16:45:08', '2025-04-28 16:12:02'),
(5, NULL, 'Proposition d\'événement rejetée : titre titre titre titre titre ', 1, 'info', 3, 'event_proposal', 1, '2025-05-03 01:36:47', '2025-05-03 01:46:17'),
(6, NULL, 'Événement créé à partir de la proposition: event for sport ', 1, 'success', 23, 'event', 1, '2025-05-03 01:49:08', '2025-05-06 15:10:59'),
(7, NULL, 'Proposition d\'événement rejetée : event for sport ', 1, 'info', 5, 'event_proposal', 1, '2025-05-03 01:50:45', '2025-05-05 14:53:03'),
(8, NULL, 'Événement créé à partir de la proposition: bla ba bla ba bla ba bla ba bla ba ', 0, 'success', 24, 'event', 1, '2025-05-06 19:57:21', '2025-05-06 19:57:21');

-- --------------------------------------------------------

--
-- Table structure for table `old_reservation`
--

CREATE TABLE `old_reservation` (
  `id` int(11) NOT NULL,
  `evenement_id` int(11) NOT NULL,
  `utilisateur_id` int(11) NOT NULL,
  `date_reservation` datetime DEFAULT current_timestamp(),
  `nombre_places` int(11) DEFAULT 1,
  `statut` enum('confirme','annule','en_attente') DEFAULT 'confirme',
  `type_reservateur` enum('individu','association','entreprise','institution') NOT NULL DEFAULT 'individu',
  `documents_fournis` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`documents_fournis`)),
  `materiel_requis` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`materiel_requis`)),
  `commentaires` text DEFAULT NULL,
  `date_annulation` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `old_reservation`
--

INSERT INTO `old_reservation` (`id`, `evenement_id`, `utilisateur_id`, `date_reservation`, `nombre_places`, `statut`, `type_reservateur`, `documents_fournis`, `materiel_requis`, `commentaires`, `date_annulation`) VALUES
(1, 1, 2, '2025-04-20 10:00:00', 2, 'confirme', 'individu', '{}', '{}', NULL, NULL),
(2, 1, 3, '2025-04-21 11:30:00', 1, 'confirme', 'individu', '{}', '{}', NULL, NULL),
(3, 2, 2, '2025-04-22 09:15:00', 1, 'annule', 'individu', '{}', '{}', NULL, NULL),
(4, 3, 3, '2025-05-01 14:20:00', 3, 'confirme', 'individu', '{}', '{}', NULL, NULL),
(5, 3, 2, '2025-05-02 16:45:00', 2, 'en_attente', 'individu', '{}', '{}', NULL, NULL),
(6, 4, 3, '2025-06-10 10:30:00', 1, 'confirme', 'individu', '{}', '{}', NULL, NULL),
(7, 5, 2, '2025-07-15 12:00:00', 4, 'confirme', 'individu', '{}', '{}', NULL, NULL),
(8, 5, 3, '2025-07-18 15:20:00', 2, 'confirme', 'individu', '{}', '{}', NULL, NULL),
(9, 2, 1, '2025-04-30 22:25:00', 20, 'en_attente', 'individu', '{}', '{}', NULL, NULL),
(10, 4, 4, '2025-04-21 22:25:00', 25, 'en_attente', 'individu', '{}', '{}', NULL, NULL);

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
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type_reservation` enum('standard','evenement') NOT NULL DEFAULT 'standard',
  `type_organisateur` enum('individu','association','entreprise') NOT NULL DEFAULT 'individu',
  `date_debut` datetime NOT NULL,
  `date_fin` datetime NOT NULL,
  `espace_id` int(11) NOT NULL,
  `utilisateur_id` int(11) NOT NULL,
  `nombre_places` int(11) DEFAULT 1,
  `documents_fournis` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`documents_fournis`)),
  `documents_paths` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '{}' CHECK (json_valid(`documents_paths`)),
  `materiel_additionnel` text DEFAULT NULL,
  `statut` enum('en_attente','confirme','annule','termine') DEFAULT 'en_attente',
  `date_annulation` datetime DEFAULT NULL,
  `commentaires` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `titre`, `description`, `type_reservation`, `type_organisateur`, `date_debut`, `date_fin`, `espace_id`, `utilisateur_id`, `nombre_places`, `documents_fournis`, `documents_paths`, `materiel_additionnel`, `statut`, `date_annulation`, `commentaires`, `createdAt`, `updatedAt`) VALUES
(1, 'Concert Andalou', NULL, 'standard', 'individu', '2025-06-15 20:00:00', '2025-06-15 22:30:00', 1, 2, 2, '{}', '{}', '{}', 'confirme', NULL, NULL, '2025-04-20 10:00:00', '2025-04-20 10:00:00'),
(2, 'Concert Andalou', NULL, 'standard', 'individu', '2025-06-15 20:00:00', '2025-06-15 22:30:00', 1, 3, 1, '{}', '{}', '{}', 'confirme', NULL, NULL, '2025-04-21 11:30:00', '2025-04-21 11:30:00'),
(3, 'Atelier Photo', NULL, 'standard', 'individu', '2025-05-10 14:00:00', '2025-05-10 17:00:00', 2, 2, 1, '{}', '{}', '{}', 'annule', NULL, NULL, '2025-04-22 09:15:00', '2025-04-22 09:15:00'),
(4, 'Conférence Art Moderne', 'Discussion sur les tendances artistiques contemporaines', 'standard', 'individu', '2025-07-10 18:00:00', '2025-07-10 20:30:00', 1, 3, 3, '{}', '{}', '{}', 'confirme', NULL, NULL, '2025-05-01 14:20:00', '2025-05-01 14:20:00'),
(5, 'Conférence Art Moderne', 'Discussion sur les tendances artistiques contemporaines', 'standard', 'individu', '2025-07-10 18:00:00', '2025-07-10 20:30:00', 1, 2, 2, '{}', '{}', '{}', 'en_attente', NULL, NULL, '2025-05-02 16:45:00', '2025-05-02 16:45:00'),
(6, 'Atelier Peinture', 'Initiation à la peinture à l\'huile', 'standard', 'individu', '2025-08-05 14:00:00', '2025-08-05 17:00:00', 2, 3, 1, '{}', '{}', '{}', 'confirme', NULL, NULL, '2025-06-10 10:30:00', '2025-06-10 10:30:00'),
(7, 'Spectacle de Danse', 'Performance de danse contemporaine', 'standard', 'individu', '2025-09-12 20:00:00', '2025-09-12 22:00:00', 1, 2, 4, '{}', '{}', '{}', 'confirme', NULL, NULL, '2025-07-15 12:00:00', '2025-07-15 12:00:00'),
(8, 'Spectacle de Danse', 'Performance de danse contemporaine', 'standard', 'individu', '2025-09-12 20:00:00', '2025-09-12 22:00:00', 1, 3, 2, '{}', '{}', '{}', 'confirme', NULL, NULL, '2025-07-18 15:20:00', '2025-07-18 15:20:00'),
(9, 'Atelier Photo', NULL, 'standard', 'individu', '2025-05-10 14:00:00', '2025-05-10 17:00:00', 2, 1, 20, '{}', '{}', '{}', 'en_attente', NULL, NULL, '2025-04-30 22:25:00', '2025-04-30 22:25:00'),
(10, 'Atelier Peinture', 'Initiation à la peinture à l\'huile', 'standard', 'individu', '2025-08-05 14:00:00', '2025-08-05 17:00:00', 2, 4, 25, '{}', '{}', '{}', 'en_attente', NULL, NULL, '2025-04-21 22:25:00', '2025-04-21 22:25:00');

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
  `resetPasswordExpires` datetime DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `adresse` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `nom`, `email`, `password`, `role`, `date_inscription`, `is_talent`, `domaine_artiste`, `description_talent`, `image_profil`, `statut_talent`, `resetPasswordToken`, `resetPasswordExpires`, `telephone`, `adresse`) VALUES
(1, 'Admin', 'admin@culture.ma', '$2y$10$TXdpYnOAfb04O9rVaGUzm.sDaQDFsL/CiVuz/B5eeilqCPomfeg8S', 'superadmin', '2025-04-19 00:37:05', 0, NULL, NULL, NULL, 'en_validation', NULL, NULL, NULL, NULL),
(2, 'Fatima Zahra', 'fatima@artiste.ma', '$2y$10$mdEFice0TdjqvQsB5ev9AeMAydSQWYclXA.eNzZ4uttGrTg3NBclK', 'utilisateur', '2025-04-19 00:37:05', 1, 'Musique traditionnelle', 'Chanteuse et compositrice', NULL, 'en_validation', NULL, NULL, NULL, NULL),
(3, 'Ahmed Photographe', 'ahmed@photo.ma', '$2y$10$mdEFice0TdjqvQsB5ev9AeMAydSQWYclXA.eNzZ4uttGrTg3NBclK', 'utilisateur', '2025-04-19 00:37:05', 1, 'Photographie', 'Spécialiste paysages du désert', NULL, 'en_validation', NULL, NULL, NULL, NULL),
(4, 'soufiane', 'soufiane.oulahcen9999@gmail.com', '$2b$10$IFNSp.RHwQCCOKlac6dyXuPtOE9jxNUl.uKigLPl61xYKxCn29eN.', 'admin', '2025-04-19 00:37:05', 0, '', '', NULL, '', NULL, NULL, NULL, NULL),
(5, 'meryem', 'meryem@gmail.com', '$2b$10$YQ6DvoAXMc.b/jRt2jdxjOrrb3uGoQdrfEJV1zz3MVl8pF/YGj/tu', 'utilisateur', '2025-04-22 00:14:13', 0, NULL, NULL, '/uploads/profiles/image_profil-1746717220883-103349997.png', 'en_validation', NULL, NULL, '0624193209', 'حي تكمي الجديد ورزازات'),
(15, 'hassan', 'hassna@gmail.com', 'defaultPassword', 'utilisateur', '2025-04-26 15:09:02', 1, NULL, NULL, NULL, 'inactif', NULL, NULL, NULL, NULL),
(16, 'soufiane', 'soufiane@gmail.com', 'dasjhjkdashdjksa', 'utilisateur', '2025-04-26 15:09:55', 0, NULL, NULL, NULL, 'en_validation', NULL, NULL, NULL, NULL),
(17, 'ayman', 'ayman@gmail.com', 'fekjfhcwejc', 'utilisateur', '2025-04-26 15:10:50', 0, NULL, NULL, NULL, 'en_validation', NULL, NULL, NULL, NULL),
(18, 'anass', 'anas@gmail.com', 'defaultPassword', 'utilisateur', '2025-04-26 15:21:12', 1, 'musicien', 'bla bla bla', NULL, 'en_validation', NULL, NULL, NULL, NULL),
(24, 'hassan', 'hassan@gmail.com', '$2b$10$DRoOsyaR8KycdxfeEbDSIOVUKUNLguxYTlMok5RC7ZSHF9Rz4bMai', 'utilisateur', '2025-05-08 20:04:14', 0, NULL, NULL, NULL, 'en_validation', NULL, NULL, NULL, NULL);

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
-- Indexes for table `event_proposals`
--
ALTER TABLE `event_proposals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_traite_par` (`traite_par`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_utilisateurId` (`utilisateurId`);

--
-- Indexes for table `old_reservation`
--
ALTER TABLE `old_reservation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `evenement_id` (`evenement_id`),
  ADD KEY `utilisateur_id` (`utilisateur_id`);

--
-- Indexes for table `participation_artiste`
--
ALTER TABLE `participation_artiste`
  ADD PRIMARY KEY (`id`),
  ADD KEY `artiste_id` (`artiste_id`),
  ADD KEY `evenement_id` (`evenement_id`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `utilisateur_id` (`utilisateur_id`),
  ADD KEY `espace_id` (`espace_id`),
  ADD KEY `date_range` (`date_debut`,`date_fin`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `espace`
--
ALTER TABLE `espace`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `evenement`
--
ALTER TABLE `evenement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `event_proposals`
--
ALTER TABLE `event_proposals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `old_reservation`
--
ALTER TABLE `old_reservation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `participation_artiste`
--
ALTER TABLE `participation_artiste`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

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
-- Constraints for table `event_proposals`
--
ALTER TABLE `event_proposals`
  ADD CONSTRAINT `fk_traite_par` FOREIGN KEY (`traite_par`) REFERENCES `utilisateur` (`id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_utilisateurId` FOREIGN KEY (`utilisateurId`) REFERENCES `utilisateur` (`id`);

--
-- Constraints for table `old_reservation`
--
ALTER TABLE `old_reservation`
  ADD CONSTRAINT `old_reservation_ibfk_1` FOREIGN KEY (`evenement_id`) REFERENCES `evenement` (`id`),
  ADD CONSTRAINT `old_reservation_ibfk_2` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`);

--
-- Constraints for table `participation_artiste`
--
ALTER TABLE `participation_artiste`
  ADD CONSTRAINT `participation_artiste_ibfk_1` FOREIGN KEY (`artiste_id`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `participation_artiste_ibfk_2` FOREIGN KEY (`evenement_id`) REFERENCES `evenement` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `fk_reservations_espace` FOREIGN KEY (`espace_id`) REFERENCES `espace` (`id`),
  ADD CONSTRAINT `fk_reservations_utilisateur` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

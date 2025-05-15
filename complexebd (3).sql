-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 16, 2025 at 12:37 AM
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
-- Database: `complexedata`
--

-- --------------------------------------------------------

--
-- Table structure for table `chatbot`
--

CREATE TABLE `chatbot` (
  `id` int(11) NOT NULL,
  `question` varchar(255) NOT NULL,
  `reponse` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chatbot`
--

INSERT INTO `chatbot` (`id`, `question`, `reponse`) VALUES
(1, 'Bonjour', 'Bonjour! Bienvenue au Centre Culturel de Ouarzazate. Comment puis-je vous aider aujourd\'hui ?'),
(2, 'Qui êtes-vous ?', 'Je suis l\'assistant virtuel du Centre Culturel de Ouarzazate, ici pour vous informer sur nos activités et talents locaux.'),
(3, 'Au revoir', 'À bientôt ! N\'hésitez pas à revenir pour découvrir nos prochains événements.'),
(4, 'Quels sont vos horaires d\'ouverture ?', 'Le centre est ouvert du mardi au dimanche de 9h à 18h.'),
(5, 'Où êtes-vous situé ?', 'Nous sommes situés Avenue Mohammed V à Ouarzazate, près de l\'ancien cinéma Atlas.'),
(6, 'Quels événements avez-vous cette semaine ?', 'Je consulte notre calendrier... Voici les événements à venir : [liste dynamique des événements].'),
(7, 'Comment voir le calendrier des événements ?', 'Vous pouvez consulter notre calendrier complet dans la section \"Événements\" de notre site web.'),
(8, 'Comment réserver pour un atelier ?', 'Rendez-vous dans la section \"Réservations\", choisissez l\'atelier et complétez le formulaire en ligne.'),
(9, 'Comment s\'inscrire en tant que jeune talent ?', 'Créez un compte sur notre plateforme et complétez votre profil avec votre portfolio dans la section \"Jeunes Talents\".'),
(10, 'Quels domaines artistiques acceptez-vous ?', 'Nous accueillons les talents en musique, théâtre, peinture, artisanat et autres arts visuels ou performatifs.'),
(11, 'Comment contacter un artiste ?', 'Via notre plateforme : trouvez son profil et utilisez le système de messagerie interne.'),
(12, 'Avez-vous un espace pour organiser des événements ?', 'Oui, nos salles peuvent être réservées pour des expositions ou ateliers. Contactez-nous pour plus d\'infos.'),
(13, 'Proposez-vous des formations ?', 'Nous organisons régulièrement des ateliers et masterclasses. Consultez notre section \"Ateliers\".');

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
  `note` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `nom`, `email`, `telephone`, `message`, `is_read`, `created_at`, `updated_at`) VALUES
(1, 'soufiane oulahcen', 'soufiane.oulahcen9999@gmail.com', '0624193209', 'bla bla bla bla bla bla bla bla bla bla bla bla ', 0, '2025-05-13 21:07:21', '2025-05-13 21:07:21'),
(2, 'soufiane oulahcen', 'soufiane.oulahcen9999@gmail.com', '0624193209', 'there is what iris\n', 0, '2025-05-14 16:36:01', '2025-05-14 16:36:01');

-- --------------------------------------------------------

--
-- Table structure for table `espace`
--

CREATE TABLE `espace` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `type` enum('salle','atelier','exposition','cinéma') NOT NULL,
  `sous_type` enum('théâtre','bibliothèque','informatique','musique','conférence','café','photographie','langue','arts') DEFAULT NULL,
  `capacite` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `espace`
--

INSERT INTO `espace` (`id`, `nom`, `type`, `sous_type`, `capacite`, `description`, `image_url`) VALUES
(1, 'Salles de conférence', 'salle', 'conférence', 40, '', ''),
(2, 'Espaces d\'exposition', 'exposition', '', 40, '', ''),
(3, 'Ateliers musique', 'atelier', 'musique', 20, '', ''),
(4, 'Ateliers arts', 'atelier', 'arts', 20, '', ''),
(5, 'Salle de cinéma', 'salle', 'théâtre', 200, '', ''),
(6, 'salle de theatre', 'cinéma', '', 200, '', ''),
(7, 'Salle des Fêtes', 'salle', '', 200, 'Grande salle polyvalente pour spectacles et événements', 'salle1.jpg'),
(8, 'Espace Culturel', 'salle', 'conférence', 150, 'Salle modulable adaptée aux conférences et rencontres', 'espace1.jpg'),
(9, 'Galerie d\'Art Moderne', 'exposition', NULL, 50, 'Galerie d\'exposition avec éclairage professionnel', 'galerie1.jpg'),
(10, 'Théâtre Municipal', 'salle', 'théâtre', 300, 'Théâtre traditionnel avec scène équipée', 'theatre1.jpg'),
(11, 'Atelier Partagé', 'atelier', 'arts', 20, 'Espace de création partagé pour artistes', 'atelier1.jpg'),
(12, 'Salle de Conférence', 'salle', 'conférence', 100, 'Salle équipée pour séminaires et conférences', 'conference1.jpg'),
(13, 'Jardin des Arts', 'salle', NULL, 80, 'Espace extérieur aménagé pour événements culturels', 'jardin1.jpg'),
(14, 'Studio de Danse', 'atelier', 'musique', 30, 'Studio professionnel avec sols adaptés', 'studio1.jpg'),
(15, 'Café Littéraire', 'salle', 'café', 40, 'Café convivial avec espace pour lectures', 'cafe1.jpg'),
(16, 'Espace Multimédiax', 'salle', 'informatique', 60, 'Salle équipée pour projections et ateliers numériques', 'multimedia1.jpg');

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
(20, 'Foire Artisanalex', 'hal test test ', '2025-06-02 23:20:00', '2025-06-06 23:20:00', 3, 'atelier', '/uploads/EventAffiche/eventaffiche-1747264835032-29168367.jpg', 4, 0.00, 'planifie'),
(21, 'bla events', 'bla bla ', '2025-05-30 23:30:00', '2025-06-02 23:30:00', 1, 'conference', '/uploads/EventAffiche/eventaffiche-1747265478217-595342611.webp', 16, 0.00, 'planifie'),
(25, 'bla bla bla ', 'test ', '2025-06-01 16:36:00', '2025-06-06 16:36:00', 5, 'atelier', 'C:/Users/soufi/Downloads/CComplexe/server/public/uploads/EventAffiche/eventaffiche-1747327005732-146294222.jpg', 16, 0.00, 'planifie'),
(26, 'bla bla bla ', 'test ', '2025-06-01 16:36:00', '2025-06-06 16:36:00', 5, 'atelier', 'C:/Users/soufi/Downloads/CComplexe/server/public/uploads/EventAffiche/eventaffiche-1747327005732-146294222.jpg', 16, 0.00, 'planifie'),
(27, 'bla bla bla ', 'test ', '2025-06-01 16:36:00', '2025-06-06 16:36:00', 5, 'atelier', 'C:/Users/soufi/Downloads/CComplexe/server/public/uploads/EventAffiche/eventaffiche-1747327005732-146294222.jpg', 16, 0.00, 'planifie'),
(28, 'evenement sur le theatre', 'theatre bla bla bla ', '2025-05-31 22:30:00', '2025-06-02 22:30:00', 6, 'spectacle', '/uploads/EventAffiche/eventaffiche-1747348256247-466049129.png', 16, 0.00, 'planifie');

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
  `affiche_url` varchar(255) DEFAULT NULL,
  `proposeur_email` varchar(255) NOT NULL,
  `proposeur_nom` varchar(255) NOT NULL,
  `proposeur_telephone` varchar(255) DEFAULT NULL,
  `prix` decimal(10,2) DEFAULT 0.00,
  `statut` enum('en_attente','approuve','rejete') DEFAULT 'en_attente',
  `commentaire_admin` text DEFAULT NULL,
  `traite_par` int(11) DEFAULT NULL,
  `date_traitement` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_proposals`
--

INSERT INTO `event_proposals` (`id`, `titre`, `description`, `date_debut`, `date_fin`, `espace_id`, `type`, `affiche_url`, `proposeur_email`, `proposeur_nom`, `proposeur_telephone`, `prix`, `statut`, `commentaire_admin`, `traite_par`, `date_traitement`, `createdAt`, `updatedAt`) VALUES
(1, 'cozina', 'bla bla bla', '2025-05-30 17:36:00', '2025-05-31 17:36:00', 4, 'atelier', 'C:/Users/soufi/Downloads/CComplexe/server/public/uploads/EventAffiche/eventaffiche-1747244247065-469075116.jpg', 'anas@gmail.com', 'anas', '', 0.00, 'rejete', '', 1, '2025-05-15 22:20:47', '2025-05-14 17:37:27', '2025-05-15 22:20:47'),
(2, 'Foire Artisanalex', 'hal test test ', '2025-06-02 23:20:00', '2025-06-06 23:20:00', 3, 'atelier', 'C:/Users/soufi/Downloads/CComplexe/server/public/uploads/EventAffiche/eventaffiche-1747264835032-29168367.jpg', 'meryem@gmail.com', 'meryem', '0654328765', 0.00, 'approuve', '', 1, '2025-05-14 23:49:27', '2025-05-14 23:20:35', '2025-05-14 23:49:27'),
(3, 'bla events', 'bla bla ', '2025-05-30 23:30:00', '2025-06-02 23:30:00', 1, 'conference', 'C:/Users/soufi/Downloads/CComplexe/server/public/uploads/EventAffiche/eventaffiche-1747265478217-595342611.webp', 'brahimboukhizou123@gmail.com', 'brahim', '', 0.00, 'approuve', '', 1, '2025-05-14 23:49:18', '2025-05-14 23:31:18', '2025-05-14 23:49:18'),
(4, 'bla bla bla ', 'test ', '2025-06-01 16:36:00', '2025-06-06 16:36:00', 5, 'atelier', 'C:/Users/soufi/Downloads/CComplexe/server/public/uploads/EventAffiche/eventaffiche-1747327005732-146294222.jpg', 'brahimboukhizou123@gmail.com', 'brahim', '', 0.00, 'approuve', 'bla bla', 1, '2025-05-15 16:42:08', '2025-05-15 16:36:45', '2025-05-15 16:42:08'),
(5, 'evenement sur le theatre', 'theatre bla bla bla ', '2025-05-31 22:30:00', '2025-06-02 22:30:00', 6, 'spectacle', '/uploads/EventAffiche/eventaffiche-1747348256247-466049129.png', 'brahimboukhizou123@gmail.com', 'brahim', '', 0.00, 'approuve', 'merci de viens a le complexe pour terminer le procedure de reservation\n', 1, '2025-05-15 22:31:52', '2025-05-15 22:30:56', '2025-05-15 22:31:52');

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
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `utilisateurId`, `message`, `is_read`, `type`, `reference_id`, `reference_type`, `for_admins_only`, `createdAt`, `updatedAt`) VALUES
(1, NULL, 'Nouvelle proposition d\'événement: cozina', 1, 'event_proposal', 1, 'event_proposal', 1, '2025-05-14 17:37:27', '2025-05-14 23:56:51'),
(2, NULL, 'Événement créé à partir de la proposition: cozina', 1, 'success', 19, 'event', 1, '2025-05-14 22:33:07', '2025-05-14 23:56:51'),
(3, NULL, 'Nouvelle proposition d\'événement: Foire Artisanalex', 1, 'event_proposal', 2, 'event_proposal', 1, '2025-05-14 23:20:35', '2025-05-14 23:56:51'),
(4, NULL, 'Événement créé à partir de la proposition: Foire Artisanalex', 1, 'success', 20, 'event', 1, '2025-05-14 23:21:23', '2025-05-14 23:56:51'),
(5, NULL, 'Nouvelle proposition d\'événement: bla events', 1, 'event_proposal', 3, 'event_proposal', 1, '2025-05-14 23:31:18', '2025-05-14 23:56:51'),
(6, NULL, 'Événement créé à partir de la proposition: bla events', 1, 'success', 21, 'event', 1, '2025-05-14 23:31:47', '2025-05-14 23:56:51'),
(7, NULL, 'Proposition d\'événement rejetée : bla events', 1, 'info', 3, 'event_proposal', 1, '2025-05-14 23:47:37', '2025-05-14 23:56:51'),
(8, NULL, 'Événement créé à partir de la proposition: bla events', 1, 'success', 22, 'event', 1, '2025-05-14 23:47:41', '2025-05-14 23:56:51'),
(9, NULL, 'Proposition d\'événement rejetée : bla events', 1, 'info', 3, 'event_proposal', 1, '2025-05-14 23:49:19', '2025-05-14 23:56:51'),
(10, NULL, 'Événement créé à partir de la proposition: Foire Artisanalex', 1, 'success', 23, 'event', 1, '2025-05-14 23:49:27', '2025-05-14 23:56:51'),
(11, NULL, 'Nouvelle proposition d\'événement: bla bla bla ', 0, 'event_proposal', 4, 'event_proposal', 1, '2025-05-15 16:36:45', '2025-05-15 16:36:45'),
(12, NULL, 'Événement créé à partir de la proposition: bla bla bla ', 0, 'success', 25, 'event', 1, '2025-05-15 16:37:28', '2025-05-15 16:37:28'),
(13, NULL, 'Événement créé à partir de la proposition: bla bla bla ', 0, 'success', 26, 'event', 1, '2025-05-15 16:37:37', '2025-05-15 16:37:37'),
(14, NULL, 'Événement créé à partir de la proposition: bla bla bla ', 0, 'success', 27, 'event', 1, '2025-05-15 16:42:08', '2025-05-15 16:42:08'),
(15, NULL, 'Proposition d\'événement rejetée : cozina', 0, 'info', 1, 'event_proposal', 1, '2025-05-15 22:20:47', '2025-05-15 22:20:47'),
(16, NULL, 'Nouvelle proposition d\'événement: evenement sur le theatre', 0, 'event_proposal', 5, 'event_proposal', 1, '2025-05-15 22:30:56', '2025-05-15 22:30:56'),
(17, NULL, 'Événement créé à partir de la proposition: evenement sur le theatre', 0, 'success', 28, 'event', 1, '2025-05-15 22:31:52', '2025-05-15 22:31:52');

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type_reservation` enum('standard','evenement') DEFAULT 'standard',
  `type_organisateur` enum('individu','association','entreprise') DEFAULT 'individu',
  `date_debut` datetime NOT NULL,
  `date_fin` datetime NOT NULL,
  `espace_id` int(11) NOT NULL,
  `utilisateur_id` int(11) NOT NULL,
  `nombre_places` int(11) DEFAULT 1,
  `documents_fournis` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`documents_fournis`)),
  `documents_paths` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`documents_paths`)),
  `materiel_additionnel` text DEFAULT NULL,
  `statut` enum('en_attente','confirme','annule','termine') DEFAULT 'en_attente',
  `date_annulation` datetime DEFAULT NULL,
  `commentaires` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `titre`, `description`, `type_reservation`, `type_organisateur`, `date_debut`, `date_fin`, `espace_id`, `utilisateur_id`, `nombre_places`, `documents_fournis`, `documents_paths`, `materiel_additionnel`, `statut`, `date_annulation`, `commentaires`, `createdAt`, `updatedAt`) VALUES
(5, 'brahim reservation ', 'reservation aboiute bla bla bla bla ', 'standard', 'individu', '2025-05-31 11:48:00', '2025-06-01 11:48:00', 6, 16, 19, '{}', '{}', 'projecteur ', 'confirme', NULL, '', '2025-05-15 12:52:01', '2025-05-15 12:52:23');

-- --------------------------------------------------------

--
-- Table structure for table `tracage_evenement`
--

CREATE TABLE `tracage_evenement` (
  `id` int(11) NOT NULL,
  `evenement_id` int(11) DEFAULT NULL,
  `titre` varchar(255) NOT NULL,
  `affiche_url` varchar(255) DEFAULT NULL,
  `proposeur_nom` varchar(255) DEFAULT NULL,
  `proposeur_email` varchar(255) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `date_tracage` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tracage_evenement`
--

INSERT INTO `tracage_evenement` (`id`, `evenement_id`, `titre`, `affiche_url`, `proposeur_nom`, `proposeur_email`, `action`, `user_id`, `date_tracage`) VALUES
(1, 27, 'bla bla bla ', 'C:/Users/soufi/Downloads/CComplexe/server/public/uploads/EventAffiche/eventaffiche-1747327005732-146294222.jpg', 'brahim', 'brahimboukhizou123@gmail.com', 'acceptation', 1, '2025-05-15 16:42:08'),
(2, 28, 'evenement sur le theatre', '/uploads/EventAffiche/eventaffiche-1747348256247-466049129.png', 'brahim', 'brahimboukhizou123@gmail.com', 'acceptation', 1, '2025-05-15 22:31:52');

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
  `adresse` text DEFAULT NULL,
  `reseaux_sociaux` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`reseaux_sociaux`)),
  `experience` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`experience`)),
  `competences` text DEFAULT NULL,
  `disponibilites` text DEFAULT NULL,
  `cv` varchar(255) DEFAULT NULL,
  `specialite` varchar(255) DEFAULT NULL,
  `annees_experience` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `nom`, `email`, `password`, `role`, `date_inscription`, `is_talent`, `domaine_artiste`, `description_talent`, `image_profil`, `statut_talent`, `resetPasswordToken`, `resetPasswordExpires`, `telephone`, `adresse`, `reseaux_sociaux`, `experience`, `competences`, `disponibilites`, `cv`, `specialite`, `annees_experience`) VALUES
(1, 'complexe', 'ouarzazatecomplexe@gmail.com', '$2y$10$mRsJkAYezL02HJKK2LnYc.RfrHcPp0w.E0uLv52KEfDGCyxImuD9e', 'superadmin', '2025-05-13 17:21:29', 0, NULL, NULL, NULL, 'en_validation', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'oulahcen', 'soufiane.oulahcen9999@gmail.com', '$2b$10$9vtz9zBoOWBDeLE664/lgePcu88OkKPjdO6/CnHpbjmlAR.3SjWNK', 'admin', '2025-05-13 16:24:03', 0, NULL, NULL, NULL, 'en_validation', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'Fatima Zahra', 'fatima@artiste.ma', '$2y$10$mRsJkAYezL02HJKK2LnYc.RfrHcPp0w.E0uLv52KEfDGCyxImuD9e', 'utilisateur', '2025-05-13 16:29:49', 1, 'musicien', 'bla bla bla ', '/uploads/profiles/image_profil-1747154170691-825719455.jpg', 'actif', NULL, NULL, '0624193209', NULL, '{\"facebook\":\"https://www.facebook.com/profile.php?id=100015543606940\"}', '[]', 'test. bla , bla ', 'test', '/uploads/eventaffiche-1747154142648-552058569.pdf', 'musicien', 5),
(4, 'meryem', 'meryem@gmail.com', '$2b$10$lhyVE2dIF6Uoa/Xy/iwUa.izlmmrHN9yKOcjWZZaLaCLFyA2kKJLi', 'utilisateur', '2025-05-13 16:30:56', 0, NULL, NULL, '/uploads/profiles/image_profil-1747168499436-899989737.jpg', 'en_validation', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 'Jean Dupont', 'jean.dupont@email.com', '$2a$10$xJwL5v5zL3h5ZrF5XjQY.evJYv7tYf7X3ZJ3XjQY.evJYv7tYf7X3Z', 'utilisateur', '2023-01-15 10:30:00', 0, NULL, NULL, 'profil1.jpg', 'inactif', NULL, NULL, '0612345678', '12 Rue de Paris, 75001 Paris', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 'Marie Martin', 'marie.martin@email.com', '$2a$10$xJwL5v5zL3h5ZrF5XjQY.evJYv7tYf7X3ZJ3XjQY.evJYv7tYf7X3Z', 'admin', '2023-02-20 14:45:00', 1, 'Musique', 'Pianiste classique avec 10 ans d\'expérience', 'profil2.jpg', 'actif', NULL, NULL, '0698765432', '34 Avenue Mozart, 75016 Paris', '{\"twitter\": \"@mariemusic\", \"instagram\": \"@mariemusic\"}', '[{\"poste\": \"Pianiste\", \"lieu\": \"Opéra de Paris\", \"duree\": \"5 ans\"}]', 'Piano, Composition', 'Week-ends', NULL, 'Musique classique', 10),
(7, 'Pierre Lambert', 'pierre.lambert@email.com', '$2a$10$xJwL5v5zL3h5ZrF5XjQY.evJYv7tYf7X3ZJ3XjQY.evJYv7tYf7X3Z', 'utilisateur', '2023-03-10 09:15:00', 1, 'Peinture', 'Artiste peintre abstrait', 'profil3.jpg', 'en_validation', NULL, NULL, '0678912345', '56 Boulevard Saint-Germain, 75005 Paris', '{\"facebook\": \"pierre.artiste\"}', '[{\"poste\": \"Artiste indépendant\", \"lieu\": \"Galerie XYZ\", \"duree\": \"3 ans\"}]', 'Peinture à l\'huile, Aquarelle', 'En semaine', NULL, 'Art abstrait', 5),
(8, 'Sophie Bernard', 'sophie.bernard@email.com', '$2a$10$xJwL5v5zL3h5ZrF5XjQY.evJYv7tYf7X3ZJ3XjQY.evJYv7tYf7X3Z', 'superadmin', '2023-01-05 08:00:00', 0, NULL, NULL, 'profil4.jpg', 'inactif', NULL, NULL, '0687654321', '78 Rue de Rivoli, 75004 Paris', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 'Lucie Petit', 'lucie.petit@email.com', '$2a$10$xJwL5v5zL3h5ZrF5XjQY.evJYv7tYf7X3ZJ3XjQY.evJYv7tYf7X3Z', 'utilisateur', '2023-04-18 16:20:00', 1, 'Danse', 'Danseuse contemporaine', 'profil5.jpg', 'actif', NULL, NULL, '0656789123', '90 Avenue des Champs-Élysées, 75008 Paris', '{\"instagram\": \"@luciedanse\"}', '[{\"poste\": \"Danseuse principale\", \"lieu\": \"Théâtre National\", \"duree\": \"7 ans\"}]', 'Danse contemporaine, Chorégraphie', 'Soirées', NULL, 'Danse moderne', 8),
(10, 'Thomas Moreau', 'thomas.moreau@email.com', '$2a$10$xJwL5v5zL3h5ZrF5XjQY.evJYv7tYf7X3ZJ3XjQY.evJYv7tYf7X3Z', 'utilisateur', '2023-05-22 11:10:00', 0, NULL, NULL, 'profil6.jpg', 'inactif', NULL, NULL, '0645678912', '23 Rue de la Pompe, 75016 Paris', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 'Emma Laurent', 'emma.laurent@email.com', '$2a$10$xJwL5v5zL3h5ZrF5XjQY.evJYv7tYf7X3ZJ3XjQY.evJYv7tYf7X3Z', 'admin', '2023-06-30 13:25:00', 1, 'Théâtre', 'Comédienne et metteuse en scène', 'profil7.jpg', 'actif', NULL, NULL, '0634567891', '45 Rue du Faubourg Saint-Honoré, 75008 Paris', '{\"twitter\": \"@emmatheatre\", \"facebook\": \"emma.theatre\"}', '[{\"poste\": \"Comédienne\", \"lieu\": \"Théâtre de la Ville\", \"duree\": \"12 ans\"}]', 'Jeu d\'acteur, Mise en scène', 'Variable', NULL, 'Théâtre classique', 15),
(16, 'brahim', 'brahimboukhizou123@gmail.com', '$2b$10$GkNrf3yztRMQNHdA/DrVHO70WfUKWwr9w/nVZCALiuisrukjyX9rC', 'utilisateur', '2025-05-13 17:18:38', 0, NULL, NULL, '/uploads/profiles/image_profil-1747348185062-287751438.png', 'en_validation', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(17, 'anas', 'anas@gmail.com', '$2b$10$u8kP5Bu38Gc9FhP7aLYxl.Du7wc37uYIJ/Ym17WX37b69xNRAJ6di', 'utilisateur', '2025-05-14 17:29:24', 0, NULL, NULL, NULL, 'en_validation', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(18, 'hassan', 'hassan@gmail.com', '$2b$10$JIf2nYQAlswZufR3A76K3OIDxazZLoShrNMO0SqkwHmzAa1GeW6cm', 'utilisateur', '2025-05-15 16:19:10', 0, NULL, NULL, NULL, 'en_validation', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chatbot`
--
ALTER TABLE `chatbot`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `commentaire`
--
ALTER TABLE `commentaire`
  ADD PRIMARY KEY (`id`),
  ADD KEY `utilisateur_id` (`utilisateur_id`),
  ADD KEY `evenement_id` (`evenement_id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

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
  ADD KEY `espace_id` (`espace_id`),
  ADD KEY `traite_par` (`traite_par`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `utilisateurId` (`utilisateurId`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `espace_id` (`espace_id`),
  ADD KEY `utilisateur_id` (`utilisateur_id`);

--
-- Indexes for table `tracage_evenement`
--
ALTER TABLE `tracage_evenement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_evenement_id` (`evenement_id`),
  ADD KEY `fk_user_id` (`user_id`);

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
-- AUTO_INCREMENT for table `chatbot`
--
ALTER TABLE `chatbot`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `commentaire`
--
ALTER TABLE `commentaire`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `espace`
--
ALTER TABLE `espace`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `evenement`
--
ALTER TABLE `evenement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `event_proposals`
--
ALTER TABLE `event_proposals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tracage_evenement`
--
ALTER TABLE `tracage_evenement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

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
  ADD CONSTRAINT `event_proposals_ibfk_1` FOREIGN KEY (`espace_id`) REFERENCES `espace` (`id`),
  ADD CONSTRAINT `event_proposals_ibfk_2` FOREIGN KEY (`traite_par`) REFERENCES `utilisateur` (`id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`utilisateurId`) REFERENCES `utilisateur` (`id`);

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`espace_id`) REFERENCES `espace` (`id`),
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`);

--
-- Constraints for table `tracage_evenement`
--
ALTER TABLE `tracage_evenement`
  ADD CONSTRAINT `fk_evenement_id` FOREIGN KEY (`evenement_id`) REFERENCES `evenement` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `utilisateur` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

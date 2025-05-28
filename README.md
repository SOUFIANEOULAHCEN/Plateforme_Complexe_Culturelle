# Complexe Culturel - Application Web

Cette application est une plateforme complète de gestion de complexe culturel permettant la réservation d'espaces, la gestion d'événements, et l'interaction entre utilisateurs.

## Architecture du Projet

Le projet est divisé en deux parties principales :

### Backend (dossier `server/`)
- Framework : Node.js avec Express
- Base de données : MySQL (via Sequelize ORM)
- Structure :
  - `config/` : Configuration de la base de données et autres paramètres
  - `controllers/` : Logique métier et traitement des requêtes
  - `models/` : Modèles de données (Utilisateur, Événement, Réservation, Espace, etc.)
  - `routes/` : API RESTful pour :
    - Authentification et gestion des utilisateurs
    - Gestion des événements et propositions
    - Réservation d'espaces
    - Tableau de bord et statistiques
    - Chatbot et support
    - Notifications et commentaires
  - `middlewares/` : Middlewares d'authentification et validation
  - `utils/` : Fonctions utilitaires
  - `migrations/` : Scripts de migration de la base de données

### Frontend (dossier `client/`)
- Framework : React avec Vite
- UI : Tailwind CSS
- Structure :
  - `src/` : Code source React
    - `components/` : Composants réutilisables
    - `pages/` : Pages de l'application
    - `i18n/` : Internationalisation
    - `assets/` : Ressources statiques
    - `api.js` : Configuration des appels API
  - `public/` : Assets statiques

## Fonctionnalités Principales

1. **Gestion des Utilisateurs**
   - Authentification sécurisée (JWT)
   - Profils utilisateurs personnalisés
   - Système de rôles et permissions
   - Gestion des contacts et messages

2. **Gestion des Espaces**
   - Réservation d'espaces avec calendrier
   - Gestion des disponibilités
   - Système de tarification
   - Suivi des réservations

3. **Gestion des Événements**
   - Création et modification d'événements
   - Système de propositions d'événements
   - Gestion des commentaires
   - Suivi des événements

4. **Tableau de Bord Administratif**
   - Statistiques et métriques
   - Gestion des notifications
   - Administration des utilisateurs
   - Configuration du complexe

5. **Chatbot et Support**
   - Support utilisateur automatisé
   - Réponses aux questions fréquentes
   - Système de logs pour le suivi

6. **Fonctionnalités Sociales**
   - Système de commentaires
   - Notifications en temps réel
   - Gestion des talents

## Installation

### Prérequis
- Node.js (v14 ou supérieur)
- MySQL (v8.0 ou supérieur)
- npm ou yarn

### Backend
```bash
cd server
npm install
# Configurer les variables d'environnement dans .env
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Configuration

1. Créer un fichier `.env` dans le dossier `server/` avec les variables suivantes :
```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=complexe_db
JWT_SECRET=your_jwt_secret
```

2. Configurer la base de données :
```bash
cd server
node run-migration.js
```

## Déploiement

1. Build du frontend :
```bash
cd client
npm run build
```

2. Build du backend :
```bash
cd server
npm run build
```

## Sécurité

- Protection des données sensibles
- Authentification JWT
- Validation des entrées
- Protection CORS
- Gestion sécurisée des sessions
- Logs de sécurité

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. 
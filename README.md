# Complexe Culturel - Application Web

Cette application est une plateforme de gestion de complexe culturel permettant la réservation d'espaces, la gestion d'événements, et l'interaction entre utilisateurs.

## Architecture du Projet

Le projet est divisé en deux parties principales :

### Backend (dossier `server/`)
- Framework : Node.js avec Express
- Base de données : MySQL (via Sequelize ORM)
- Structure :
  - `config/` : Configuration de la base de données et autres paramètres
  - `controllers/` : Logique métier
  - `models/` : Modèles de données
  - `routes/` : Définition des routes API
  - `middlewares/` : Middlewares d'authentification et validation
  - `utils/` : Fonctions utilitaires
  - `migrations/` : Scripts de migration de la base de données

### Frontend (dossier `client/`)
- Framework : React avec Vite
- UI : Tailwind CSS
- Structure :
  - `src/` : Code source React
  - `public/` : Assets statiques
  - `components/` : Composants réutilisables
  - `pages/` : Pages de l'application
  - `services/` : Services API

## Fonctionnalités Principales

1. **Gestion des Utilisateurs**
   - Authentification
   - Profils utilisateurs
   - Rôles et permissions

2. **Gestion des Espaces**
   - Réservation d'espaces
   - Calendrier des disponibilités
   - Gestion des tarifs

3. **Gestion des Événements**
   - Création et modification d'événements
   - Système de propositions
   - Gestion des commentaires

4. **Tableau de Bord**
   - Statistiques
   - Notifications
   - Gestion des talents

5. **Chatbot**
   - Support utilisateur automatisé
   - Réponses aux questions fréquentes

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

- Les fichiers sensibles (SQL, .env) sont ignorés par Git
- Authentification JWT
- Validation des entrées
- Protection CORS
- Gestion des sessions

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. 
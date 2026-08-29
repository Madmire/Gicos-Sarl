# GICOS - Galaxie Immobilière Construction et Services

Site web immobilier professionnel avec interface d'administration.

## Technologies

### Backend
- **FastAPI** - Framework Python moderne et performant
- **SQLAlchemy** - ORM pour la base de données
- **SQLite** (remplaçable par PostgreSQL)
- **JWT** - Authentification sécurisée
- **Pydantic** - Validation des données

### Frontend
- **React.js** (Vite) - Interface utilisateur réactive
- **React Router** - Navigation SPA
- **Tailwind CSS** - Design moderne
- **Axios** - Requêtes HTTP
- **Lucide Icons** - Icônes élégantes

## Installation

### Prérequis
- Python 3.9+
- Node.js 18+
- npm ou yarn

### Backend

```bash
# Aller dans le dossier backend
cd backend

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement (Windows)
venv\Scripts\activate

# Activer l'environnement (Linux/Mac)
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Lancer le serveur
python main.py
```

Le serveur sera accessible sur http://localhost:8000

Documentation API : http://localhost:8000/docs

### Frontend

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur http://localhost:5173

## Identifiants Admin

Par défaut, un utilisateur administrateur est créé au démarrage :

- **Utilisateur** : `admin`
- **Mot de passe** : `admin123`

Accédez à l'administration via http://localhost:5173/admin

## Structure du Projet

```
gicos/
├── backend/
│   ├── main.py              # Point d'entrée FastAPI
│   ├── database.py          # Configuration base de données
│   ├── models.py            # Modèles SQLAlchemy
│   ├── schemas.py           # Schémas Pydantic
│   ├── auth.py              # Authentification JWT
│   ├── uploads/             # Images uploadées
│   └── routers/
│       ├── auth.py          # Routes authentification
│       ├── properties.py    # Routes annonces
│       ├── gallery.py       # Routes galerie
│       ├── contact.py       # Routes contact
│       ├── services.py      # Routes services
│       └── testimonials.py  # Routes témoignages
│
└── frontend/
    ├── src/
    │   ├── components/      # Composants réutilisables
    │   ├── pages/           # Pages du site
    │   │   └── admin/       # Pages administration
    │   ├── layouts/         # Layouts (public/admin)
    │   ├── context/         # Context React (Auth)
    │   ├── api/             # Service API
    │   └── App.jsx          # Application principale
    ├── index.html
    ├── tailwind.config.js
    └── vite.config.js
```

## Fonctionnalités

### Site Public
- Page d'accueil moderne avec hero, services, annonces récentes, galerie, témoignages
- Liste des annonces avec filtres (type, ville, prix, surface)
- Détail d'annonce avec galerie photos et formulaire de contact
- Galerie d'images par catégorie avec lightbox
- Page des services détaillée
- Page contact avec formulaire et Google Maps

### Administration
- Tableau de bord avec statistiques
- Gestion des annonces (CRUD complet)
- Upload multiple d'images
- Gestion de la galerie par catégorie
- Modification des textes des services
- Gestion des messages de contact
- Gestion des témoignages clients

## API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Utilisateur courant

### Annonces
- `GET /api/properties/` - Liste des annonces
- `GET /api/properties/{id}` - Détail annonce
- `POST /api/properties/` - Créer (auth)
- `PUT /api/properties/{id}` - Modifier (auth)
- `DELETE /api/properties/{id}` - Supprimer (auth)
- `POST /api/properties/{id}/images` - Upload images (auth)

### Galerie
- `GET /api/gallery/` - Liste des images
- `GET /api/gallery/types` - Types de catégories
- `POST /api/gallery/upload` - Upload (auth)
- `DELETE /api/gallery/{id}` - Supprimer (auth)

### Contact
- `POST /api/contact/` - Envoyer message
- `GET /api/contact/` - Liste messages (auth)

### Services
- `GET /api/services/` - Liste des services
- `PUT /api/services/{id}` - Modifier (auth)

### Témoignages
- `GET /api/testimonials/` - Liste témoignages
- `POST /api/testimonials/` - Créer (auth)
- `PUT /api/testimonials/{id}` - Modifier (auth)
- `DELETE /api/testimonials/{id}` - Supprimer (auth)

## Personnalisation

### Couleurs
Les couleurs principales sont définies dans `frontend/tailwind.config.js` :
- **Bleu primaire** : #1E40AF
- **Or/Doré** : #F59E0B

### Informations de contact
Modifiez les coordonnées dans :
- `frontend/src/components/Navbar.jsx`
- `frontend/src/components/Footer.jsx`
- `frontend/src/pages/ContactPage.jsx`

### Logo
Remplacez le logo dans `frontend/public/favicon.svg` et adaptez les composants Navbar/Footer.

## Production

Architecture : **Vercel** (frontend) + **Render** (API) + **Neon** (PostgreSQL) + **Cloudinary** (images).

### Variables

**Backend (Render)** — voir `backend/.env.example` :
- `DATABASE_URL` (Neon)
- `SECRET_KEY`
- `CORS_ORIGINS` (URL Vercel)
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`

**Frontend (Vercel)** — Root Directory = `frontend` :
- `VITE_API_URL` = URL Render (ex. `https://gicos-api.onrender.com`)

### Backend
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend
```bash
npm run build
```

Les fichiers de production seront dans `frontend/dist/`

## Sécurité

En production :
1. Changez la `SECRET_KEY` dans `backend/auth.py`
2. Configurez CORS correctement dans `backend/main.py`
3. Utilisez HTTPS
4. Changez le mot de passe admin par défaut

## Licence

Projet privé - GICOS SARL

---

Développé avec passion pour GICOS - Galaxie Immobilière Construction et Services

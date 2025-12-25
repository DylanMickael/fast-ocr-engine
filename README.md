# Llama OCR - Système d'Archivage Intelligent

Ce projet est un système d'OCR (Reconnaissance Optique de Caractères) intelligent conçu pour numériser et archiver des lettres administratives. Il utilise **FastAPI** pour le backend, **Vanilla JS** pour le frontend, et l'API **LlamaIndex (LlamaExtract)** pour l'extraction structurée des données.

## 🚀 Fonctionnalités

- **Extraction Intelligente** : Utilise LlamaExtract avec un schéma JSON strict pour extraire :
  - Service Expéditeur
  - Service Destinataire
  - Date
  - Numéro de la lettre
  - Objet
  - Degré d'importance (Normal, Urgent, Très Urgent)
  - Corps de la lettre (paragraphes complets)
- **Interface Premium** : Design moderne avec Glassmorphism, mode sombre et animations fluides.
- **Gestion CRUD** : Enregistrez, visualisez, recherchez et supprimez vos lettres archivées (stockage local).
- **Architecture Micro-service** : Communication fluide entre un micro-service Python (FastAPI) et une interface Web.

## 🛠️ Structure du Projet

```text
ocr-js/
├── backend/            # Micro-service FastAPI (Python)
│   ├── main.py         # Serveur API et logique LlamaExtract
│   ├── requirements.txt # Dépendances Python
│   └── .env            # Clé API LlamaCloud
├── frontend/           # Interface utilisateur (JS/HTML/CSS)
│   ├── index.html      # Page principale
│   ├── css/            # Styles CSS
│   ├── js/             # Logique applicative (Modules ES)
│   └── server.js       # Petit serveur statique Node.js
└── README.md
```

## ⚙️ Installation

### 1. Backend (Python)
- Allez dans le dossier `backend`.
- Créez un environnement virtuel (optionnel mais recommandé) :
  ```bash
  virtualenv venv
  .\venv\Scripts\activate
  ```
- Installez les dépendances :
  ```bash
  pip install -r requirements.txt
  ```
- Créez un fichier `.env` dans le dossier `backend` et ajoutez votre clé :
  ```env
  LLAMA_CLOUD_API_KEY=votre_cle_ici
  ```
- Lancez le serveur :
  ```bash
  uvicorn main:app --reload
  ```

### 2. Frontend (JavaScript)
- Allez dans le dossier `frontend`.
- Lancez le serveur statique :
  ```bash
  node server.js
  ```
- Accédez à l'application via : **`http://localhost:3000`**

## 📖 Utilisation

1. Glissez-déposez une image de lettre sur la zone d'upload.
2. Attendez l'extraction par l'IA (Mode **PREMIUM** activé pour une précision maximale).
3. Vérifiez les données extraites dans le formulaire.
4. Cliquez sur "Enregistrer" pour ajouter la lettre à votre archive locale.
5. Gérez vos documents dans l'onglet "Archive".

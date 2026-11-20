# Ordonnances — Cabinet Dentaire Djossou

Application web de rédaction, d'impression et d'archivage des ordonnances.

- **Rédaction rapide** : catalogue de médicaments avec recherche par mots (« amox 1g »), posologie et quantité pré-remplies, lignes modifiables et réordonnables, produits hors catalogue.
- **Archivage** : chaque ordonnance est enregistrée avec un numéro unique (`ORD-2026-00001`), l'auteur et la date.
- **Recherche** : par patient (sans tenir compte des accents ni des majuscules), numéro, médicament et période.
- **Renouvellement** en un clic, modification, réimpression à l'identique.
- **Tableau de bord** : activité du jour / du mois, derniers patients, médicaments les plus prescrits.
- **Comptes utilisateurs** (administrateur / utilisateur), en-tête du cabinet modifiable, sauvegarde téléchargeable.

## Architecture

| Élément | Choix | Pourquoi |
|---|---|---|
| Serveur | Node.js ≥ 22.13 + Express | Un seul processus, aucune compilation |
| Base de données | SQLite intégrée à Node (`node:sqlite`) | Un seul fichier `data/ordonnances.db`, rien à installer, facile à sauvegarder |
| Interface | HTML/CSS/JS sans framework | Aucune étape de build, fonctionne hors ligne sur le réseau local |
| Sécurité | Mots de passe `scrypt`, sessions en cookie `HttpOnly`, limitation des tentatives de connexion, en-têtes CSP | — |

Règles d'accès : tout utilisateur connecté peut rédiger, rechercher, modifier et imprimer. Seul un **administrateur** peut supprimer une ordonnance, modifier l'en-tête, gérer les comptes et télécharger la sauvegarde.

**Comptes :** chaque personne crée son compte depuis l'écran de connexion (« Créer mon compte »). Le compte reste *en attente* tant qu'un administrateur ne l'a pas validé dans **Paramètres → Utilisateurs** (une alerte apparaît sur son tableau de bord). Les comptes créés ainsi sont de simples utilisateurs : ils ne voient pas les fonctions d'administration.

```
server.js            point d'entrée
src/db.js            schéma de la base, création au premier lancement
src/api.js           API REST (/api/...)
src/auth.js          connexion, sessions, mots de passe
src/seed.js          catalogue initial de médicaments
public/              interface (index.html, css/, js/)
scripts/backup.js    sauvegarde planifiable
deploy/              exemples systemd et Nginx
```

## Installer l'application sur chaque poste

L'application s'installe comme un logiciel, avec l'icône du cabinet sur le bureau et dans le menu Démarrer, et s'ouvre dans sa propre fenêtre :

- **Chrome / Edge** : cliquer sur **« Installer l'application »** en bas du menu de gauche (ou sur l'icône d'installation à droite de la barre d'adresse).
- **Téléphone Android** : menu ⋮ → *Installer l'application* ; **iPhone** (Safari) : Partager → *Sur l'écran d'accueil*.

> Les navigateurs n'autorisent l'installation que si le site est en **HTTPS** (ou ouvert sur le poste serveur lui-même via `http://localhost:3000`). Sur les autres postes, mettre l'application en HTTPS (voir « Déploiement » : IIS ou Nginx). En attendant, dans Chrome, ouvrir `chrome://flags/#unsafely-treat-insecure-origin-as-secure`, y saisir l'adresse du serveur (ex. `http://192.168.1.10:3000`), activer et redémarrer Chrome.

## Lancer en local

```bash
npm install
npm start
```

Ouvrir http://localhost:3000. Au **premier démarrage**, un compte `admin` est créé et son mot de passe est affiché dans la console (ou celui de `ADMIN_PASSWORD` s'il est défini). Changez-le dans **Paramètres → Mon compte**, puis créez un compte pour chaque personne du cabinet.

**Mot de passe perdu ?** Sur le serveur, dans le dossier de l'application :

```bash
npm run reset-password -- NouveauMotDePasse
```

(ajouter l'identifiant en second argument pour un autre compte que `admin` ; s'il n'existe pas, un compte administrateur est créé).

> Ne faites pas tourner l'application depuis une clé USB : la base de données doit être sur un disque interne du serveur.

## Déploiement sur le serveur de l'entreprise

### 1. Préparer le serveur

1. Installer **Node.js 22.13 ou plus récent** (version LTS, https://nodejs.org).
2. Copier le dossier du projet sur le serveur (sans `node_modules` ni `data`), par exemple `C:\Apps\ordonnances` ou `/opt/ordonnances`.
3. Dans ce dossier :
   ```bash
   npm ci --omit=dev
   ```
4. Copier `.env.example` en `.env` et l'adapter (port, `ADMIN_PASSWORD`, fuseau horaire).
5. Premier lancement manuel pour vérifier : `npm start`, puis ouvrir `http://<ip-du-serveur>:3000` depuis un poste du cabinet.

### 2a. Serveur Windows (service permanent)

Utiliser [NSSM](https://nssm.cc) pour lancer l'application comme service Windows (démarrage automatique, redémarrage en cas d'erreur) :

```powershell
nssm install Ordonnances "C:\Program Files\nodejs\node.exe" "--env-file-if-exists=.env server.js"
nssm set Ordonnances AppDirectory C:\Apps\ordonnances
nssm set Ordonnances AppStdout C:\Apps\ordonnances\logs\app.log
nssm set Ordonnances AppStderr C:\Apps\ordonnances\logs\app.log
nssm start Ordonnances
```

Ouvrir le port dans le pare-feu (réseau local uniquement) :

```powershell
New-NetFirewallRule -DisplayName "Ordonnances" -Direction Inbound -Protocol TCP -LocalPort 3000 -RemoteAddress LocalSubnet -Action Allow
```

Pour du HTTPS sous Windows, placer IIS devant l'application (modules *URL Rewrite* + *ARR*, règle de reverse proxy vers `http://127.0.0.1:3000`) et mettre dans `.env` : `HOST=127.0.0.1`, `TRUST_PROXY=1`, `COOKIE_SECURE=1`.

### 2b. Serveur Linux (systemd)

```bash
sudo useradd --system --home /opt/ordonnances ordonnances
sudo mkdir -p /opt/ordonnances/data /opt/ordonnances/backups
sudo chown -R ordonnances: /opt/ordonnances
sudo cp deploy/ordonnances.service /etc/systemd/system/
sudo systemctl enable --now ordonnances
sudo journalctl -u ordonnances -f      # journaux (mot de passe admin initial)
```

HTTPS : voir `deploy/nginx.conf`.

### 2c. Docker

```bash
docker build -t ordonnances .
docker run -d --name ordonnances --restart unless-stopped -p 3000:3000 \
  -v ordonnances-data:/data -e ADMIN_PASSWORD='MotDePasseInitial' ordonnances
```

### 3. Sauvegardes (indispensable)

Toutes les données sont dans **un seul fichier** : `data/ordonnances.db`.

- **Automatique** : planifier chaque nuit `npm run backup` (ou `node scripts/backup.js D:\Sauvegardes\ordonnances`). Une copie cohérente est créée même si l'application tourne ; les 30 dernières sont conservées (`BACKUP_KEEP`).
  - Windows : Planificateur de tâches → action `node.exe`, arguments `scripts\backup.js D:\Sauvegardes\ordonnances`, dossier de départ `C:\Apps\ordonnances`.
  - Linux : `0 2 * * * cd /opt/ordonnances && /usr/bin/node scripts/backup.js`
- **Manuelle** : Paramètres → Sauvegarde → *Télécharger la sauvegarde*.
- Copier régulièrement les sauvegardes **hors du serveur** (disque externe, NAS, cloud de l'entreprise).
- **Restaurer** : arrêter le service, remplacer `data/ordonnances.db` par la sauvegarde (supprimer aussi `ordonnances.db-wal` et `ordonnances.db-shm` s'ils existent), redémarrer.

### 4. Mise à jour de l'application

Arrêter le service, remplacer les fichiers du projet **sans toucher au dossier `data/` ni à `.env`**, lancer `npm ci --omit=dev`, redémarrer. Le schéma de la base est créé/complété automatiquement au démarrage.

## Points d'attention

- **Données de santé** : l'application ne doit être accessible que depuis le réseau du cabinet (pare-feu) ; si elle doit l'être depuis l'extérieur, passer obligatoirement par HTTPS ou un VPN.
- Si l'application est derrière un reverse proxy, mettre `TRUST_PROXY=1`, sinon la limitation des tentatives de connexion considère tous les postes comme une seule adresse.
- Le fuseau horaire du serveur (`TZ`) détermine ce qu'est « aujourd'hui » dans le tableau de bord.

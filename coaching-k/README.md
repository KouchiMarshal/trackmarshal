# K-Coaching — site vitrine

Site statique autonome (`index.html` + `styles.css` + images) du coaching
sportif à domicile K-Coaching (Kevin), zone Alençon / Sées / Mortagne-au-Perche
/ L'Aigle.

## Déploiement

Le workflow `.github/workflows/deploy-coaching-k.yml` envoie automatiquement le
contenu de ce dossier vers l'hébergement OVH (dossier `www`) à chaque
modification poussée sur `master`.

Secrets requis sur le dépôt (Settings → Secrets and variables → Actions) :

- `FTP_SERVER` — serveur FTP OVH (ex. `ftp.cluster0XX.hosting.ovh.net`)
- `FTP_USERNAME` — identifiant FTP OVH
- `FTP_PASSWORD` — mot de passe FTP OVH

Site en ligne : https://www.coaching-k.fr

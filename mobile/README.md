# TrackMarshal Mobile

Application mobile iOS + Android pour TrackMarshal, construite avec **Expo SDK 52** et **Expo Router v4**. Elle partage le même backend Supabase que le site web (`trackmarshal.app`).

Deux espaces dans une seule app :

- **Commissaire** — dashboard, liste et détail des événements, candidatures, profil & licences, check-in par QR code.
- **Organisateur** — dashboard, gestion des candidatures (accepter / refuser), création d'événement. L'onglet « Organiser » n'apparaît que pour les comptes organisateurs.

## Démarrage

```bash
cd mobile
npm install
cp .env.example .env   # puis renseigne les clés Supabase (mêmes que le web)
npx expo start
```

Variables d'environnement requises (`.env`) :

```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

## Structure

```
app/
  (auth)/        Connexion / inscription
  (app)/         Espace connecté (tabs)
    index.tsx        Dashboard commissaire
    events/          Événements (liste + détail)
    applications.tsx Mes candidatures
    profile.tsx      Profil & licences
    checkin.tsx      Scanner QR de présence
    organizer/       Espace organisateur (conditionnel)
components/      UI réutilisable (Button, Badge, EventCard)
constants/       Couleurs
hooks/           useAuth (session + profil)
lib/             Client Supabase (persistance via SecureStore)
```

## Stack

- Expo SDK 52 / Expo Router v4 (routing par fichiers)
- Supabase JS (auth + base de données partagée avec le web)
- `expo-camera` (scan QR), `expo-secure-store` (session), `expo-notifications`
- React Native StyleSheet

## Build

```bash
npx expo run:ios       # build iOS local
npx expo run:android   # build Android local
```

Pour des builds de production / stores, utiliser EAS Build (`eas build`).

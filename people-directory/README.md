# People Directory

Application Angular 21 d'apprentissage autour d'un annuaire de personnes.

Le projet met en pratique un CRUD complet avec Angular Material, une API MockAPI,
des routes protegees, de l'internationalisation, des formulaires reactifs et une
architecture separee par responsabilites.

## Fonctionnalites

- Liste des personnes avec recherche, tri et pagination.
- Consultation d'une fiche personne.
- Creation, modification et suppression avec confirmation.
- Gestion des etats loading, empty, error et not found.
- Formulaire reactif avec validation et focus sur le premier champ invalide.
- Navigation protegee selon le statut connecte et le role administrateur.
- Profil utilisateur et affichage des permissions disponibles.
- Interface traduite en francais et en anglais.

## Choix Techniques

- Angular 21 avec composants standalone.
- Signals et `computed()` pour l'etat local et les permissions derivees.
- `httpResource()` pour les lectures reactives de la liste et du detail.
- Services separes pour les appels API, les ressources et la securite.
- Guards places dans `core/security/guards` pour garder les routes lisibles.
- URL API centralisee dans `core/api/api.config.ts`.
- Angular Material pour les composants UI principaux.
- `@ngx-translate/core` pour l'internationalisation.

## Architecture

Le projet suit une organisation simple:

- `core/`: services transverses, securite, configuration API, langue.
- `features/`: pages et logique metier par domaine fonctionnel.
- `shared/`: composants UI reutilisables, validateurs et helpers communs.

Cette separation permet de garder les composants de page orientes parcours
utilisateur, pendant que les services portent les responsabilites techniques ou
metier.

## Apprentissages

Ce projet a permis de pratiquer:

- la structuration d'une app Angular moderne;
- les routes lazy-loadees;
- les guards et permissions centralisees;
- les formulaires reactifs types;
- les validators custom;
- les signals pour l'etat et les droits UI;
- la gestion des etats d'ecran;
- l'internationalisation;
- la difference entre logique de page, logique API et logique de securite.

## Commandes

Installer les dependances:

```bash
npm install
```

Lancer l'application:

```bash
npm run start
```

Construire l'application:

```bash
npm run build
```

Lancer les tests unitaires:

```bash
npm test
```

## Notes De Fin

L'application est consideree comme terminee pour l'objectif d'apprentissage.

Deux pistes restent possibles pour aller plus loin plus tard:

- ajouter une vraie couverture de tests unitaires et composants;
- analyser le warning de budget du bundle initial signale par `ng build`.

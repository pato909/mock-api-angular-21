# Code Review Findings

Date: 2026-05-21

## Findings

1. `[P1]` Les actions "voir" et "modifier" de la liste ne sont pas réellement désactivées pour un utilisateur non autorisé.

Fichier: [persons-list-page.ts](/abs/path/C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/pages/persons-list-page/persons-list-page.ts)

Dans la liste des personnes, `[disabled]` est appliqué sur des balises `<a>` avec `routerLink`. Cela n'empêche pas la navigation Angular. Un utilisateur non connecté peut encore ouvrir le détail via clic ou clavier, puis se faire bloquer plus loin par le guard. Ce n'est pas une faille serveur, mais c'est une incohérence de sécurité côté UI et une régression UX/accessibilité.

2. `[P1]` Le lien "modifier" sur la fiche détail reste activable au clavier même quand l'édition est interdite.

Fichier: [person-detail-page.ts](/abs/path/C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/pages/person-detail-page/person-detail-page.ts)

La vue détail neutralise seulement la souris avec `pointer-events-none` et l'opacité. Le `routerLink` reste présent, donc tabulation + Entrée permet encore de partir vers `/edit`, puis d'atterrir sur `/denied`. Même problème de cohérence permission/UI, avec un impact accessibilité plus net.

3. `[P1]` La langue de session récupérée après login n'est jamais appliquée à la traduction de l'application.

Fichiers:
- [security.service.ts](/abs/path/C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/core/security/security.service.ts)
- [language.service.ts](/abs/path/C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/core/language/language.service.ts)

`SecurityService` reconstruit `user.locale` depuis `login.language`, mais `LanguageService.init()` ne lit que `localStorage`. Résultat: le profil peut annoncer une locale de session différente de la langue réellement affichée. Après un login imposé en `en`, l'UI peut rester en `fr`, ce qui casse le contrat fonctionnel attendu autour de l'authentification.

4. `[P2]` Le premier chargement de la liste peut partir avec un tri incohérent.

Fichiers:
- [persons-resources.ts](/abs/path/C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/data/persons-resources.ts)
- [persons-list-page.ts](/abs/path/C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/pages/persons-list-page/persons-list-page.ts)

`PersonsResources` initialise `sortBy: 'name'`, alors que la page pousse ensuite `sortBy: 'lastName'`. Comme `httpResource()` est réactif dès la construction du service, cela peut provoquer un premier appel API avec un champ de tri non supporté ou, au minimum, un double fetch inutile au bootstrap.

5. `[P2]` Le comptage de pagination ne passera pas à l'échelle.

Fichier: [persons-resources.ts](/abs/path/C:/dev/prj/TRAINING/FRONTEND/mock-api-angular-21/people-directory/src/app/features/persons/data/persons-resources.ts)

Pour chaque recherche, `_personsCountResource` recharge `/persons` avec `limit: 100000` puis prend `length`. Tant que le mock est petit ça passe, mais sur un vrai backend cela augmente la latence, la mémoire et le trafic pour une simple pagination. Il faut un endpoint de count ou un total renvoyé dans la réponse paginée.

## Verification

- `npm run build` passe.
- Warning relevé: bundle initial `525.97 kB` pour un budget configuré à `500 kB`.

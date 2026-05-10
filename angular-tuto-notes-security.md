# Notes Security Angular - People Directory

Ce document resume les notions de securite ajoutees pendant le tuto `People Directory`.

Chaque section contient:
- ce que tu as appris
- le code correspondant
- le point securite a retenir

## 1. Objectif De La Securite Frontend

Tu as appris que la securite frontend sert surtout a:
- guider l'utilisateur
- cacher ou desactiver les actions non autorisees
- eviter les appels API inutiles
- envoyer le token au backend

Mais le frontend ne remplace jamais la securite backend.

Point a retenir:

Un utilisateur peut modifier le JavaScript dans son navigateur.  
Le backend doit toujours verifier le token, les roles et les scopes.

## 2. Configuration OAuth

Tu as appris a configurer `angular-oauth2-oidc` avec un `AuthConfig`.

Fichier: `people-directory/src/app/core/security/security.service.ts`

```ts
private readonly authConfig = new AuthConfig({
  issuer: 'https://oauth-v5-mock-proxy.int.socialsecurity.be',
  strictDiscoveryDocumentValidation: false,
  redirectUri: 'http://localhost:4200',
  clientId: 'demo:oauth2:angular:authorizationcode',
  responseType: 'code',
  showDebugInformation: false,
  scope: this.SCOPES.join(' '),
  postLogoutRedirectUri: 'http://localhost:4200',
});
```

Point a retenir:

`showDebugInformation` doit rester a `false` pour eviter les logs sensibles.  
Les scopes demandes definissent les droits que l'application espere recevoir.

## 3. Providers OAuth Et Bearer Token

Tu as appris a ajouter automatiquement le Bearer token sur les appels API autorises.

Fichier: `people-directory/src/app/app.config.ts`

```ts
provideOAuthClient({
  resourceServer: {
    sendAccessToken: true,
    allowedUrls: ['https://69ca6329ba5984c44bf30fe2.mockapi.io/api/v1/'],
  },
}),
provideHttpClient(withInterceptorsFromDi()),
```

Point a retenir:

`sendAccessToken: true` active l'ajout du header:

```http
Authorization: Bearer <access_token>
```

`allowedUrls` limite les URLs qui recoivent le token.  
Le slash final sur `/api/v1/` evite de matcher une URL proche comme `/api/v10`.

## 4. Initialisation Au Demarrage

Tu as appris a lancer le login OAuth au bootstrap de l'application.

Fichier: `people-directory/src/app/app.config.ts`

```ts
provideAppInitializer(() => inject(SecurityService).login()),
```

Fichier: `people-directory/src/app/core/security/security.service.ts`

```ts
async login(): Promise<void> {
  const currentPath = window.location.pathname;

  await this.oauthService.loadDiscoveryDocumentAndTryLogin();

  this.syncUserFromToken();

  if (this.oauthService.hasValidAccessToken()) {
    const state = this.oauthService.state;

    if (state && state !== '/') {
      await this.router.navigateByUrl(decodeURIComponent(state));
    }

    return;
  }

  if (currentPath !== '/') {
    this.oauthService.initCodeFlow(currentPath);
    return new Promise(() => {});
  }
}
```

Point a retenir:

Au demarrage, l'application tente de recuperer une session existante.  
Si l'utilisateur arrive sur une route protegee sans token, elle lance le code flow OAuth.

## 5. Etat Utilisateur Avec Signals

Tu as appris a exposer l'utilisateur courant avec un signal readonly.

```ts
private readonly anonymousUser: AppUser = {
  connected: false,
  admin: false,
  locale: 'nl',
};

private readonly _user = signal<AppUser>(this.anonymousUser);
readonly user = this._user.asReadonly();
```

Point a retenir:

Le signal prive `_user` est modifiable uniquement par `SecurityService`.  
Le reste de l'application lit `user`, mais ne peut pas changer l'etat de securite.

## 6. Connexion Basee Sur Le Token Reel

Tu as appris a ne pas faire confiance uniquement au flag local `connected`.

```ts
readonly isConnected: Signal<boolean> = computed(
  () => this.user().connected && this.oauthService.hasValidAccessToken(),
);
```

Point a retenir:

`user().connected` peut devenir obsolete si le token expire.  
`hasValidAccessToken()` verifie l'etat OAuth reel.

La connexion frontend est donc vraie seulement si:
- l'utilisateur local est marque connecte
- le token OAuth est encore valide

## 7. Synchronisation Sur Les Events OAuth

Tu as appris a ecouter les evenements OAuth pour eviter un etat utilisateur obsolete.

```ts
private watchOAuthEvents(): void {
  this.oauthService.events
    .pipe(
      filter((event: OAuthEvent) =>
        [
          'token_received',
          'silently_refreshed',
          'token_refresh_error',
          'silent_refresh_error',
          'session_terminated',
          'session_error',
          'logout',
        ].includes(event.type),
      ),
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe((event) => {
      switch (event.type) {
        case 'token_received':
        case 'silently_refreshed':
          this.syncUserFromToken();
          break;

        default:
          this.resetUser();
          break;
      }
    });
}
```

Point a retenir:

Quand un token arrive ou est rafraichi, on reconstruit l'utilisateur.  
Quand le refresh echoue, que la session se termine ou que l'utilisateur logout, on reset l'utilisateur.

## 8. Reset Utilisateur

Tu as appris a centraliser le retour a l'etat anonyme.

```ts
private resetUser(): void {
  this._user.set({ ...this.anonymousUser });
}
```

Point a retenir:

On ne garde pas un ancien `admin: true` apres une expiration, un logout ou une erreur de session.  
Le spread cree un nouvel objet pour rendre la transition explicite.

## 9. Construction Du User Depuis Les Claims

Tu as appris a construire `AppUser` depuis les claims OAuth seulement apres validation de forme.

```ts
private buildUser(): AppUser {
  const user = new AppUser();
  const identityClaims: unknown = this.oauthService.getIdentityClaims();

  if (isIdentityClaims(identityClaims)) {
    user.firstname = identityClaims.given_name;
    user.lastname = identityClaims.family_name;
    user.ssin = toOptionalNumber(identityClaims.social_security_identification_number);
    user.bce = toOptionalNumber(identityClaims.enterprise_number);
    user.connected = true;
    user.admin = this.hasScope(ScopeEnum.SCOPE_EID);
    user.locale = this.retrieveLanguageFromUrl() || 'nl';
  }

  return user;
}
```

Point a retenir:

Les claims viennent d'une source externe.  
On les traite comme `unknown`, pas comme `any`.

## 10. Type Guard Des Claims

Tu as appris a remplacer `any` par `unknown` + type guard.

```ts
interface IdentityClaims {
  given_name?: string;
  family_name?: string;
  social_security_identification_number?: string | number;
  enterprise_number?: string | number;
}

function isIdentityClaims(value: unknown): value is IdentityClaims {
  return typeof value === 'object' && value !== null;
}
```

Point a retenir:

`unknown` oblige a verifier avant d'utiliser.  
Le type guard dit a TypeScript: dans ce bloc, cette valeur a la forme `IdentityClaims`.

## 11. Conversion Sure Des Nombres

Tu as appris a eviter `NaN` quand une claim numerique est absente ou invalide.

```ts
function toOptionalNumber(value: string | number | undefined): number | undefined {
  if (value === undefined || value === '') {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}
```

Point a retenir:

`+undefined` donne `NaN`.  
Une valeur de profil invalide doit devenir `undefined`, pas polluer l'etat utilisateur.

## 12. Verification Exacte Des Scopes

Tu as appris a eviter `toString().includes(...)` pour determiner le role admin.

```ts
private hasScope(scope: ScopeEnum): boolean {
  return this.getGrantedScopes().includes(scope);
}

private getGrantedScopes(): string[] {
  const grantedScopes: unknown = this.oauthService.getGrantedScopes();

  if (Array.isArray(grantedScopes)) {
    return grantedScopes.filter((scope): scope is string => typeof scope === 'string');
  }

  if (typeof grantedScopes === 'string') {
    return grantedScopes.split(' ').filter(Boolean);
  }

  return [];
}
```

Point a retenir:

`includes()` sur une string cherche une sous-chaine.  
`includes()` sur un tableau cherche une valeur exacte.

Le role admin doit etre base sur une appartenance exacte au scope attendu.

## 13. Guards De Connexion Et Admin

Tu as appris a proteger les routes avec des guards fonctionnels.

Fichier: `people-directory/src/app/app.routes.ts`

```ts
export function adminGuard() {
  const securityService = inject(SecurityService);
  const router = inject(Router);

  if (securityService.isConnected() && securityService.user().admin) {
    return true;
  }

  return router.parseUrl('/denied');
}

export function connectedGuard() {
  const securityService = inject(SecurityService);
  const router = inject(Router);

  if (securityService.isConnected()) {
    return true;
  }

  return router.parseUrl('/denied');
}
```

Point a retenir:

Un guard retourne:
- `true` pour autoriser
- un `UrlTree` pour rediriger proprement

Il vaut mieux retourner `router.parseUrl('/denied')` que declencher une navigation imperative avec `navigateByUrl()`.

## 14. Application Des Guards Aux Routes

Tu as appris a proteger les routes sensibles.

```ts
export const routes: Routes = [
  { path: '', redirectTo: 'persons', pathMatch: 'full' },
  {
    path: 'persons/new',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/persons/pages/person-create-page/person-create-page').then(
        (m) => m.PersonCreatePage,
      ),
  },
  {
    path: 'persons/:id',
    canActivate: [connectedGuard],
    loadComponent: () =>
      import('./features/persons/pages/person-detail-page/person-detail-page').then(
        (m) => m.PersonDetailPage,
      ),
  },
  {
    path: 'persons/:id/edit',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/persons/pages/person-edit-page/person-edit-page').then(
        (m) => m.PersonEditPage,
      ),
  },
  {
    path: 'profile',
    canActivate: [connectedGuard],
    loadComponent: () =>
      import('./features/profile/ui/profile/profile').then((m) => m.ProfileComponent),
  },
];
```

Point a retenir:

Desactiver un bouton ne protege pas une URL.  
Une route sensible doit avoir un guard.

## 15. Page Access Denied

Tu as appris a fournir une page dediee quand l'utilisateur n'a pas les droits.

```ts
{
  path: 'denied',
  component: AccessDeniedComponent,
  canActivate: [],
}
```

Point a retenir:

L'utilisateur ne doit pas tomber sur une erreur technique quand il n'a pas acces.  
La page `denied` explique la situation et propose une navigation de sortie.

## 16. Page Not Found

Tu as appris a ajouter une route wildcard pour les URLs inconnues.

```ts
{
  path: '**',
  component: NotFoundComponent,
  canActivate: [],
}
```

Point a retenir:

Une URL inconnue doit etre traitee explicitement.  
Cela evite un ecran vide ou un comportement ambigu.

## 17. Boutons Desactives Selon Les Droits

Tu as appris a rendre l'UI coherente avec les droits courants.

```html
<a
  mat-button
  [routerLink]="['/persons', person.id]"
  [attr.aria-label]="'Voir la fiche de ' + fullName(person)"
  [disabled]="!securityService.isConnected()"
>
  Voir
</a>

<a
  mat-button
  [routerLink]="['/persons', person.id, 'edit']"
  [attr.aria-label]="'Modifier la fiche de ' + fullName(person)"
  [disabled]="
    !securityService.isConnected() ||
    (securityService.isConnected() && !securityService.user().admin)
  "
>
  Modifier
</a>
```

Point a retenir:

L'UI doit eviter de proposer des actions impossibles.  
Mais la vraie protection reste le guard et le backend.

## 18. Garde Defensif Dans Les Mutations

Tu as appris a ajouter un check dans le handler d'action, en plus du bouton desactive.

```ts
protected deletePerson(person: Person): void {
  if (!this.securityService.isConnected() || !this.securityService.user().admin) return;

  if (this.isDeleting()) {
    return;
  }

  const dialogRef = this.dialog.open(DeletePersonDialog, {
    data: {
      firstName: person.firstName,
      lastName: person.lastName,
    },
  });

  dialogRef
    .afterClosed()
    .pipe(
      filter((confirmed) => confirmed === true),
      tap(() => this.isDeleting.set(true)),
      switchMap(() => this.personApi.delete(person.id)),
      finalize(() => this.isDeleting.set(false)),
    )
    .subscribe({
      next: () => {
        this.snackBar.open('Personne supprimee.', 'Fermer', {
          duration: 3000,
        });
      },
      error: () => {
        this.snackBar.open('Impossible de supprimer la personne.', 'Fermer', {
          duration: 3000,
        });
      },
    });
}
```

Point a retenir:

Un bouton desactive protege l'interface.  
Un garde dans la methode protege le flow frontend.  
Le backend protege vraiment la donnee.

## 19. Logout

Tu as appris a reset l'etat local avant de deleguer le logout a OAuth.

```ts
logout() {
  this.resetUser();
  this.oauthService.logOut();
}
```

Point a retenir:

L'interface doit repasser immediatement en mode anonyme.  
Ensuite, la librairie OAuth gere la fin de session cote fournisseur d'identite.

## 20. Pas De Logs Sensibles

Tu as appris a ne pas logger:
- claims OAuth
- NISS
- scopes
- tokens
- donnees d'identite

Code attendu:

```ts
showDebugInformation: false,
```

Et pas de:

```ts
console.log(identityClaims);
console.log(this.oauthService.getGrantedScopes());
console.log(user.ssin);
```

Point a retenir:

La console navigateur n'est pas un endroit sur pour les donnees sensibles.  
Les logs de debug doivent etre retires ou anonymises.

## 21. Limites De La Securite Frontend

Tu as appris a distinguer trois couches:

```text
UI
  Cache/desactive les actions selon les droits.

Router guards
  Bloque les routes directes dans l'application Angular.

Backend/API
  Verifie le Bearer token, les scopes, les roles et les droits metier.
```

Point a retenir:

La securite frontend ameliore l'experience et reduit les erreurs.  
La securite backend est obligatoire pour proteger les donnees.

## 22. Checklist Security

Checklist pratique pour la suite du projet:

- `showDebugInformation: false`
- aucun log de token, claims, NISS ou scopes
- `provideOAuthClient` configure avec `sendAccessToken: true`
- `allowedUrls` limite aux URLs API exactes
- `withInterceptorsFromDi()` present avec `provideHttpClient`
- `isConnected()` verifie aussi `hasValidAccessToken()`
- l'etat user est resynchronise sur les events OAuth
- les roles utilisent une verification exacte des scopes
- les claims OAuth sont lus comme `unknown`
- les routes sensibles ont `canActivate`
- les guards retournent un `UrlTree` en cas de refus
- les actions destructives ont un garde dans la methode
- le backend valide toujours le Bearer token

## 23. Synthese

Dans cette partie securite, tu as appris a relier Angular, OAuth et les routes de l'application.

Les points essentiels:
- un token valide est la base de la session
- le role admin vient d'un scope exact
- l'etat frontend doit suivre les events OAuth
- les routes protegent les URLs directes
- les boutons protegent l'experience utilisateur
- le backend reste l'autorite finale

Le bon reflexe a garder: ne jamais faire confiance a une seule couche.

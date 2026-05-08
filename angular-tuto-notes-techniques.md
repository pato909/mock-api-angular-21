# Notes Techniques Angular - People Directory

Ce document resume les notions Angular apprises pendant le tuto `People Directory`.

Chaque section contient:
- ce que tu as appris
- le code correspondant
- le point technique a retenir

## 1. Architecture Feature-First

Tu as appris a organiser une application Angular par domaine fonctionnel, plutot que par type technique uniquement.

Structure principale:

```text
src/app/
  app.config.ts
  app.routes.ts
  shared/
    date/
    ui/
    validators/
  features/
    persons/
      data/
      model/
      pages/
      ui/
```

Exemple dans le projet:

```text
features/persons/
  data/
    persons-api.service.ts
    persons-resources.ts
  model/
    person.model.ts
    person-query.model.ts
    person-form.model.ts
  pages/
    persons-list-page/
    person-detail-page/
    person-create-page/
    person-edit-page/
  ui/
    person-form/
    person-avatar/
    delete-person-dialog/
```

Point a retenir:

`pages` contient les composants routes qui orchestrent les flows.  
`ui` contient les composants reutilisables propres a la feature.  
`data` contient les acces API et les resources.  
`model` contient les types metier.

## 2. Bootstrap Angular Moderne

Tu as appris a configurer l'application avec des providers Angular modernes, sans NgModule.

Fichier: `people-directory/src/app/app.config.ts`

```ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideRouter(routes, withComponentInputBinding()),
  ],
};
```

Point a retenir:

Angular moderne configure l'application avec des fonctions `provide...()` au lieu d'un `AppModule`.

## 3. Routing Avec Lazy Loading

Tu as appris a declarer les routes avec `loadComponent()` pour charger les pages seulement quand elles sont visitees.

Fichier: `people-directory/src/app/app.routes.ts`

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'persons', pathMatch: 'full' },
  {
    path: 'persons',
    loadComponent: () =>
      import('./features/persons/pages/persons-list-page/persons-list-page').then(
        (m) => m.PersonsListPage,
      ),
  },
  {
    path: 'persons/new',
    loadComponent: () =>
      import('./features/persons/pages/person-create-page/person-create-page').then(
        (m) => m.PersonCreatePage,
      ),
  },
  {
    path: 'persons/:id',
    loadComponent: () =>
      import('./features/persons/pages/person-detail-page/person-detail-page').then(
        (m) => m.PersonDetailPage,
      ),
  },
  {
    path: 'persons/:id/edit',
    loadComponent: () =>
      import('./features/persons/pages/person-edit-page/person-edit-page').then(
        (m) => m.PersonEditPage,
      ),
  },
];
```

Point a retenir:

Avec `component`, la page est importee dans le bundle initial.  
Avec `loadComponent`, Angular cree des chunks lazy.  
Dans ce projet, le bundle initial est passe sous le budget grace a ce changement.

## 4. Route Params Vers Inputs

Tu as appris a recuperer un parametre de route directement dans un `input()` grace a `withComponentInputBinding()`.

Configuration:

```ts
provideRouter(routes, withComponentInputBinding())
```

Page detail:

```ts
export class PersonDetailPage {
  readonly id = input.required<string>();

  constructor() {
    effect(() => {
      this.personsResources.setPersonId(this.id());
    });
  }
}
```

Route:

```ts
{
  path: 'persons/:id',
  loadComponent: () =>
    import('./features/persons/pages/person-detail-page/person-detail-page').then(
      (m) => m.PersonDetailPage,
    ),
}
```

Point a retenir:

Le `:id` de la route peut alimenter directement un input du composant route.

## 5. Standalone Components

Tu as appris a creer des composants autonomes qui declarent eux-memes leurs imports.

Exemple:

```ts
@Component({
  selector: 'app-person-create-page',
  imports: [MatButtonModule, RouterLink, PersonForm],
  template: `
    <section class="page-section">
      ...
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonCreatePage {}
```

Point a retenir:

Dans Angular moderne, tu n'as plus besoin de declarer les composants dans un NgModule.  
Chaque composant importe ce dont son template a besoin.

## 6. Change Detection OnPush

Tu as appris a utiliser `ChangeDetectionStrategy.OnPush` pour rendre les composants plus predictibles et performants.

```ts
@Component({
  selector: 'app-persons-list-page',
  imports: [...],
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonsListPage {}
```

Point a retenir:

`OnPush` evite des checks inutiles.  
Il fonctionne tres bien avec les signals, les inputs et les resources.

## 7. Injection Avec `inject()`

Tu as appris a injecter des services sans constructeur.

```ts
export class PersonCreatePage {
  private readonly personService = inject(PersonsApiService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
}
```

Point a retenir:

`inject()` est plus direct et marche bien avec les composants standalone modernes.

## 8. Signals Pour Etat Local

Tu as appris a gerer de l'etat local avec `signal()`.

```ts
export class PersonCreatePage {
  readonly isSubmitting = signal(false);

  protected createPerson(payload: PersonFormPayload): void {
    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
  }
}
```

Autre exemple:

```ts
query = signal<PersonsListQuery>({
  search: '',
  sortBy: 'lastName',
  order: 'asc',
  page: 1,
  limit: 10,
});
```

Point a retenir:

Un signal se lit avec `signalName()`.  
Il se modifie avec `.set()` ou `.update()`.

## 9. Computed Signals

Tu as appris a creer une valeur derivee avec `computed()`.

```ts
rows = computed(() => this.persons.value() ?? []);

sortActive = computed(() => {
  return this.query().sortBy === 'lastName' ? 'name' : this.query().sortBy;
});
```

Dans `PersonAvatar`:

```ts
initials = computed(() => {
  const firstName = this.firstName().trim();
  const lastName = this.lastName().trim();

  if (!firstName && !lastName) return '?';

  const firstInitial = firstName ? firstName.charAt(0).toLocaleUpperCase() : '';
  const lastInitial = lastName ? lastName.charAt(0).toLocaleUpperCase() : '';

  return `${firstInitial}${lastInitial}`;
});
```

Point a retenir:

`computed()` sert a exprimer une donnee derivee, sans la recalculer manuellement partout.

## 10. Effects

Tu as appris a reagir automatiquement a un changement de signal avec `effect()`.

Exemple: mettre a jour l'id courant pour la resource detail.

```ts
constructor() {
  effect(() => {
    this.personsResources.setPersonId(this.id());
  });
}
```

Exemple: debounce de recherche.

```ts
constructor() {
  effect((onCleanup) => {
    const search = this.searchInput();

    const timer = globalThis.setTimeout(() => {
      if (search !== this.query().search) {
        this.query.update((current) => ({
          ...current,
          search,
          page: 1,
        }));
      }
    }, 300);

    onCleanup(() => {
      globalThis.clearTimeout(timer);
    });
  });
}
```

Point a retenir:

`effect()` est utile pour synchroniser un signal avec un effet externe: resource, timer, query, etc.

## 11. Types De Domaine

Tu as appris a typer les donnees venant de l'API.

```ts
export type Person = {
  id: string;
  created_at: string;
  updated_at: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  avatar: string;
};

export type PersonUpsertPayload = Pick<
  Person,
  'firstName' | 'lastName' | 'birthDate' | 'email' | 'phone' | 'avatar'
>;
```

Point a retenir:

Les types evitent de manipuler des objets implicites.  
Ils documentent le contrat entre l'UI et l'API.

## 12. Query State Type

Tu as appris a modeliser les parametres de recherche, tri et pagination.

```ts
export type PersonsListQuery = {
  search: string;
  sortBy: string;
  order: 'asc' | 'desc';
  page: number;
  limit: number;
};
```

Point a retenir:

Une query serveur est aussi un modele metier cote frontend.  
La typer rend les transitions plus claires.

## 13. `httpResource()` Pour Les Lectures

Tu as appris a utiliser `httpResource()` pour des lectures reactives.

```ts
readonly personsList: HttpResourceRef<Person[] | undefined> = httpResource<Person[]>(() => ({
  url: `${this.baseUrl}/persons`,
  params: {
    search: this._listQuery().search,
    sortBy: this._listQuery().sortBy,
    order: this._listQuery().order,
    page: this._listQuery().page,
    limit: this._listQuery().limit,
  },
}));
```

Detail:

```ts
readonly personDetail: HttpResourceRef<Person | undefined> = httpResource<Person>(() => {
  const id = this._personId();
  return id ? { url: `${this.baseUrl}/persons/${id}` } : undefined;
});
```

Point a retenir:

`httpResource()` est adapte aux lectures qui dependent d'un etat reactif.  
Quand `_listQuery` change, la resource peut relancer la lecture.

## 14. Refresh Des Resources

Tu as appris a exposer des methodes de reload apres mutation.

```ts
reloadPersonDetail(): void {
  this.personDetail.reload();
}

reloadPersons(): void {
  this.personsList.reload();
}

reloadPersonsCount(): void {
  this._personsCountResource.reload();
}
```

Point a retenir:

Apres un delete ou update, il faut synchroniser les read models.  
Le reload explicite rend ce comportement visible.

## 15. `HttpClient` Pour Les Mutations

Tu as appris a garder les mutations imperatives avec `HttpClient`.

```ts
@Injectable({
  providedIn: 'root',
})
export class PersonsApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = 'https://69ca6329ba5984c44bf30fe2.mockapi.io/api/v1';

  create(payload: PersonUpsertPayload): Observable<Person> {
    return this.httpClient.post<Person>(`${this.baseUrl}/persons`, payload);
  }

  update(id: string, payload: PersonUpsertPayload): Observable<Person> {
    return this.httpClient.put<Person>(`${this.baseUrl}/persons/${id}`, payload);
  }

  delete(id: string): Observable<Person> {
    return this.httpClient.delete<Person>(`${this.baseUrl}/persons/${id}`);
  }
}
```

Point a retenir:

Les mutations ont souvent un cycle imperatif: clic, loading, success, snackbar, navigation.  
`HttpClient` reste tres adapte a ce cas.

## 16. Table Material Avec Tri Et Pagination

Tu as appris a utiliser `MatTable`, `MatSort` et `MatPaginator`.

Template:

```html
<table
  mat-table
  [dataSource]="rows()"
  class="persons-table"
  aria-label="Liste des personnes"
  matSort
  [matSortActive]="sortActive()"
  [matSortDirection]="query().order"
  (matSortChange)="updateSort($event.active, $event.direction)"
>
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef mat-sort-header="name">Nom complet</th>
    <td mat-cell *matCellDef="let person">
      {{ person.firstName }} {{ person.lastName }}
    </td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
</table>

<mat-paginator
  [pageIndex]="query().page - 1"
  [pageSize]="query().limit"
  [pageSizeOptions]="[5, 10, 25, 50]"
  [length]="countResource()"
  aria-label="Pagination des personnes"
  (page)="updatePage($event.pageIndex, $event.pageSize)"
/>
```

Code:

```ts
updateSort(active: string, direction: 'asc' | 'desc' | '') {
  if (!active || !direction) {
    this.query.update((current) => ({
      ...current,
      sortBy: 'lastName',
      order: 'asc',
      page: 1,
    }));
    return;
  }

  this.query.update((current) => ({
    ...current,
    sortBy: active === 'name' ? 'lastName' : active,
    order: direction,
    page: 1,
  }));
}
```

Point a retenir:

Le composant table affiche.  
La query signal pilote le serveur.  
Le tri et la pagination modifient la query.

## 17. Recherche Serveur Avec Debounce

Tu as appris a separer la valeur tapee de la query envoyee au serveur.

```ts
searchInput = signal('');

updateSearch(search: string) {
  this.searchInput.set(search);
}
```

Debounce:

```ts
effect((onCleanup) => {
  const search = this.searchInput();

  const timer = globalThis.setTimeout(() => {
    if (search !== this.query().search) {
      this.query.update((current) => ({
        ...current,
        search,
        page: 1,
      }));
    }
  }, 300);

  onCleanup(() => {
    globalThis.clearTimeout(timer);
  });
});
```

Point a retenir:

On evite de faire une requete a chaque frappe immediate.  
Le debounce attend que l'utilisateur arrete de taper.

## 18. Reactive Forms

Tu as appris a creer un formulaire avec `FormGroup` et `FormControl`.

```ts
readonly form = new FormGroup({
  firstName: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(30)],
  }),
  lastName: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(30)],
  }),
  email: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(60), Validators.email],
  }),
  birthDate: new FormControl<Date | null>(null, {
    validators: [Validators.required, notFutureDateValidator],
  }),
});
```

Template:

```html
<form class="person-form" [formGroup]="form" novalidate (ngSubmit)="submit()">
  <mat-form-field appearance="outline">
    <mat-label>Email</mat-label>
    <input matInput formControlName="email" type="email" autocomplete="email" />

    @if (form.controls.email.hasError('required') && form.controls.email.touched) {
      <mat-error>L'email est obligatoire.</mat-error>
    }

    @if (form.controls.email.hasError('email') && form.controls.email.touched) {
      <mat-error>L'email n'est pas valide.</mat-error>
    }
  </mat-form-field>
</form>
```

Point a retenir:

Reactive Forms donne un modele de formulaire cote TypeScript.  
Le template se branche dessus avec `formControlName`.

## 19. Validators Custom

Tu as appris a ecrire des validateurs metier.

Date future:

```ts
export function notFutureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inputDate = new Date(control.value);

  if (inputDate > today) {
    return { futureDate: true };
  }

  return null;
}
```

URL avatar:

```ts
export function avatarUrlValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null;
  }

  const trimmedValue = String(value).trim();

  try {
    const url = new URL(trimmedValue);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return { invalidUrl: true };
    }

    return null;
  } catch {
    return { invalidUrl: true };
  }
}
```

Point a retenir:

Un validator retourne `null` si tout va bien.  
Il retourne un objet d'erreur si la valeur est invalide.

## 20. Normalisation Avant Submit

Tu as appris a nettoyer les donnees avant emission vers la page.

```ts
this.submitted.emit({
  firstName: this.form.controls.firstName.value.trim(),
  lastName: this.form.controls.lastName.value.trim(),
  phone: this.form.controls.phone.value.trim(),
  email: this.form.controls.email.value.trim(),
  birthDate: formatDateOnly(this.form.controls.birthDate.value),
  avatar: this.form.controls.avatar.value.trim(),
});
```

Point a retenir:

Le formulaire est une bonne frontiere pour normaliser les donnees utilisateur.

## 21. Composant Formulaire Reutilisable

Tu as appris a reutiliser le meme `PersonForm` pour create et edit.

Inputs et output:

```ts
export class PersonForm {
  readonly submitted = output<PersonFormPayload>();
  readonly isSubmitting = input.required<boolean>();
  readonly person = input<Person | undefined>(undefined);
}
```

Create:

```html
<app-person-form
  (submitted)="createPerson($event)"
  [isSubmitting]="isSubmitting()"
/>
```

Edit:

```html
<app-person-form
  (submitted)="updatePerson(this.id(), $event)"
  [isSubmitting]="isSubmitting()"
  [person]="person.value()"
/>
```

Point a retenir:

Un composant UI reutilisable recoit les donnees via inputs et remonte les actions via outputs.

## 22. Prefill En Mode Edit

Tu as appris a pre-remplir un formulaire a partir d'une personne existante.

```ts
constructor() {
  effect(() => {
    const person = this.person();

    if (!person) {
      return;
    }

    if (person.id === this.initializedPersonId) {
      return;
    }

    this.initializedPersonId = person.id;

    this.form.reset({
      firstName: person.firstName,
      lastName: person.lastName,
      phone: person.phone,
      email: person.email,
      birthDate: person.birthDate ? new Date(person.birthDate) : null,
      avatar: person.avatar,
    });
  });
}
```

Point a retenir:

Le formulaire se remplit quand l'input `person` arrive.  
On evite de reset plusieurs fois le meme formulaire avec `initializedPersonId`.

## 23. Gestion Submit + Snackbar + Navigation

Tu as appris a gerer un flow de creation complet.

```ts
protected createPerson(payload: PersonFormPayload): void {
  if (this.isSubmitting()) {
    return;
  }

  this.isSubmitting.set(true);
  this.personService.create(payload).subscribe({
    next: (person) => {
      this.isSubmitting.set(false);
      this.snackBar.open('Personne creee.', 'Fermer', {
        duration: 3000,
      });

      void this.router.navigate(['/persons', person.id]);
    },
    error: () => {
      this.isSubmitting.set(false);
      this.snackBar.open('Impossible de creer la personne.', 'Fermer', {
        duration: 3000,
      });
    },
  });
}
```

Point a retenir:

Un submit robuste gere:
- garde anti double-submit
- loading
- success feedback
- error feedback
- navigation

## 24. Delete Avec Confirmation Dialog

Tu as appris a ouvrir un `MatDialog` avant une action destructive.

```ts
protected deletePerson(person: Person): void {
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

Une action destructive doit demander confirmation.  
Le pipe RxJS permet d'enchainer confirmation puis requete API.

## 25. Dialog Accessible

Tu as appris a rendre une confirmation de suppression plus accessible.

```ts
@Component({
  selector: 'app-delete-person-dialog',
  imports: [MatDialogModule, MatButtonModule, A11yModule],
  template: `
    <h2 mat-dialog-title>Supprimer cette personne ?</h2>

    <mat-dialog-content id="delete-person-dialog-description">
      Cette action supprimera definitivement {{ fullName(data) }}.
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" cdkFocusInitial (click)="cancel()">Annuler</button>

      <button
        mat-flat-button
        color="warn"
        type="button"
        [attr.aria-describedby]="'delete-person-dialog-description'"
        (click)="confirm()"
      >
        Supprimer
      </button>
    </mat-dialog-actions>
  `,
})
export class DeletePersonDialog {}
```

Point a retenir:

On focus d'abord l'action la moins dangereuse.  
L'action destructive est decrite explicitement.

## 26. Avatar Avec Fallback

Tu as appris a gerer une image externe qui peut casser.

```html
<span class="person-avatar" [class.person-avatar--detail]="variant() === 'detail'">
  @if (!imageFailed()) {
    <img
      class="person-avatar__image"
      [src]="avatar()"
      [alt]="accessibleLabel()"
      (error)="markImageAsFailed()"
    />
  } @else {
    <span class="person-avatar__fallback" role="img" [attr.aria-label]="accessibleLabel()">
      {{ initials() }}
    </span>
  }
</span>
```

Code:

```ts
private readonly failedAvatarUrl = signal<string | null>(null);

readonly imageFailed = computed(() => this.failedAvatarUrl() === this.avatar());

markImageAsFailed(): void {
  this.failedAvatarUrl.set(this.avatar());
}
```

Point a retenir:

Une URL externe n'est jamais garantie.  
Le composant doit rester lisible meme si l'image echoue.

## 27. Loading, Empty Et Error States

Tu as appris a creer des composants d'etat reutilisables.

Usage:

```html
@if (persons.isLoading()) {
  <app-loading-state
    title="Chargement des personnes"
    message="Les donnees de l'annuaire sont en cours de chargement."
  />
} @else if (persons.error()) {
  <app-error-state
    kicker="Erreur"
    title="Le chargement de l'annuaire a echoue"
    message="Reessayez pour recuperer la liste des personnes avec les filtres actuels."
    actionLabel="Reessayer"
    (retry)="retryPersonsList()"
  />
} @else if (rows().length === 0) {
  <app-empty-state
    kicker="Aucun resultat"
    title="Aucune personne ne correspond a votre recherche"
  />
}
```

Point a retenir:

Les etats non-happy-path font partie du produit.  
Il faut les rendre coherents et reutilisables.

## 28. Not Found Distinct De Error

Tu as appris a traiter le 404 comme un etat metier distinct.

```html
@if (person.isLoading()) {
  <app-loading-state />
} @else if (isNotFound()) {
  <app-empty-state
    kicker="Introuvable"
    title="Personne introuvable"
    message="Cette fiche n'existe plus ou l'identifiant ne correspond a aucune personne."
    actionLabel="Retour a l'annuaire"
    (action)="goToPersonsList()"
  />
} @else if (person.error()) {
  <app-error-state />
}
```

Code:

```ts
protected readonly isNotFound = () => this.person.statusCode() === 404;
```

Point a retenir:

Un 404 n'est pas toujours une erreur technique.  
Pour l'utilisateur, c'est souvent un etat "introuvable".

## 29. Accessibilite: Liens Vs Boutons

Tu as appris a choisir la bonne semantique.

Navigation:

```html
<a mat-button routerLink="/persons">Directory</a>
<a mat-flat-button routerLink="/persons/new">New person</a>
```

Action:

```html
<button
  mat-button
  type="button"
  [disabled]="isDeleting(person.id)"
  [attr.aria-label]="'Supprimer la fiche de ' + fullName(person)"
  (click)="deletePerson(person)"
>
  Supprimer
</button>
```

Point a retenir:

Un lien change de page.  
Un bouton declenche une action.

## 30. Accessibilite: Skip Link

Tu as appris a ajouter un lien d'evitement pour les utilisateurs clavier.

```html
<a class="skip-link" href="#main-content">Aller au contenu principal</a>

<section id="main-content" class="app-content" tabindex="-1">
  <router-outlet />
</section>
```

CSS:

```scss
.skip-link {
  position: fixed;
  top: var(--space-3);
  left: var(--space-3);
  z-index: 20;
  transform: translateY(calc(-100% - var(--space-3)));
}

.skip-link:focus-visible {
  transform: translateY(0);
}
```

Point a retenir:

Un skip link permet d'eviter de retabuler toute la navigation a chaque page.

## 31. Accessibilite: Focus Visible

Tu as appris a rendre le focus clavier vraiment visible.

```scss
button,
a,
textarea,
select,
[tabindex] {
  &:focus-visible {
    outline: 3px solid color-mix(in srgb, var(--mat-sys-primary) 72%, black);
    outline-offset: 3px;
    box-shadow: var(--app-focus-ring);
    border-radius: var(--radius-sm);
  }
}

.mat-mdc-button-base:focus-visible,
.mat-mdc-icon-button:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--mat-sys-primary) 72%, black);
  outline-offset: 3px;
}
```

Point a retenir:

Le focus visible est indispensable pour les utilisateurs clavier.

## 32. Accessibilite: Validation Formulaire

Tu as appris a annoncer les erreurs de formulaire et a remettre le focus au bon endroit.

Template:

```html
@if (showValidationSummary()) {
  <p class="person-form__validation-summary" role="alert">
    Verifiez les champs signales avant d'enregistrer la personne.
  </p>
}
```

Code:

```ts
if (this.form.invalid) {
  this.form.markAllAsTouched();
  this.showValidationSummary.set(true);
  queueMicrotask(() => this.focusFirstInvalidControl());
  return;
}
```

Focus:

```ts
private focusFirstInvalidControl(): void {
  const firstInvalidControl = this.host.nativeElement.querySelector<HTMLElement>(
    '.ng-invalid[formControlName]',
  );

  firstInvalidControl?.focus();
}
```

Point a retenir:

Un formulaire invalide doit expliquer le probleme et aider l'utilisateur a le corriger.

## 33. Date Adapter Custom

Tu as appris a adapter le parsing des dates au format europeen.

```ts
export class AppDateAdapter extends NativeDateAdapter {
  override parse(value: unknown): Date | null {
    if (typeof value !== 'string') {
      return super.parse(value);
    }

    const dateValue = value.trim();

    const europeanDate = dateValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

    if (europeanDate) {
      return createValidDate(
        Number(europeanDate[3]),
        Number(europeanDate[2]),
        Number(europeanDate[1]),
      );
    }

    return super.parse(value);
  }
}
```

Point a retenir:

Le datepicker Material peut etre adapte a un format local comme `dd/MM/yyyy`.

## 34. Angular Material Theme Et Tokens CSS

Tu as appris a centraliser le theme et les variables visuelles.

```scss
@use '@angular/material' as mat;

html {
  color-scheme: light;

  @include mat.theme(
    (
      color: (
        theme-type: light,
        primary: mat.$cyan-palette,
        tertiary: mat.$orange-palette,
      ),
      typography: Roboto,
      density: 0,
    )
  );
}
```

Tokens:

```scss
:root {
  --app-content-width: 1200px;
  --space-4: 1rem;
  --radius-md: 1.25rem;
  --app-surface: color-mix(in srgb, var(--mat-sys-surface) 88%, white);
  --app-border: color-mix(in srgb, var(--mat-sys-outline-variant) 72%, white);
  --app-focus-ring: 0 0 0 3px color-mix(in srgb, var(--mat-sys-primary) 30%, white);
}
```

Point a retenir:

Les tokens CSS evitent les valeurs magiques repetees partout.

## 35. Tests Unitaires Du Shell

Tu as appris a tester que l'application se cree et affiche le shell.

```ts
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
```

Point a retenir:

Si un template utilise `routerLink`, le test doit fournir le router.

## 36. Build, Budget Et Lazy Chunks

Tu as appris a lire un build Angular.

Avant lazy loading:

```text
Initial total: 897.15 kB
Warning: initial bundle exceeded maximum budget 500 kB
```

Apres lazy loading:

```text
Initial total: 432.76 kB
Lazy chunk files:
- persons-list-page
- person-detail-page
- person-edit-page
- person-create-page
```

Point a retenir:

Le lazy loading n'est pas seulement une convention.  
Il a un impact direct sur le bundle initial.

## 37. Checklist De Validation

Tu as appris a verifier une feature avant PR.

Commandes:

```bash
npm test -- --watch=false
npm run build
git diff --check
```

Prettier:

```bash
npx prettier --check "src/**/*.{ts,html,scss}"
```

Point a retenir:

Une feature Angular propre doit compiler, tester, respecter le formatage et ne pas introduire de whitespace problematique.

## 38. Workflow GitHub Feature

Tu as appris un flow de livraison pro.

```bash
git switch -c codex/f11-accessibility-interactions
git add <fichiers de la feature>
git commit -m "F11: improve accessibility interactions"
git push -u origin codex/f11-accessibility-interactions
```

Puis:
- creation de PR
- commentaire sur l'issue
- closeout Markdown
- validation documentee

Point a retenir:

Le code ne suffit pas.  
Une feature livree doit aussi etre documentee, reliee a une issue et reviewable.

## 39. Regles Angular Que Tu As Pratiquees

Checklist des bonnes pratiques vues dans ce tuto:

- utiliser des composants standalone
- utiliser `OnPush`
- utiliser `inject()`
- utiliser `input()` et `output()`
- utiliser `signal()`, `computed()` et `effect()`
- utiliser `httpResource()` pour les lectures
- utiliser `HttpClient` pour les mutations
- preferer Reactive Forms
- isoler les composants UI reutilisables
- traiter loading, empty, error et not-found
- choisir lien ou bouton selon la semantique
- rendre le focus visible
- lazy-loader les pages
- verifier tests et build avant PR

## 40. Guidelines De Developpement Appliquees

Ces guidelines sont les regles de travail que tu as donnees ou validees pendant le tuto. Elles servent de checklist pour continuer a coder dans le meme style.

### Angular moderne

- Utiliser les APIs standalone.
- Ne pas introduire de NgModule pour les nouvelles features.
- Ne pas ajouter `standalone: true` dans les decorators, car Angular moderne le considere comme le comportement par defaut.
- Utiliser `inject()` au lieu de l'injection par constructeur.
- Ajouter `ChangeDetectionStrategy.OnPush` sur les composants.
- Utiliser `input()` et `output()` au lieu de `@Input()` et `@Output()`.
- Utiliser `signal()`, `computed()` et `effect()` pour l'etat local et les valeurs derivees.

Exemple:

```ts
@Component({
  selector: 'app-person-create-page',
  imports: [MatButtonModule, RouterLink, PersonForm],
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonCreatePage {
  private readonly personService = inject(PersonsApiService);
  readonly isSubmitting = signal(false);
}
```

### Routing

- Declarer les routes avec `provideRouter`.
- Utiliser `withComponentInputBinding()` pour binder les params de route sur des inputs.
- Lazy-loader les pages avec `loadComponent`.
- Eviter les imports statiques de pages dans `app.routes.ts` quand une route boundary permet le lazy loading.

Exemple:

```ts
{
  path: 'persons/:id',
  loadComponent: () =>
    import('./features/persons/pages/person-detail-page/person-detail-page').then(
      (m) => m.PersonDetailPage,
    ),
}
```

### Architecture

- Garder une structure feature-first.
- Mettre les composants route dans `pages`.
- Mettre les composants reutilisables de feature dans `ui`.
- Mettre les appels API et resources dans `data`.
- Mettre les types et contrats dans `model`.
- Ne pas creer d'abstraction tant qu'elle ne retire pas une vraie complexite.
- Garder les pages comme orchestrateurs et les composants UI comme composants de presentation.

Exemple:

```text
features/persons/
  data/
  model/
  pages/
  ui/
```

### Data access

- Utiliser `httpResource()` pour les lectures declaratives.
- Utiliser `HttpClient` pour les mutations imperatives.
- Exposer des methodes de reload explicites apres mutation.
- Ne pas melanger lecture reactive et mutation imperative dans le meme flow sans raison claire.

Exemple:

```ts
readonly personDetail = httpResource<Person>(() => {
  const id = this._personId();
  return id ? { url: `${this.baseUrl}/persons/${id}` } : undefined;
});

delete(id: string): Observable<Person> {
  return this.httpClient.delete<Person>(`${this.baseUrl}/persons/${id}`);
}
```

### Forms

- Preferer Reactive Forms.
- Garder les regles de validation dans le composant formulaire ou dans des validators partages.
- Normaliser les valeurs avant submit.
- Desactiver uniquement pendant une mutation en cours, pas juste parce que le formulaire est invalide.
- En cas de formulaire invalide, afficher les erreurs et aider l'utilisateur a corriger.

Exemple:

```ts
if (this.form.invalid) {
  this.form.markAllAsTouched();
  this.showValidationSummary.set(true);
  queueMicrotask(() => this.focusFirstInvalidControl());
  return;
}
```

### Templates

- Utiliser le control flow moderne `@if`, `@for`, `@switch`.
- Eviter `*ngIf`, `*ngFor`, `*ngSwitch` dans le nouveau code.
- Eviter `ngClass` et `ngStyle`; preferer les bindings explicites.
- Garder la logique complexe cote TypeScript, pas dans le template.
- Ne pas supposer que des globals comme `new Date()` sont disponibles dans le template.

Exemple:

```html
@if (person.isLoading()) {
  <app-loading-state />
} @else if (isNotFound()) {
  <app-empty-state />
} @else if (person.error()) {
  <app-error-state />
}
```

### Accessibilite

- Viser WCAG AA pour le scope V1.
- Preferer la bonne semantique native avant d'ajouter de l'ARIA.
- Utiliser un lien pour naviguer.
- Utiliser un bouton pour declencher une action.
- Garder le focus visible.
- Ajouter un skip link vers le contenu principal.
- Donner des noms accessibles aux actions quand le contexte visuel ne suffit pas.
- Associer les erreurs de formulaire aux controles et annoncer les erreurs globales si necessaire.
- Dans une action destructive, focusser l'action la moins dangereuse par defaut.

Exemple:

```html
<a mat-flat-button [routerLink]="['/persons', p.id, 'edit']">
  Modifier
</a>

<button mat-flat-button type="button" (click)="deletePerson(p)">
  Supprimer
</button>
```

### UI et design system

- Utiliser Angular Material comme base UI.
- Centraliser les couleurs, espacements, rayons et focus states dans les tokens CSS.
- Reutiliser les composants shared pour loading, empty et error states.
- Garder les composants petits et specialises.
- Eviter les styles ad hoc disperses quand un token ou composant partage existe.

Exemple:

```scss
:root {
  --space-4: 1rem;
  --radius-md: 1.25rem;
  --app-border: color-mix(in srgb, var(--mat-sys-outline-variant) 72%, white);
}
```

### Performance

- Surveiller le bundle initial.
- Utiliser le lazy loading aux boundaries de route.
- Garder `OnPush` sur les composants.
- Eviter les recalculs manuels quand `computed()` suffit.
- Lire les warnings Angular comme des signaux a traiter, pas comme du bruit.

Exemple de validation:

```bash
npm run build
```

### Qualite et livraison

- Verifier les changements avant commit.
- Stager uniquement les fichiers de la feature.
- Ecrire un commit scope par feature.
- Creer un closeout Markdown pour documenter ce qui a ete livre.
- Lier la PR a l'issue GitHub.
- Garder les validations dans la PR et dans le closeout.

Commandes:

```bash
npm test -- --watch=false
npm run build
git diff --check
```

Point a retenir:

Ces guidelines forment ton cadre de travail Angular pour ce projet.  
Elles t'aident a garder le code moderne, lisible, accessible et reviewable.

## 41. Synthese

Dans ce tuto, tu n'as pas seulement appris Angular "syntaxe par syntaxe".

Tu as appris a construire une petite application Angular moderne comme un vrai produit:

- architecture claire
- routing propre
- data access type
- CRUD complet
- UI Material
- formulaires robustes
- accessibilite
- performance
- tests
- workflow GitHub

Le plus important a garder: chaque choix technique doit servir un flow utilisateur clair.

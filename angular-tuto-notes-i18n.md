# Notes Internationalisation Angular - People Directory

Ce document resume la mise en place de la traduction francais / anglais dans le projet `People Directory` avec `ngx-translate`.

Chaque section contient:
- ce que tu as appris
- le code correspondant
- le point technique a retenir

## 1. Objectif

Tu as appris a remplacer les textes codes en dur dans l'application par des cles de traduction.

Avant:

```html
<a mat-button routerLink="/persons">Directory</a>
```

Apres:

```html
<a mat-button routerLink="/persons">{{ 'app.nav.directory' | translate }}</a>
```

Point a retenir:

Le template ne contient plus le texte final.  
Il contient une cle stable, et `ngx-translate` choisit le texte selon la langue active.

## 2. Packages Installes

Tu as installe les deux dependances principales:

```bash
npm install @ngx-translate/core @ngx-translate/http-loader
```

Dans `people-directory/package.json`:

```json
"@ngx-translate/core": "^17.0.0",
"@ngx-translate/http-loader": "^17.0.0"
```

Point a retenir:

`@ngx-translate/core` fournit `TranslateService`, `TranslatePipe` et les APIs principales.  
`@ngx-translate/http-loader` permet de charger les fichiers JSON de traduction.

## 3. Fichiers De Traduction

Tu as cree deux fichiers dans `public/i18n`.

Structure:

```text
people-directory/
  public/
    i18n/
      fr.json
      en.json
```

Ces fichiers sont servis publiquement par Angular.

Donc:

```text
public/i18n/fr.json
```

est accessible dans le navigateur via:

```text
http://localhost:4200/i18n/fr.json
```

Point a retenir:

Avec un dossier `public`, le chemin HTTP commence a la racine de l'application.  
Le loader doit donc pointer vers `/i18n/` ou `./i18n/`.

## 4. Exemple De Dictionnaire

Fichier: `people-directory/public/i18n/fr.json`

```json
{
  "app": {
    "title": "Annuaire des personnes",
    "tagline": "Bases Material pour un espace CRUD clair",
    "nav": {
      "directory": "Annuaire",
      "newPerson": "Nouvelle personne",
      "login": "Connexion",
      "profile": "Profil",
      "logout": "Deconnexion"
    }
  },
  "common": {
    "save": "Enregistrer",
    "cancel": "Annuler",
    "delete": "Supprimer",
    "edit": "Modifier",
    "retry": "Reessayer",
    "close": "Fermer"
  }
}
```

Fichier: `people-directory/public/i18n/en.json`

```json
{
  "app": {
    "title": "People directory",
    "tagline": "Material foundations for a clear CRUD workspace",
    "nav": {
      "directory": "Directory",
      "newPerson": "New person",
      "login": "Login",
      "profile": "Profile",
      "logout": "Logout"
    }
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "retry": "Retry",
    "close": "Close"
  }
}
```

Point a retenir:

Les cles sont organisees par domaine:
- `app` pour le shell global
- `common` pour les textes reutilisables
- `persons` pour la feature personnes
- `profile` pour la page profil
- `state` pour loading, empty et error states

## 5. Configuration Angular

Fichier: `people-directory/src/app/app.config.ts`

Avec `ngx-translate` version recente, tu peux configurer le loader avec `provideTranslateHttpLoader`.

```ts
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideTranslateService({
      fallbackLang: 'fr',
      loader: provideTranslateHttpLoader({
        useHttpBackend: true,
        prefix: './i18n/',
        suffix: '.json',
      }),
    }),
  ],
};
```

Point a retenir:

`prefix: './i18n/'` et `suffix: '.json'` signifient:

```text
fr -> ./i18n/fr.json
en -> ./i18n/en.json
```

`useHttpBackend: true` permet de charger les fichiers de traduction sans passer par les interceptors HTTP applicatifs.

## 6. Service De Langue

Tu as cree un service dedie pour centraliser la logique de langue.

Fichier: `people-directory/src/app/core/language/language.service.ts`

```ts
import { computed, inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

type SupportedLanguage = 'fr' | 'en';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translate = inject(TranslateService);

  private readonly supportedLanguages: SupportedLanguage[] = ['fr', 'en'];
  private readonly defaultLanguage: SupportedLanguage = 'fr';
  private readonly storageKey = 'language';
  private readonly currentLanguage = signal<SupportedLanguage>(this.defaultLanguage);

  readonly activeLanguage = computed(() => this.currentLanguage());

  init(): void {
    this.translate.addLangs(this.supportedLanguages);
    this.translate.setDefaultLang(this.defaultLanguage);

    const language = this.resolveInitialLanguage();

    this.currentLanguage.set(language);
    this.translate.use(language);
  }

  use(language: SupportedLanguage): void {
    localStorage.setItem(this.storageKey, language);
    this.currentLanguage.set(language);
    this.translate.use(language);
  }

  private resolveInitialLanguage(): SupportedLanguage {
    const savedLanguage = localStorage.getItem(this.storageKey);

    if (this.isSupportedLanguage(savedLanguage)) {
      return savedLanguage;
    }

    return this.defaultLanguage;
  }

  private isSupportedLanguage(
    language: string | null | undefined,
  ): language is SupportedLanguage {
    return language === 'fr' || language === 'en';
  }
}
```

Point a retenir:

Le service fait quatre choses:
- declarer les langues supportees
- choisir la langue initiale
- memoriser la langue dans `localStorage`
- exposer la langue active avec un signal

## 7. Initialisation Au Demarrage

Dans le composant racine, tu initialises le service.

Fichier: `people-directory/src/app/app.ts`

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LanguageService } from './core/language/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly languageService = inject(LanguageService);

  constructor() {
    this.languageService.init();
  }
}
```

Point a retenir:

`TranslatePipe` peut etre present dans les templates, mais il faut aussi activer une langue avec:

```ts
this.translate.use('fr');
```

Dans ce projet, cette activation est cachee proprement dans `LanguageService.init()`.

## 8. Utiliser Une Cle Dans Un Template

Pour traduire un texte dans un composant standalone, il faut importer `TranslatePipe`.

```ts
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-example',
  imports: [TranslatePipe],
  template: `
    <h1>{{ 'app.title' | translate }}</h1>
  `,
})
export class ExampleComponent {}
```

Point a retenir:

Dans un composant standalone, le pipe doit etre dans `imports`.  
Sinon Angular ne connait pas `| translate` dans ce template.

## 9. Traduire Le Shell Global

Fichier: `people-directory/src/app/app.html`

```html
<a class="skip-link" href="#main-content">{{ 'app.skipToMain' | translate }}</a>

<span class="app-name">{{ 'app.title' | translate }}</span>
<span class="app-tagline">{{ 'app.tagline' | translate }}</span>

<a mat-button routerLink="/persons">{{ 'app.nav.directory' | translate }}</a>
<a mat-flat-button routerLink="/persons/new">{{ 'app.nav.newPerson' | translate }}</a>
```

Point a retenir:

Les labels de navigation doivent aussi etre traduits.  
Un shell partiellement traduit donne vite une impression d'application non terminee.

## 10. Traduire Les Attributs Accessibles

Les attributs comme `aria-label` se traduisent avec un property binding.

```html
<table
  mat-table
  [dataSource]="rows()"
  [attr.aria-label]="'persons.list.tableLabel' | translate"
>
</table>
```

Autre exemple:

```html
<button
  mat-icon-button
  type="button"
  [attr.aria-label]="'persons.list.clearSearch' | translate"
>
  <mat-icon>close</mat-icon>
</button>
```

Point a retenir:

Ne traduis pas seulement le texte visible.  
Les libelles accessibles font aussi partie de l'internationalisation.

## 11. Traduire Avec Parametres

Certaines traductions contiennent des valeurs dynamiques.

Dans `fr.json`:

```json
{
  "persons": {
    "list": {
      "personIdentifier": "Identifiant : {{ id }}",
      "viewPerson": "Voir la fiche de {{ name }}"
    }
  }
}
```

Dans `en.json`:

```json
{
  "persons": {
    "list": {
      "personIdentifier": "Identifier: {{ id }}",
      "viewPerson": "View {{ name }}'s record"
    }
  }
}
```

Dans le template:

```html
<span>
  {{ 'persons.list.personIdentifier' | translate: { id: person.id } }}
</span>

<a [attr.aria-label]="'persons.list.viewPerson' | translate: { name: fullName(person) }">
  {{ 'common.view' | translate }}
</a>
```

Point a retenir:

Evite de construire des phrases traduites avec de la concatenation.

Mauvais:

```html
[attr.aria-label]="'Voir la fiche de ' + fullName(person)"
```

Meilleur:

```html
[attr.aria-label]="'persons.list.viewPerson' | translate: { name: fullName(person) }"
```

## 12. Traduire Les Composants D'Etat

Les composants `LoadingState`, `EmptyState` et `ErrorState` recoivent maintenant des cles.

Usage:

```html
<app-loading-state
  title="persons.list.loadingTitle"
  message="persons.list.loadingMessage"
/>

<app-error-state
  kicker="common.error"
  title="persons.list.loadErrorTitle"
  message="persons.list.loadErrorMessage"
  actionLabel="common.retry"
  (retry)="retryPersonsList()"
/>
```

Dans le composant shared:

```html
<span class="state-kicker">{{ kicker() | translate }}</span>

<div class="state-copy">
  <h3>{{ title() | translate }}</h3>
  <p>{{ message() | translate }}</p>
</div>

@if (actionLabel()) {
  <button mat-stroked-button type="button" (click)="retry.emit()">
    {{ actionLabel() | translate }}
  </button>
}
```

Point a retenir:

Un composant shared peut accepter des cles de traduction en input.  
Cela evite de lui passer du texte deja traduit depuis chaque page.

## 13. Traduire Les Formulaires

Dans `PersonForm`, les labels et erreurs de validation utilisent `TranslatePipe`.

```html
<mat-form-field appearance="outline" class="person-form__field">
  <mat-label>{{ 'common.firstName' | translate }}</mat-label>
  <input matInput formControlName="firstName" autocomplete="given-name" />

  @if (form.controls.firstName.hasError('required') && form.controls.firstName.touched) {
    <mat-error>{{ 'persons.form.firstNameRequired' | translate }}</mat-error>
  }

  @if (form.controls.firstName.hasError('maxlength') && form.controls.firstName.touched) {
    <mat-error>{{ 'persons.form.firstNameMaxLength' | translate }}</mat-error>
  }
</mat-form-field>
```

Bouton de submit:

```html
<button mat-flat-button type="submit" [disabled]="isSubmitting()">
  {{
    (isSubmitting()
      ? 'persons.form.saving'
      : isEditMode()
        ? 'persons.form.editSubmit'
        : 'persons.form.createSubmit'
    ) | translate
  }}
</button>
```

Point a retenir:

Les erreurs de formulaire sont des labels utilisateur.  
Elles doivent etre traduites comme les titres et boutons.

## 14. Traduire Les Snackbars

Les snackbars sont ouvertes depuis TypeScript, donc on utilise `TranslateService`.

```ts
import { TranslateService } from '@ngx-translate/core';

export class PersonCreatePage {
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  protected createPerson(payload: PersonFormPayload): void {
    this.personService.create(payload).subscribe({
      next: () => {
        this.snackBar.open(
          this.translate.instant('persons.snackbar.created'),
          this.translate.instant('common.close'),
          { duration: 3000 },
        );
      },
      error: () => {
        this.snackBar.open(
          this.translate.instant('persons.snackbar.createError'),
          this.translate.instant('common.close'),
          { duration: 3000 },
        );
      },
    });
  }
}
```

Point a retenir:

Dans un template, utilise `| translate`.  
Dans TypeScript, utilise `TranslateService`.

Pour un message instantane comme une snackbar, `instant()` est simple et adapte si la langue est deja chargee.

## 15. Language Switcher

Tu as cree un composant dedie pour changer la langue.

Fichier: `people-directory/src/app/shared/language-switcher/language-switcher-component.ts`

```ts
import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../core/language/language.service';

@Component({
  selector: 'app-language-switcher',
  imports: [TranslatePipe],
  template: `
    <div class="language-switcher" [attr.aria-label]="'language.selection' | translate">
      <button
        type="button"
        class="language-switcher__link"
        [class.language-switcher__link--active]="activeLanguage() === 'fr'"
        [disabled]="activeLanguage() === 'fr'"
        (click)="useLanguage('fr')"
      >
        FR
      </button>

      <span class="language-switcher__separator" aria-hidden="true">·</span>

      <button
        type="button"
        class="language-switcher__link"
        [class.language-switcher__link--active]="activeLanguage() === 'en'"
        [disabled]="activeLanguage() === 'en'"
        (click)="useLanguage('en')"
      >
        EN
      </button>
    </div>
  `,
})
export class LanguageSwitcherComponent {
  private readonly languageService = inject(LanguageService);
  readonly activeLanguage = this.languageService.activeLanguage;

  useLanguage(language: 'fr' | 'en'): void {
    this.languageService.use(language);
  }
}
```

Point a retenir:

Changer de langue est une action, donc les boutons sont semantiquement corrects.  
Ils peuvent quand meme etre styles comme des liens.

## 16. Style Du Switcher

Tu as choisi une variante minimaliste:

```text
FR · EN
```

Style:

```scss
.language-switcher {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  line-height: 1;
}

.language-switcher__link {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--mat-sys-primary);
  cursor: pointer;
  font: inherit;
  font-weight: 500;
  letter-spacing: 0;
  text-decoration: none;
}

.language-switcher__link:hover:not(:disabled) {
  color: color-mix(in srgb, var(--mat-sys-primary) 82%, black);
  text-decoration: underline;
  text-underline-offset: 0.18em;
}

.language-switcher__link--active,
.language-switcher__link:disabled {
  color: var(--app-text);
  cursor: default;
  font-weight: 700;
  text-decoration: none;
}

.language-switcher__separator {
  color: var(--app-text-muted);
  font-size: 0.8rem;
}
```

Point a retenir:

On garde la bonne semantique HTML (`button`) tout en obtenant une apparence de liens discrets.

## 17. Organisation Des Cles

Structure actuelle des cles:

```text
app
  title
  tagline
  nav
common
  save
  cancel
  delete
  edit
language
  selection
state
  empty
  error
  loading
accessDenied
notFound
persons
  list
  detail
  create
  edit
  form
  deleteDialog
  snackbar
profile
  permissionsList
```

Point a retenir:

Les cles doivent rester lisibles et previsibles.

Bonne cle:

```text
persons.form.emailRequired
```

Moins bonne cle:

```text
emailError1
```

La bonne cle dit ou le texte est utilise et ce qu'il represente.

## 18. Pieges Rencontres

### Voir `app.title` dans la page

Cause probable:

La pipe fonctionne, mais la langue n'est pas active ou le fichier JSON n'est pas charge.

Verification:

```text
http://localhost:4200/i18n/fr.json
```

Si le JSON s'affiche, le chemin est bon.

Correction:

```ts
this.translate.use('fr');
```

Dans le projet, c'est fait par:

```ts
this.languageService.init();
```

### Langue anglaise au demarrage

Cause:

Le navigateur peut etre configure en anglais.

Decision du projet:

On ignore la langue navigateur au premier chargement et on utilise francais par defaut.

```ts
private resolveInitialLanguage(): SupportedLanguage {
  const savedLanguage = localStorage.getItem(this.storageKey);

  if (this.isSupportedLanguage(savedLanguage)) {
    return savedLanguage;
  }

  return this.defaultLanguage;
}
```

### Cle manquante

Symptome:

Angular affiche la cle brute:

```text
persons.form.emailRequired
```

Cause:

La cle n'existe pas dans `fr.json`, `en.json`, ou elle n'est pas au meme chemin.

Point a retenir:

Chaque nouvelle cle doit exister dans toutes les langues supportees.

## 19. Checklist Pour Ajouter Un Nouveau Texte

Quand tu ajoutes un nouveau label:

- creer une cle dans `fr.json`
- creer la meme cle dans `en.json`
- remplacer le texte hardcode dans le template
- importer `TranslatePipe` si le composant standalone ne l'a pas encore
- utiliser `TranslateService` si le texte est produit cote TypeScript
- verifier que la page affiche bien le texte en FR et en EN
- lancer le build

Commande:

```bash
npm run build
```

Point a retenir:

Une traduction n'est complete que si:
- la cle existe dans toutes les langues
- le texte visible est traduit
- les attributs accessibles sont traduits
- les messages TypeScript sont traduits

## 20. Validation

Tu as valide l'implementation avec:

```bash
npm run build
```

Resultat:

```text
Application bundle generation complete.
```

Il reste un warning de budget Angular:

```text
bundle initial exceeded maximum budget
```

Point a retenir:

Ce warning n'est pas lie a la traduction.  
Il concerne la taille du bundle initial.

## 21. Synthese

Avec cette feature, tu as appris a mettre en place une internationalisation pragmatique dans Angular:

- installer `ngx-translate`
- charger des fichiers JSON
- centraliser la langue dans un service
- memoriser la langue choisie
- exposer la langue active avec un signal
- traduire les templates avec `TranslatePipe`
- traduire les messages TypeScript avec `TranslateService`
- gerer les textes dynamiques avec des parametres
- garder les composants accessibles

Le plus important a retenir:

```text
Le texte utilisateur ne doit plus etre code en dur dans les composants.
Il doit passer par une cle de traduction.
```


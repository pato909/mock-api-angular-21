import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { PersonsApiService } from '../../data/persons-api.service';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonFormPayload } from '../../model/person-form.model';
import { PersonForm } from '../../ui/person-form/person-form';
import { MatButtonModule } from '@angular/material/button';
import { PersonsResources } from '../../data/persons-resources';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';
import { ErrorStateComponent } from '../../../../shared/ui/error-state/error-state';
import { LoadingStateComponent } from '../../../../shared/ui/loading-state/loading-state';

@Component({
  selector: 'app-person-edit-page',
  imports: [
    MatButtonModule,
    RouterLink,
    PersonForm,
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingStateComponent,
  ],
  template: `
    <section class="page-section">
      <div class="page-hero">
        <span class="page-eyebrow">Edition personne</span>
        <h1 class="page-title">Modifier une personne de l'annuaire</h1>

        <div class="page-hero__actions">
          <a mat-stroked-button routerLink="/persons">Retour a l'annuaire</a>
        </div>
      </div>

      <section class="page-panel" aria-labelledby="create-person-title">
        <div class="section-header">
          <div class="page-section">
            <span class="page-eyebrow">Formulaire</span>
            <h2 id="create-person-title" class="section-title">Informations de la personne</h2>
          </div>
        </div>
        <div class="page-panel__content">
          @if (person.isLoading()) {
            <app-loading-state
              title="Chargement de la personne"
              message="Les donnees sont en cours de chargement."
            />
          } @else if (isNotFound()) {
            <app-empty-state
              kicker="Introuvable"
              title="Personne introuvable"
              message="Cette fiche n'existe plus ou l'identifiant ne correspond a aucune personne."
              actionLabel="Retour a l'annuaire"
              (action)="goToPersonsList()"
            />
          } @else if (person.error()) {
            <app-error-state
              kicker="Erreur"
              title="Le chargement de la personne a échoué"
              message="Reessayez pour récupérer les données."
              actionLabel="Reessayer"
              (retry)="retryPersonDetail()"
            />
          } @else {
            <app-person-form
              (submitted)="updatePerson(this.id(), $event)"
              [isSubmitting]="isSubmitting()"
              [person]="person.value()"
            />
          }
        </div>
      </section>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonEditPage {
  readonly id = input.required<string>();

  private readonly personsResources = inject(PersonsResources);
  private readonly personService = inject(PersonsApiService);

  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly isSubmitting = signal(false);

  protected readonly person = this.personsResources.personDetail;

  constructor() {
    effect(() => {
      this.personsResources.setPersonId(this.id());
    });
  }

  protected updatePerson(id: string, payload: PersonFormPayload): void {
    this.isSubmitting.set(true);
    this.personService.update(id, payload).subscribe({
      next: (person) => {
        this.isSubmitting.set(false);
        this.snackBar.open('Person updated.', 'Close', {
          duration: 3000,
        });

        this.personsResources.reloadPersonDetail();
        void this.router.navigate(['/persons', person.id]);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.snackBar.open('Could not update the person.', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  protected readonly isNotFound = () => this.person.statusCode() === 404;

  protected retryPersonDetail(): void {
    this.person.reload();
  }

  protected goToPersonsList(): void {
    void this.router.navigateByUrl('/persons');
  }
}

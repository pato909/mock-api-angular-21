import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { PersonForm } from '../../ui/person-form/person-form';
import { PersonFormPayload } from '../../model/person-form.model';
import { PersonsApiService } from '../../data/persons-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-person-create-page',
  imports: [MatButtonModule, RouterLink, PersonForm],
  template: `
    <section class="page-section">
      <div class="page-hero">
        <span class="page-eyebrow">Nouvelle personne</span>
        <h1 class="page-title">Ajouter une personne a l'annuaire.</h1>
        <p class="page-subtitle">
          Renseignez les informations principales avant de creer la fiche.
        </p>

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
          <app-person-form (submitted)="createPerson($event)" [isSubmitting]="isSubmitting()" />
        </div>
      </section>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonCreatePage {
  private readonly personService = inject(PersonsApiService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly isSubmitting = signal(false);

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
}

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { PersonForm } from '../../ui/person-form/person-form';
import { PersonFormPayload } from '../../model/person-form.model';
import { PersonsApiService } from '../../data/persons-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-person-create-page',
  imports: [MatButtonModule, RouterLink, PersonForm, TranslatePipe],
  template: `
    <section class="page-section">
      <div class="page-hero">
        <span class="page-eyebrow">{{ 'persons.create.eyebrow' | translate }}</span>
        <h1 class="page-title">{{ 'persons.create.title' | translate }}</h1>
        <p class="page-subtitle">
          {{ 'persons.create.subtitle' | translate }}
        </p>

        <div class="page-hero__actions">
          <a mat-stroked-button routerLink="/persons">{{ 'common.backToDirectory' | translate }}</a>
        </div>
      </div>

      <section class="page-panel" aria-labelledby="create-person-title">
        <div class="section-header">
          <div class="page-section">
            <span class="page-eyebrow">{{ 'persons.create.formEyebrow' | translate }}</span>
            <h2 id="create-person-title" class="section-title">
              {{ 'persons.create.formTitle' | translate }}
            </h2>
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
  private readonly translate = inject(TranslateService);

  readonly isSubmitting = signal(false);

  protected createPerson(payload: PersonFormPayload): void {
    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.personService.create(payload).subscribe({
      next: (person) => {
        this.isSubmitting.set(false);
        this.snackBar.open(
          this.translate.instant('persons.snackbar.created'),
          this.translate.instant('common.close'),
          {
            duration: 3000,
          },
        );

        void this.router.navigate(['/persons', person.id]);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.snackBar.open(
          this.translate.instant('persons.snackbar.createError'),
          this.translate.instant('common.close'),
          {
            duration: 3000,
          },
        );
      },
    });
  }
}

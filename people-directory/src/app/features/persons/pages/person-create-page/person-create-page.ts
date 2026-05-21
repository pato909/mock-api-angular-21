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
    <div class="px-6 py-10 flex flex-col gap-8">
      <!-- Hero -->
      <div class="flex flex-col gap-3">
        <span class="text-xs font-semibold uppercase tracking-widest text-gray-400">{{
          'persons.create.eyebrow' | translate
        }}</span>
        <h1 class="text-2xl font-bold text-gray-900">{{ 'persons.create.title' | translate }}</h1>
        <p class="text-sm text-gray-500">{{ 'persons.create.subtitle' | translate }}</p>
        <div class="mt-2">
          <a
            routerLink="/persons"
            class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded border border-gray-300 text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            {{ 'common.backToDirectory' | translate }}
          </a>
        </div>
      </div>

      <!-- Form panel -->
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
          <span class="text-xs font-semibold uppercase tracking-widest text-gray-400">{{
            'persons.create.formEyebrow' | translate
          }}</span>
          <h2 class="text-base font-semibold text-gray-900 mt-1">
            {{ 'persons.create.formTitle' | translate }}
          </h2>
        </div>
        <div class="px-6 py-6">
          <app-person-form (submitted)="createPerson($event)" [isSubmitting]="isSubmitting()" />
        </div>
      </div>
    </div>
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

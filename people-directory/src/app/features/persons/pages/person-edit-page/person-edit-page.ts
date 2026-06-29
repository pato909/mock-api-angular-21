import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { PersonsApiService } from '../../data/persons-api.service';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonFormPayload } from '../../model/person-form.model';
import { PersonForm } from '../../ui/person-form/person-form';
import { MatButtonModule } from '@angular/material/button';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';
import { ErrorStateComponent } from '../../../../shared/ui/error-state/error-state';
import { LoadingStateComponent } from '../../../../shared/ui/loading-state/loading-state';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-person-edit-page',
  imports: [
    MatButtonModule,
    RouterLink,
    PersonForm,
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingStateComponent,
    TranslatePipe,
  ],
  template: `
    <div class="px-6 py-10 flex flex-col gap-8">
      <!-- Hero -->
      <div class="flex flex-col gap-3">
        <span class="text-xs font-semibold uppercase tracking-widest text-gray-400">{{
          'persons.edit.eyebrow' | translate
        }}</span>
        <h1 class="text-2xl font-bold text-gray-900">{{ 'persons.edit.title' | translate }}</h1>
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
          <h2 id="edit-person-title" class="text-base font-semibold text-gray-900 mt-1">
            {{ 'persons.create.formTitle' | translate }}
          </h2>
        </div>

        <div class="px-6 py-6">
          @if (person.isLoading()) {
            <app-loading-state
              title="persons.detail.loadingTitle"
              message="persons.detail.loadingMessage"
            />
          } @else if (isNotFound()) {
            <app-empty-state
              kicker="persons.detail.notFoundKicker"
              title="persons.detail.notFoundTitle"
              message="persons.detail.notFoundMessage"
              actionLabel="common.backToDirectory"
              (action)="goToPersonsList()"
            />
          } @else if (person.error()) {
            <app-error-state
              kicker="common.error"
              title="persons.detail.loadErrorTitle"
              message="persons.detail.loadErrorMessage"
              actionLabel="common.retry"
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
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonEditPage {
  readonly id = input.required<string>();

  private readonly personService = inject(PersonsApiService);

  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  readonly isSubmitting = signal(false);

  protected readonly person = this.personService.personDetail;

  constructor() {
    effect(() => {
      this.personService.setPersonId(this.id());
    });
  }

  protected updatePerson(id: string, payload: PersonFormPayload): void {
    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.personService.update(id, payload).subscribe({
      next: (person) => {
        this.isSubmitting.set(false);
        this.snackBar.open(
          this.translate.instant('persons.snackbar.updated'),
          this.translate.instant('common.close'),
          {
            duration: 3000,
          },
        );

        this.personService.reloadPersonDetail();
        void this.router.navigate(['/persons', person.id]);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.snackBar.open(
          this.translate.instant('persons.snackbar.updateError'),
          this.translate.instant('common.close'),
          {
            duration: 3000,
          },
        );
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

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
    <section class="page-section">
      <div class="page-hero">
        <span class="page-eyebrow">{{ 'persons.edit.eyebrow' | translate }}</span>
        <h1 class="page-title">{{ 'persons.edit.title' | translate }}</h1>

        <div class="page-hero__actions">
          <a mat-stroked-button routerLink="/persons">{{ 'common.backToDirectory' | translate }}</a>
        </div>
      </div>

      <section class="page-panel" aria-labelledby="edit-person-title">
        <div class="section-header">
          <div class="page-section">
            <span class="page-eyebrow">{{ 'persons.create.formEyebrow' | translate }}</span>
            <h2 id="edit-person-title" class="section-title">
              {{ 'persons.create.formTitle' | translate }}
            </h2>
          </div>
        </div>
        <div class="page-panel__content">
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
  private readonly translate = inject(TranslateService);

  readonly isSubmitting = signal(false);

  protected readonly person = this.personsResources.personDetail;

  constructor() {
    effect(() => {
      this.personsResources.setPersonId(this.id());
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

        this.personsResources.reloadPersonDetail();
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

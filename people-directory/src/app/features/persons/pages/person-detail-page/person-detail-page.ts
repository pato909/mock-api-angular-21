import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { PersonsResources } from '../../data/persons-resources';
import { LoadingStateComponent } from '../../../../shared/ui/loading-state/loading-state';
import { ErrorStateComponent } from '../../../../shared/ui/error-state/error-state';
import { DatePipe } from '@angular/common';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';
import { DeletePersonDialog } from '../../ui/delete-person-dialog/delete-person-dialog';
import { filter, finalize, switchMap, tap } from 'rxjs';
import { Person } from '../../model/person.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonsApiService } from '../../data/persons-api.service';
import { PersonAvatar } from '../../ui/person-avatar/person-avatar';
import { SecurityService } from '../../../../core/security/security.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-person-detail-page',
  imports: [
    MatIcon,
    MatDivider,
    MatButton,
    RouterLink,
    LoadingStateComponent,
    ErrorStateComponent,
    DatePipe,
    EmptyStateComponent,
    PersonAvatar,
    TranslatePipe,
  ],
  template: `
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
    }
    @if (person.value(); as p) {
      <section class="page-section">
        <div class="page-hero detail-hero">
          <div class="detail-hero__identity">
            <app-person-avatar
              [avatar]="p.avatar"
              [firstName]="p.firstName"
              [lastName]="p.lastName"
              variant="detail"
            />

            <div class="detail-hero__copy">
              <span class="page-eyebrow">{{ 'persons.detail.personCard' | translate }}</span>
              <h1 class="page-title">{{ p.firstName }} {{ p.lastName }}</h1>
              <p class="page-subtitle">{{ p.email }}</p>
            </div>
          </div>

          <div
            class="detail-actions"
            role="group"
            [attr.aria-label]="'persons.detail.actionsLabel' | translate"
          >
            <a
              mat-flat-button
              [routerLink]="['/persons', p.id, 'edit']"
              [attr.aria-label]="'persons.list.editPerson' | translate: { name: fullName(p) }"
              [disabled]="
                !securityService.isConnected() ||
                (securityService.isConnected() && !securityService.user().admin)
              "
            >
              <mat-icon aria-hidden="true">edit</mat-icon>
              {{ 'common.edit' | translate }}
            </a>

            <button
              mat-flat-button
              type="button"
              (click)="deletePerson(p)"
              [disabled]="
                isDeleting() ||
                !securityService.isConnected() ||
                (securityService.isConnected() && !securityService.user().admin)
              "
              [attr.aria-label]="'persons.list.deletePerson' | translate: { name: fullName(p) }"
            >
              <mat-icon aria-hidden="true">delete</mat-icon>
              {{ (isDeleting() ? 'common.deleting' : 'common.delete') | translate }}
            </button>
          </div>
        </div>

        <section class="page-panel">
          <div class="section-header">
            <div class="page-section">
              <span class="page-eyebrow">{{ 'persons.detail.coordinates' | translate }}</span>
              <h2 class="section-title">{{ 'persons.detail.mainInformation' | translate }}</h2>
            </div>
          </div>

          <div class="page-info-grid">
            <div class="page-info-card">
              <span class="page-info-label">{{ 'common.email' | translate }}</span>
              <a class="page-info-value" [href]="'mailto:' + p.email">
                {{ p.email }}
              </a>
            </div>

            <div class="page-info-card">
              <span class="page-info-label">{{ 'common.phone' | translate }}</span>
              <a class="page-info-value" [href]="'tel:' + p.phone">
                {{ p.phone }}
              </a>
            </div>

            <div class="page-info-card">
              <span class="page-info-label">{{ 'persons.fields.birthDate' | translate }}</span>
              <span class="page-info-value">{{ p.birthDate | date: 'dd/MM/yyyy' }}</span>
            </div>
          </div>
        </section>

        <section class="page-panel page-panel--quiet" aria-labelledby="metadata-title">
          <div class="section-header">
            <div class="page-section">
              <span class="page-eyebrow">{{ 'persons.detail.metadata' | translate }}</span>
              <h2 id="metadata-title" class="section-title">
                {{ 'persons.detail.tracking' | translate }}
              </h2>
            </div>
          </div>

          <mat-divider />

          <dl class="page-info-grid metadata-list">
            <div class="page-info-card">
              <dt class="page-info-label">{{ 'common.identifier' | translate }}</dt>
              <dd class="page-info-value">{{ p.id }}</dd>
            </div>

            <div class="page-info-card">
              <dt class="page-info-label">{{ 'persons.detail.createdAt' | translate }}</dt>
              <dd class="page-info-value">{{ p.created_at | date: 'dd/MM/yyyy' }}</dd>
            </div>

            <div class="page-info-card">
              <dt class="page-info-label">{{ 'persons.detail.updatedAt' | translate }}</dt>
              <dd class="page-info-value">{{ p.updated_at | date: 'dd/MM/yyyy' }}</dd>
            </div>
          </dl>
        </section>
      </section>
    }
  `,
  styles: `
    .detail-hero {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-6);
      background: color-mix(in srgb, var(--mat-sys-surface-container-low) 55%, aliceblue);
    }

    .detail-hero__identity {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-5);
      min-width: 0;
    }

    .detail-hero__copy {
      display: grid;
      gap: var(--space-2);
      min-width: 0;
    }

    .detail-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .detail-actions a,
    .detail-actions button {
      display: inline-flex;
      gap: var(--space-2);
    }

    @media (max-width: 640px) {
      .detail-actions {
        width: 100%;
      }

      .detail-actions a,
      .detail-actions button {
        flex: 1 1 12rem;
        justify-content: center;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonDetailPage {
  // input signal lié à la route (withComponentInputBinding)
  readonly id = input.required<string>();
  readonly isDeleting = signal(false);

  private readonly personsResources = inject(PersonsResources);
  private readonly personApi = inject(PersonsApiService);
  private readonly router = inject(Router);
  readonly securityService = inject(SecurityService);

  protected readonly person = this.personsResources.personDetail;

  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  constructor() {
    effect(() => {
      this.personsResources.setPersonId(this.id());
    });
  }

  protected readonly isNotFound = () => this.person.statusCode() === 404;

  protected retryPersonDetail(): void {
    this.person.reload();
  }

  protected goToPersonsList(): void {
    void this.router.navigateByUrl('/persons');
  }

  protected fullName(person: Person): string {
    return `${person.firstName} ${person.lastName}`;
  }

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
          this.snackBar.open(
            this.translate.instant('persons.snackbar.deleted'),
            this.translate.instant('common.close'),
            {
              duration: 3000,
            },
          );

          this.personsResources.reloadPersons();
          this.personsResources.reloadPersonsCount();
          void this.router.navigate(['/persons']);
        },
        error: () => {
          this.snackBar.open(
            this.translate.instant('persons.snackbar.deleteError'),
            this.translate.instant('common.close'),
            {
              duration: 3000,
            },
          );
        },
      });
  }
}

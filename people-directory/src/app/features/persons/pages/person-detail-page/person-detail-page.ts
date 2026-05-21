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
      <div class="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-8">
        <!-- Hero -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div class="flex items-center gap-4">
            <app-person-avatar
              [avatar]="p.avatar"
              [firstName]="p.firstName"
              [lastName]="p.lastName"
              variant="detail"
            />
            <div>
              <span class="text-xs font-semibold uppercase tracking-widest text-gray-400">{{
                'persons.detail.personCard' | translate
              }}</span>
              <h1 class="text-2xl font-bold text-gray-900">{{ p.firstName }} {{ p.lastName }}</h1>
              <p class="text-sm text-gray-500">{{ p.email }}</p>
            </div>
          </div>

          <div
            class="flex gap-3"
            role="group"
            [attr.aria-label]="'persons.detail.actionsLabel' | translate"
          >
            <a
              [routerLink]="['/persons', p.id, 'edit']"
              [attr.aria-label]="'persons.list.editPerson' | translate: { name: fullName(p) }"
              [class.pointer-events-none]="!securityService.canEditPerson()"
              [class.opacity-50]="!securityService.canEditPerson()"
              class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded border border-gray-300 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <mat-icon class="text-base" aria-hidden="true">edit</mat-icon>
              {{ 'common.edit' | translate }}
            </a>

            <button
              type="button"
              (click)="deletePerson(p)"
              [disabled]="isDeleting() || !securityService.canDeletePerson()"
              [attr.aria-label]="'persons.list.deletePerson' | translate: { name: fullName(p) }"
              class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded border border-gray-300 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <mat-icon class="text-base" aria-hidden="true">delete</mat-icon>
              {{ (isDeleting() ? 'common.deleting' : 'common.delete') | translate }}
            </button>
          </div>
        </div>

        <!-- Contact info -->
        <div class="border border-gray-200 rounded-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <span class="text-xs font-semibold uppercase tracking-widest text-gray-400">{{
              'persons.detail.coordinates' | translate
            }}</span>
            <h2 class="text-base font-semibold text-gray-900 mt-1">
              {{ 'persons.detail.mainInformation' | translate }}
            </h2>
          </div>
          <div
            class="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100"
          >
            <div class="px-6 py-4">
              <span class="text-xs text-gray-400 uppercase tracking-wide">{{
                'common.email' | translate
              }}</span>
              <a
                [href]="'mailto:' + p.email"
                class="block text-sm font-medium text-blue-600 hover:underline mt-1"
                >{{ p.email }}</a
              >
            </div>
            <div class="px-6 py-4">
              <span class="text-xs text-gray-400 uppercase tracking-wide">{{
                'common.phone' | translate
              }}</span>
              <a
                [href]="'tel:' + p.phone"
                class="block text-sm font-medium text-blue-600 hover:underline mt-1"
                >{{ p.phone }}</a
              >
            </div>
            <div class="px-6 py-4">
              <span class="text-xs text-gray-400 uppercase tracking-wide">{{
                'persons.fields.birthDate' | translate
              }}</span>
              <span class="block text-sm font-medium text-gray-900 mt-1">{{
                p.birthDate | date: 'dd/MM/yyyy'
              }}</span>
            </div>
          </div>
        </div>

        <!-- Metadata -->
        <div class="border border-gray-200 rounded-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <span class="text-xs font-semibold uppercase tracking-widest text-gray-400">{{
              'persons.detail.metadata' | translate
            }}</span>
            <h2 class="text-base font-semibold text-gray-900 mt-1">
              {{ 'persons.detail.tracking' | translate }}
            </h2>
          </div>
          <dl
            class="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100"
          >
            <div class="px-6 py-4">
              <dt class="text-xs text-gray-400 uppercase tracking-wide">
                {{ 'common.identifier' | translate }}
              </dt>
              <dd class="text-sm font-medium text-gray-900 mt-1">{{ p.id }}</dd>
            </div>
            <div class="px-6 py-4">
              <dt class="text-xs text-gray-400 uppercase tracking-wide">
                {{ 'persons.detail.createdAt' | translate }}
              </dt>
              <dd class="text-sm font-medium text-gray-900 mt-1">
                {{ p.created_at | date: 'dd/MM/yyyy' }}
              </dd>
            </div>
            <div class="px-6 py-4">
              <dt class="text-xs text-gray-400 uppercase tracking-wide">
                {{ 'persons.detail.updatedAt' | translate }}
              </dt>
              <dd class="text-sm font-medium text-gray-900 mt-1">
                {{ p.updated_at | date: 'dd/MM/yyyy' }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    }
  `,
  styles: ``,
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
    if (!this.securityService.canDeletePerson()) return;

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

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PersonsListQuery } from '../../model/person-query.model';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoadingStateComponent } from '../../../../shared/ui/loading-state/loading-state';
import { ErrorStateComponent } from '../../../../shared/ui/error-state/error-state';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatIcon } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Person } from '../../model/person.model';
import { MatDialog } from '@angular/material/dialog';
import { DeletePersonDialog } from '../../ui/delete-person-dialog/delete-person-dialog';
import { filter, finalize, switchMap, tap } from 'rxjs';
import { PersonsApiService } from '../../data/persons-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonAvatar } from '../../ui/person-avatar/person-avatar';
import { SecurityService } from '../../../../core/security/security.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-persons-list-page',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    LoadingStateComponent,
    ErrorStateComponent,
    EmptyStateComponent,
    MatTableModule,
    DatePipe,
    MatSortModule,
    MatIcon,
    MatPaginatorModule,
    PersonAvatar,
    TranslatePipe,
  ],
  styles: ``,
  template: `
    <section class="flex flex-col gap-6 p-6">
      <!-- Search -->
      <section class="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
        <h2 class="text-base font-medium text-gray-700 mb-4">
          {{ 'persons.list.searchTitle' | translate }}
        </h2>

        <mat-form-field appearance="outline" class="w-96">
          <mat-label>{{ 'persons.list.searchLabel' | translate }}</mat-label>
          <input
            #searchInput
            matInput
            type="text"
            [placeholder]="'persons.list.searchPlaceholder' | translate"
            aria-describedby="persons-search-hint"
            [value]="this.searchInput()"
            (input)="updateSearch(searchInput.value)"
          />
          <mat-hint id="persons-search-hint">{{ 'persons.list.searchHint' | translate }}</mat-hint>
          @if (this.searchInput()) {
            <button
              mat-icon-button
              matSuffix
              type="button"
              [attr.aria-label]="'persons.list.clearSearch' | translate"
              (click)="clearSearch()"
            >
              <mat-icon>close</mat-icon>
            </button>
          }
        </mat-form-field>
      </section>

      <!-- Results -->
      <section class="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
        <h2 class="text-base font-medium text-gray-700 mb-4">
          {{ 'persons.list.resultsTitle' | translate }}
        </h2>

        @if (persons.isLoading()) {
          <app-loading-state
            title="persons.list.loadingTitle"
            message="persons.list.loadingMessage"
          />
        } @else if (persons.error()) {
          <app-error-state
            kicker="common.error"
            title="persons.list.loadErrorTitle"
            message="persons.list.loadErrorMessage"
            actionLabel="common.retry"
            (retry)="retryPersonsList()"
          />
        } @else if (rows().length === 0) {
          <app-empty-state
            kicker="persons.list.emptyKicker"
            [title]="
              query().search.trim()
                ? 'persons.list.emptySearchTitle'
                : 'persons.list.emptyDirectoryTitle'
            "
            [message]="
              query().search.trim()
                ? 'persons.list.emptySearchMessage'
                : 'persons.list.emptyDirectoryMessage'
            "
            [actionLabel]="
              query().search.trim() ? 'persons.list.clearSearch' : 'persons.list.createFirstPerson'
            "
            (action)="query().search.trim() ? clearSearch() : goToCreate()"
          />
        } @else {
          <div class="overflow-x-auto">
            <table
              mat-table
              [dataSource]="rows()"
              [attr.aria-label]="'persons.list.tableLabel' | translate"
              matSort
              [matSortActive]="sortActive()"
              [matSortDirection]="query().order"
              (matSortChange)="updateSort($event.active, $event.direction)"
            >
              <caption class="sr-only">
                {{
                  'persons.list.tableCaption' | translate
                }}
              </caption>

              <ng-container matColumnDef="avatar">
                <th mat-header-cell *matHeaderCellDef>{{ 'common.avatar' | translate }}</th>
                <td mat-cell *matCellDef="let person">
                  <app-person-avatar
                    [avatar]="person.avatar"
                    [firstName]="person.firstName"
                    [lastName]="person.lastName"
                  />
                </td>
              </ng-container>

              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header="name">
                  {{ 'persons.fields.fullName' | translate }}
                </th>
                <td mat-cell *matCellDef="let person">
                  <div class="flex flex-col">
                    <span>{{ person.firstName }} {{ person.lastName }}</span>
                    <span class="text-xs text-gray-400">
                      {{ 'persons.list.personIdentifier' | translate: { id: person.id } }}
                    </span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef mat-sort-header="email">
                  {{ 'common.email' | translate }}
                </th>
                <td mat-cell *matCellDef="let person">{{ person.email }}</td>
              </ng-container>

              <ng-container matColumnDef="phone">
                <th mat-header-cell *matHeaderCellDef mat-sort-header="phone">
                  {{ 'common.phone' | translate }}
                </th>
                <td mat-cell *matCellDef="let person">{{ person.phone }}</td>
              </ng-container>

              <ng-container matColumnDef="birthDate">
                <th mat-header-cell *matHeaderCellDef mat-sort-header="birthDate">
                  {{ 'persons.fields.birthDate' | translate }}
                </th>
                <td mat-cell *matCellDef="let person">
                  {{ person.birthDate | date: 'dd/MM/yyyy' }}
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>{{ 'common.actions' | translate }}</th>
                <td mat-cell *matCellDef="let person">
                  <div class="flex gap-1">
                    <button
                      mat-button
                      type="button"
                      [attr.aria-label]="
                        'persons.list.viewPerson' | translate: { name: fullName(person) }
                      "
                      [disabled]="!securityService.canViewPerson()"
                      (click)="goToDetail(person.id)"
                    >
                      {{ 'common.view' | translate }}
                    </button>
                    <button
                      mat-button
                      type="button"
                      [attr.aria-label]="
                        'persons.list.editPerson' | translate: { name: fullName(person) }
                      "
                      [disabled]="!securityService.canEditPerson()"
                      (click)="goToEdit(person.id)"
                    >
                      {{ 'common.edit' | translate }}
                    </button>
                    <button
                      mat-button
                      type="button"
                      [disabled]="isDeleting(person.id) || !securityService.canDeletePerson()"
                      [attr.aria-label]="
                        'persons.list.deletePerson' | translate: { name: fullName(person) }
                      "
                      (click)="deletePerson(person)"
                    >
                      {{
                        (isDeleting(person.id) ? 'common.deleting' : 'common.delete') | translate
                      }}
                    </button>
                  </div>
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
              [attr.aria-label]="'persons.list.paginationLabel' | translate"
              (page)="updatePage($event.pageIndex, $event.pageSize)"
            />
          </div>
        }
      </section>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonsListPage {
  private readonly router = inject(Router);
  protected readonly securityService = inject(SecurityService);

  query = signal<PersonsListQuery>({
    search: '',
    sortBy: 'lastName',
    order: 'asc',
    page: 1,
    limit: 10,
  });

  personApi = inject(PersonsApiService);

  protected readonly persons = this.personApi.personsList;
  protected readonly countResource = this.personApi.personsCount;

  displayedColumns = ['avatar', 'name', 'email', 'phone', 'birthDate', 'actions'];

  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);
  protected readonly deletingPersonId = signal<string | null>(null);

  rows = computed(() => this.persons.value() ?? []);
  searchInput = signal('');

  updateSearch(search: string) {
    this.searchInput.set(search);
  }

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

    effect(() => {
      this.personApi.setListQuery(this.query());
    });
  }

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

  sortActive = computed(() => {
    return this.query().sortBy === 'lastName' ? 'name' : this.query().sortBy;
  });

  protected clearSearch() {
    this.searchInput.set('');
  }

  updatePage(pageIndex: number, pageSize: number) {
    this.query.update((current) => ({
      ...current,
      page: pageIndex + 1,
      limit: pageSize,
    }));
  }

  protected retryPersonsList() {
    this.personApi.reloadPersons();
    this.personApi.reloadPersonsCount();
  }

  protected goToCreate() {
    void this.router.navigateByUrl('/persons/new');
  }

  protected goToDetail(personId: string) {
    if (!this.securityService.canViewPerson()) {
      return;
    }

    void this.router.navigate(['/persons', personId]);
  }

  protected goToEdit(personId: string) {
    if (!this.securityService.canEditPerson()) {
      return;
    }

    void this.router.navigate(['/persons', personId, 'edit']);
  }

  protected deletePerson(person: Person) {
    if (!this.securityService.canDeletePerson()) return;

    if (this.deletingPersonId()) {
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
        tap(() => this.deletingPersonId.set(person.id)),
        switchMap(() => this.personApi.delete(person.id)),
        finalize(() => this.deletingPersonId.set(null)),
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
          this.personApi.reloadPersons();
          this.personApi.reloadPersonsCount();
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

  protected isDeleting(personId: string): boolean {
    return this.deletingPersonId() === personId;
  }

  protected fullName(person: Person): string {
    return `${person.firstName} ${person.lastName}`;
  }
}

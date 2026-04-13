import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PersonsResources } from '../../data/persons-resources';
import { PersonsListQuery } from '../../model/person-query.model';
import { Router, RouterLink } from '@angular/router';
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

@Component({
  selector: 'app-persons-list-page',
  imports: [
    MatButtonModule,
    RouterLink,
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
  ],
  styles: `
    .page-hero {
      display: grid;
      gap: var(--space-4);
      padding: var(--space-6);
      border: 1px solid var(--app-border);
      border-radius: var(--radius-md);
      background:
        radial-gradient(
          circle at top right,
          color-mix(in srgb, var(--mat-sys-secondary-container) 70%, white) 0%,
          transparent 28%
        ),
        linear-gradient(
          180deg,
          color-mix(in srgb, var(--mat-sys-surface-container-low) 70%, white),
          var(--app-surface)
        );
    }

    .page-hero__actions {
      margin-top: var(--space-1);
    }

    .page-panel {
      display: grid;
      gap: var(--space-4);
      margin-top: var(--space-4);
      padding: var(--space-5);
      border: 1px solid var(--app-border);
      border-radius: var(--radius-md);
      background: var(--app-surface);
      box-shadow: 0 10px 24px color-mix(in srgb, var(--app-border) 26%, transparent);
    }

    .page-panel .section-header {
      display: grid;
      gap: var(--space-2);
      padding-bottom: var(--space-3);
      border-bottom: 1px solid color-mix(in srgb, var(--app-border) 70%, transparent);
    }

    .page-panel .page-section {
      display: grid;
      gap: var(--space-2);
      padding: 0;
    }

    .page-panel__content {
      display: grid;
      gap: var(--space-3);
    }

    .page-search-field {
      max-width: 36rem;
      width: 100%;
    }

    .page-panel__hint {
      margin: 0;
      color: var(--app-text-muted);
    }

    .persons-table-wrapper {
      overflow: hidden;
      border: 1px solid var(--app-border);
      border-radius: var(--radius-md);
      background: var(--app-surface);
    }

    .persons-table {
      width: 100%;
      background: transparent;
    }

    .persons-table .mat-mdc-header-row {
      background: color-mix(in srgb, var(--mat-sys-secondary-container) 38%, white);
    }

    .persons-table .mat-mdc-header-cell {
      color: var(--app-text);
      font: var(--mat-sys-title-small);
      border-bottom: 1px solid var(--app-border);
      padding-block: var(--space-4);
    }

    .persons-table .mat-mdc-cell {
      color: var(--app-text);
      border-bottom: 1px solid color-mix(in srgb, var(--app-border) 70%, transparent);
      padding-block: var(--space-4);
    }

    .persons-table .mat-mdc-row:hover {
      background: color-mix(in srgb, var(--mat-sys-secondary-container) 18%, white);
    }

    .persons-table .mat-mdc-row:last-child .mat-mdc-cell {
      border-bottom: none;
    }

    .person-name {
      display: grid;
      gap: 0.2rem;
      font-weight: 600;
    }

    .person-secondary {
      color: var(--app-text-muted);
    }

    .person-avatar {
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 999px;
      object-fit: cover;
      display: block;
      border: 2px solid color-mix(in srgb, var(--mat-sys-secondary-container) 55%, white);
      background: color-mix(in srgb, var(--mat-sys-secondary-container) 38%, white);
    }

    .person-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }
  `,
  template: `
    <section class="page-section">
      <div class="page-hero">
        <span class="page-eyebrow">Annuaire</span>
        <h1 class="page-title">Parcourir et gerer les personnes en un seul endroit.</h1>

        <div class="page-hero__actions">
          <a mat-flat-button routerLink="/persons/new">Nouvelle personne</a>
        </div>
      </div>

      <section class="page-panel">
        <div class="section-header">
          <div class="page-section">
            <h2 class="section-title">Recherche</h2>
          </div>
        </div>

        <div class="page-panel__content">
          <mat-form-field appearance="outline" class="page-search-field">
            <mat-label>Rechercher une personne</mat-label>
            <input
              #searchInput
              matInput
              type="text"
              placeholder="Rechercher par nom, email ou telephone"
              [value]="this.searchInput()"
              (input)="updateSearch(searchInput.value)"
            />
            @if (this.searchInput()) {
              <button
                mat-icon-button
                matSuffix
                type="button"
                aria-label="Effacer la recherche"
                (click)="clearSearch()"
              >
                <mat-icon>close</mat-icon>
              </button>
            }
          </mat-form-field>
        </div>
      </section>

      <section class="page-panel">
        <div class="section-header">
          <div class="page-section">
            <h2 class="section-title">Resultats</h2>
          </div>
        </div>

        <div class="page-panel__content">
          @if (persons.isLoading()) {
            <app-loading-state
              title="Chargement des personnes"
              message="Les donnees de l'annuaire sont en cours de chargement."
            />
          } @else if (persons.error()) {
            <app-error-state
              kicker="Erreur"
              title="Le chargement de l'annuaire a echoue"
              message="Reessayez pour recuperer la liste des personnes avec les filtres actuels."
              actionLabel="Reessayer"
              (retry)="retryPersonsList()"
            />
          } @else if (rows().length === 0) {
            <app-empty-state
              kicker="Aucun resultat"
              [title]="
                query().search.trim()
                  ? 'Aucune personne ne correspond a votre recherche'
                  : 'Aucune personne dans l\\'annuaire pour le moment'
              "
              [message]="
                query().search.trim()
                  ? 'Essayez un autre terme de recherche ou effacez la recherche courante.'
                  : 'Creez une premiere personne pour commencer a alimenter l\\'annuaire.'
              "
              [actionLabel]="query().search.trim() ? 'Effacer la recherche' : 'Creer la premiere personne'"
              (action)="query().search.trim() ? clearSearch() : goToCreate()"
            />
          } @else {
            <div class="persons-table-wrapper">
              <table
                mat-table
                [dataSource]="rows()"
                class="persons-table"
                matSort
                [matSortActive]="sortActive()"
                [matSortDirection]="query().order"
                (matSortChange)="updateSort($event.active, $event.direction)"
              >
                <ng-container matColumnDef="avatar">
                  <th mat-header-cell *matHeaderCellDef>Avatar</th>
                  <td mat-cell *matCellDef="let person">
                    <img
                      class="person-avatar"
                      [src]="person.avatar"
                      [alt]="'Avatar of ' + person.firstName + ' ' + person.lastName"
                    />
                  </td>
                </ng-container>

                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header="name">Nom complet</th>
                  <td mat-cell *matCellDef="let person">
                    <div class="person-name">
                      <span>{{ person.firstName }} {{ person.lastName }}</span>
                      <span class="person-secondary">Identifiant : {{ person.id }}</span>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header="email">Email</th>
                  <td mat-cell *matCellDef="let person">
                    {{ person.email }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="phone">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header="phone">Telephone</th>
                  <td mat-cell *matCellDef="let person">
                    {{ person.phone }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="birthDate">
                  <th mat-header-cell *matHeaderCellDef mat-sort-header="birthDate">
                    Date de naissance
                  </th>
                  <td mat-cell *matCellDef="let person">
                    {{ person.birthDate | date: 'dd/MM/yyyy' }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let person">
                    <div class="person-actions">
                      <a mat-button [routerLink]="['/persons', person.id]">Voir</a>
                      <a mat-button [routerLink]="['/persons', person.id, 'edit']">Modifier</a>
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
                (page)="updatePage($event.pageIndex, $event.pageSize)"
              />
            </div>
          }
        </div>
      </section>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonsListPage {
  private readonly router = inject(Router);

  query = signal<PersonsListQuery>({
    search: '',
    sortBy: 'lastName',
    order: 'asc',
    page: 1,
    limit: 10,
  });

  personsResources = inject(PersonsResources);

  persons = this.personsResources.personsList(this.query);
  countResource = this.personsResources.countPersons(this.query);

  displayedColumns = ['avatar', 'name', 'email', 'phone', 'birthDate', 'actions'];

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
    this.query.update((current) => ({
      ...current,
    }));
  }

  protected goToCreate() {
    void this.router.navigateByUrl('/persons/new');
  }
}

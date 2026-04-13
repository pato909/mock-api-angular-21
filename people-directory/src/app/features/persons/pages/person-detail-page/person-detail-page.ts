import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { PersonsResources } from '../../data/persons-resources';
import { LoadingStateComponent } from '../../../../shared/ui/loading-state/loading-state';
import { ErrorStateComponent } from '../../../../shared/ui/error-state/error-state';
import { DatePipe } from '@angular/common';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';

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
  ],
  template: `
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
    }
    @if (person.value(); as p) {
      <section class="page-section">
        <div class="page-hero detail-hero">
          <div class="detail-hero__identity">
            <img
              class="detail-avatar"
              [src]="p.avatar"
              [alt]="'Avatar de ' + p.firstName + ' ' + p.lastName"
            />

            <div class="detail-hero__copy">
              <span class="page-eyebrow">Fiche personne</span>
              <h1 class="page-title">{{ p.firstName }} {{ p.lastName }}</h1>
              <p class="page-subtitle">{{ p.email }}</p>
            </div>
          </div>

          <div class="detail-actions" aria-label="Actions de la personne">
            <a mat-flat-button [routerLink]="['/persons', p.id, 'edit']">
              <mat-icon aria-hidden="true">edit</mat-icon>
              Modifier
            </a>

            <button mat-stroked-button type="button" disabled>
              <mat-icon aria-hidden="true">delete</mat-icon>
              Supprimer
            </button>
          </div>
        </div>

        <section class="page-panel">
          <div class="section-header">
            <div class="page-section">
              <span class="page-eyebrow">Coordonnees</span>
              <h2 class="section-title">Informations principales</h2>
            </div>
          </div>

          <div class="page-info-grid">
            <div class="page-info-card">
              <span class="page-info-label">Email</span>
              <a class="page-info-value" [href]="'mailto:' + p.email">
                {{ p.email }}
              </a>
            </div>

            <div class="page-info-card">
              <span class="page-info-label">Telephone</span>
              <a class="page-info-value" [href]="'tel:' + p.phone">
                {{ p.phone }}
              </a>
            </div>

            <div class="page-info-card">
              <span class="page-info-label">Date de naissance</span>
              <span class="page-info-value">{{ p.birthDate | date: 'dd/MM/yyyy' }}</span>
            </div>
          </div>
        </section>

        <section class="page-panel page-panel--quiet" aria-labelledby="metadata-title">
          <div class="section-header">
            <div class="page-section">
              <span class="page-eyebrow">Metadonnees</span>
              <h2 id="metadata-title" class="section-title">Suivi de la fiche</h2>
            </div>
          </div>

          <mat-divider />

          <dl class="page-info-grid metadata-list">
            <div class="page-info-card">
              <dt class="page-info-label">Identifiant</dt>
              <dd class="page-info-value">{{ p.id }}</dd>
            </div>

            <div class="page-info-card">
              <dt class="page-info-label">Cree le</dt>
              <dd class="page-info-value">{{ p.created_at | date: 'dd/MM/yyyy' }}</dd>
            </div>

            <div class="page-info-card">
              <dt class="page-info-label">Mis a jour le</dt>
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

    .detail-avatar {
      display: block;
      width: clamp(7rem, 18vw, 10rem);
      height: clamp(7rem, 18vw, 10rem);
      flex: 0 0 auto;
      border: 3px solid color-mix(in srgb, var(--mat-sys-secondary-container) 70%, white);
      border-radius: 999px;
      background: color-mix(in srgb, var(--mat-sys-secondary-container) 38%, white);
      object-fit: cover;
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
  id = input.required<string>();
  private readonly personService = inject(PersonsResources);
  private readonly router = inject(Router);

  person = this.personService.personDetail(this.id);

  protected readonly isNotFound = () => this.person.statusCode() === 404;

  protected retryPersonDetail() {
    this.person = this.personService.personDetail(this.id);
  }

  protected goToPersonsList() {
    void this.router.navigateByUrl('/persons');
  }
}

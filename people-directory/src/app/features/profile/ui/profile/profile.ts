import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SecurityService } from '../../../../core/security/security.service';

@Component({
  selector: 'app-profile',
  imports: [MatButton, MatDivider, MatIcon, RouterLink, UpperCasePipe],
  template: `
    @if (userConnected(); as user) {
      <section class="page-section">
        <div class="page-hero profile-hero">
          <div class="profile-identity">
            <div class="profile-avatar" aria-hidden="true">
              {{ initials() }}
            </div>

            <div class="profile-copy">
              <span class="page-eyebrow">Profil</span>
              <h1 class="page-title">{{ displayName() }}</h1>
              <p class="page-subtitle">
                Informations issues de la session de securite active.
              </p>
            </div>
          </div>

          <div class="profile-actions" role="group" aria-label="Actions du profil">
            <a mat-flat-button routerLink="/persons">
              <mat-icon aria-hidden="true">groups</mat-icon>
              Annuaire
            </a>

            <button mat-button type="button" (click)="securityService.logout()">
              <mat-icon aria-hidden="true">logout</mat-icon>
              Logout
            </button>
          </div>
        </div>

        <section class="page-panel">
          <div class="section-header">
            <div class="page-section">
              <span class="page-eyebrow">Identite</span>
              <h2 class="section-title">Informations principales</h2>
            </div>
          </div>

          <div class="page-info-grid">
            <div class="page-info-card">
              <span class="page-info-label">Prenom</span>
              <span class="page-info-value">{{ user.firstname || 'Non renseigne' }}</span>
            </div>

            <div class="page-info-card">
              <span class="page-info-label">Nom</span>
              <span class="page-info-value">{{ user.lastname || 'Non renseigne' }}</span>
            </div>

            <div class="page-info-card">
              <span class="page-info-label">Langue</span>
              <span class="page-info-value">{{ user.locale | uppercase }}</span>
            </div>
          </div>
        </section>

        <section class="page-panel" aria-labelledby="permissions-title">
          <div class="section-header">
            <div class="page-section">
              <span class="page-eyebrow">Autorisations</span>
              <h2 id="permissions-title" class="section-title">Actions disponibles</h2>
            </div>
          </div>

          <div class="permissions-list" role="list">
            @for (permission of permissions(); track permission.label) {
              <div
                class="permission-item"
                role="listitem"
                [class.permission-item--allowed]="permission.allowed"
              >
                <span class="permission-icon" aria-hidden="true">
                  <mat-icon>{{ permission.allowed ? 'check_circle' : 'block' }}</mat-icon>
                </span>

                <span class="permission-copy">
                  <span class="permission-label">{{ permission.label }}</span>
                  <span class="permission-description">{{ permission.description }}</span>
                </span>

                <span class="permission-status">
                  {{ permission.allowed ? 'Autorise' : 'Non autorise' }}
                </span>
              </div>
            }
          </div>
        </section>

        <section class="page-panel page-panel--quiet" aria-labelledby="security-title">
          <div class="section-header">
            <div class="page-section">
              <span class="page-eyebrow">Securite</span>
              <h2 id="security-title" class="section-title">Droits et identifiants</h2>
            </div>
          </div>

          <mat-divider />

          <dl class="page-info-grid profile-metadata">
            <div class="page-info-card">
              <dt class="page-info-label">Statut</dt>
              <dd class="page-info-value">
                {{ user.connected ? 'Connecte' : 'Deconnecte' }}
              </dd>
            </div>

            <div class="page-info-card">
              <dt class="page-info-label">Role</dt>
              <dd class="page-info-value">{{ user.admin ? 'Administrateur' : 'Utilisateur' }}</dd>
            </div>

            <div class="page-info-card">
              <dt class="page-info-label">NISS</dt>
              <dd class="page-info-value">{{ user.ssin || 'Non renseigne' }}</dd>
            </div>

            <div class="page-info-card">
              <dt class="page-info-label">BCE</dt>
              <dd class="page-info-value">{{ user.bce || 'Non renseigne' }}</dd>
            </div>
          </dl>
        </section>
      </section>
    }
  `,
  styles: `
    .profile-hero {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-6);
      background: color-mix(in srgb, var(--mat-sys-surface-container-low) 55%, aliceblue);
    }

    .profile-identity {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-5);
      min-width: 0;
    }

    .profile-avatar {
      display: grid;
      flex: 0 0 auto;
      place-items: center;
      width: 5.5rem;
      height: 5.5rem;
      border: 1px solid color-mix(in srgb, var(--mat-sys-primary) 18%, white);
      border-radius: 1.75rem;
      background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--mat-sys-primary) 84%, black),
        color-mix(in srgb, var(--mat-sys-tertiary) 44%, var(--mat-sys-primary))
      );
      color: var(--mat-sys-on-primary);
      font: var(--mat-sys-headline-medium);
      font-weight: 700;
    }

    .profile-copy {
      display: grid;
      gap: var(--space-2);
      min-width: 0;
    }

    .profile-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .profile-actions a,
    .profile-actions button {
      display: inline-flex;
      gap: var(--space-2);
    }

    .profile-metadata {
      margin: 0;
    }

    .profile-metadata dd {
      margin: 0;
    }

    .permissions-list {
      display: grid;
      gap: var(--space-3);
    }

    .permission-item {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4);
      border: 1px solid color-mix(in srgb, var(--app-border) 72%, transparent);
      border-radius: var(--radius-md);
      background: color-mix(in srgb, var(--mat-sys-surface-container-low) 55%, aliceblue);
    }

    .permission-item--allowed {
      border-color: color-mix(in srgb, var(--mat-sys-primary) 24%, white);
      background: color-mix(in srgb, var(--mat-sys-primary-container) 36%, white);
    }

    .permission-icon {
      display: inline-grid;
      place-items: center;
      color: var(--app-text-muted);
    }

    .permission-item--allowed .permission-icon {
      color: var(--mat-sys-primary);
    }

    .permission-copy {
      display: grid;
      gap: 0.2rem;
      min-width: 0;
    }

    .permission-label {
      color: var(--app-text);
      font: var(--mat-sys-title-small);
    }

    .permission-description {
      color: var(--app-text-muted);
      font: var(--mat-sys-body-medium);
    }

    .permission-status {
      justify-self: end;
      color: var(--app-text-muted);
      font: var(--mat-sys-label-large);
    }

    .permission-item--allowed .permission-status {
      color: var(--mat-sys-primary);
    }

    @media (max-width: 640px) {
      .profile-actions {
        width: 100%;
      }

      .profile-actions a,
      .profile-actions button {
        flex: 1 1 12rem;
        justify-content: center;
      }

      .permission-item {
        grid-template-columns: auto minmax(0, 1fr);
      }

      .permission-status {
        grid-column: 2;
        justify-self: start;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  protected readonly securityService = inject(SecurityService);

  protected readonly userConnected = this.securityService.user;

  protected readonly permissions = computed(() => {
    const isConnected = this.securityService.isConnected();
    const isAdmin = isConnected && this.userConnected().admin;

    return [
      {
        label: 'Consulter l annuaire',
        description: 'Voir la liste des personnes et utiliser la recherche.',
        allowed: isConnected,
      },
      {
        label: 'Consulter une fiche',
        description: 'Ouvrir le detail complet d une personne.',
        allowed: isConnected,
      },
      {
        label: 'Creer une personne',
        description: 'Ajouter une nouvelle fiche dans l annuaire.',
        allowed: isAdmin,
      },
      {
        label: 'Modifier une personne',
        description: 'Editer les informations d une fiche existante.',
        allowed: isAdmin,
      },
      {
        label: 'Supprimer une personne',
        description: 'Retirer definitivement une fiche apres confirmation.',
        allowed: isAdmin,
      },
    ];
  });

  protected displayName(): string {
    const user = this.userConnected();
    const fullName = [user.firstname, user.lastname].filter(Boolean).join(' ');

    return fullName || 'Profil utilisateur';
  }

  protected initials(): string {
    const user = this.userConnected();
    const initials = [user.firstname, user.lastname]
      .filter(Boolean)
      .map((part) => part?.charAt(0).toUpperCase())
      .join('');

    return initials || 'PU';
  }
}

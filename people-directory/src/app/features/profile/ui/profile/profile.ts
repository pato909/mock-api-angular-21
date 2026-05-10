import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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

    @media (max-width: 640px) {
      .profile-actions {
        width: 100%;
      }

      .profile-actions a,
      .profile-actions button {
        flex: 1 1 12rem;
        justify-content: center;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  protected readonly securityService = inject(SecurityService);

  protected readonly userConnected = this.securityService.user;

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

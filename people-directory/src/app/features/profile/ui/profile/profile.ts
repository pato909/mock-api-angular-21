import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SecurityService } from '../../../../core/security/security.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  imports: [MatButton, MatDivider, MatIcon, RouterLink, UpperCasePipe, TranslatePipe],
  template: `
    @if (userConnected(); as user) {
      <section class="page-section">
        <div class="page-hero profile-hero">
          <div class="profile-identity">
            <div class="profile-avatar" aria-hidden="true">
              {{ initials() }}
            </div>

            <div class="profile-copy">
              <span class="page-eyebrow">{{ 'profile.eyebrow' | translate }}</span>
              <h1 class="page-title">
                {{ displayName() || ('profile.fallbackName' | translate) }}
              </h1>
              <p class="page-subtitle">
                {{ 'profile.subtitle' | translate }}
              </p>
            </div>
          </div>

          <div
            class="profile-actions"
            role="group"
            [attr.aria-label]="'profile.actionsLabel' | translate"
          >
            <a mat-flat-button routerLink="/persons">
              <mat-icon aria-hidden="true">groups</mat-icon>
              {{ 'common.directory' | translate }}
            </a>

            <button mat-button type="button" (click)="securityService.logout()">
              <mat-icon aria-hidden="true">logout</mat-icon>
              {{ 'app.nav.logout' | translate }}
            </button>
          </div>
        </div>

        <section class="page-panel">
          <div class="section-header">
            <div class="page-section">
              <span class="page-eyebrow">{{ 'profile.identity' | translate }}</span>
              <h2 class="section-title">{{ 'profile.mainInformation' | translate }}</h2>
            </div>
          </div>

          <div class="page-info-grid">
            <div class="page-info-card">
              <span class="page-info-label">{{ 'common.firstName' | translate }}</span>
              <span class="page-info-value">{{
                user.firstname || ('common.notFilled' | translate)
              }}</span>
            </div>

            <div class="page-info-card">
              <span class="page-info-label">{{ 'common.lastName' | translate }}</span>
              <span class="page-info-value">{{
                user.lastname || ('common.notFilled' | translate)
              }}</span>
            </div>

            <div class="page-info-card">
              <span class="page-info-label">{{ 'common.language' | translate }}</span>
              <span class="page-info-value">{{ user.locale | uppercase }}</span>
            </div>
          </div>
        </section>

        <section class="page-panel" aria-labelledby="permissions-title">
          <div class="section-header">
            <div class="page-section">
              <span class="page-eyebrow">{{ 'profile.permissions' | translate }}</span>
              <h2 id="permissions-title" class="section-title">
                {{ 'profile.availableActions' | translate }}
              </h2>
            </div>
          </div>

          <div class="permissions-list" role="list">
            @for (permission of permissions(); track permission.labelKey) {
              <div
                class="permission-item"
                role="listitem"
                [class.permission-item--allowed]="permission.allowed"
              >
                <span class="permission-icon" aria-hidden="true">
                  <mat-icon>{{ permission.allowed ? 'check_circle' : 'block' }}</mat-icon>
                </span>

                <span class="permission-copy">
                  <span class="permission-label">{{ permission.labelKey | translate }}</span>
                  <span class="permission-description">{{
                    permission.descriptionKey | translate
                  }}</span>
                </span>

                <span class="permission-status">
                  {{
                    (permission.allowed ? 'common.authorized' : 'common.notAuthorized') | translate
                  }}
                </span>
              </div>
            }
          </div>
        </section>

        <section class="page-panel page-panel--quiet" aria-labelledby="security-title">
          <div class="section-header">
            <div class="page-section">
              <span class="page-eyebrow">{{ 'common.security' | translate }}</span>
              <h2 id="security-title" class="section-title">
                {{ 'profile.securityTitle' | translate }}
              </h2>
            </div>
          </div>

          <mat-divider />

          <dl class="page-info-grid profile-metadata">
            <div class="page-info-card">
              <dt class="page-info-label">{{ 'common.status' | translate }}</dt>
              <dd class="page-info-value">
                {{ (user.connected ? 'profile.connected' : 'profile.disconnected') | translate }}
              </dd>
            </div>

            <div class="page-info-card">
              <dt class="page-info-label">{{ 'common.role' | translate }}</dt>
              <dd class="page-info-value">
                {{ (user.admin ? 'profile.administrator' : 'profile.user') | translate }}
              </dd>
            </div>

            <div class="page-info-card">
              <dt class="page-info-label">NISS</dt>
              <dd class="page-info-value">{{ user.ssin || ('common.notFilled' | translate) }}</dd>
            </div>

            <div class="page-info-card">
              <dt class="page-info-label">BCE</dt>
              <dd class="page-info-value">{{ user.bce || ('common.notFilled' | translate) }}</dd>
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
    return [
      {
        labelKey: 'profile.permissionsList.directory.label',
        descriptionKey: 'profile.permissionsList.directory.description',
        allowed: this.securityService.canViewDirectory(),
      },
      {
        labelKey: 'profile.permissionsList.detail.label',
        descriptionKey: 'profile.permissionsList.detail.description',
        allowed: this.securityService.canViewPerson(),
      },
      {
        labelKey: 'profile.permissionsList.create.label',
        descriptionKey: 'profile.permissionsList.create.description',
        allowed: this.securityService.canCreatePerson(),
      },
      {
        labelKey: 'profile.permissionsList.edit.label',
        descriptionKey: 'profile.permissionsList.edit.description',
        allowed: this.securityService.canEditPerson(),
      },
      {
        labelKey: 'profile.permissionsList.delete.label',
        descriptionKey: 'profile.permissionsList.delete.description',
        allowed: this.securityService.canDeletePerson(),
      },
    ];
  });

  protected displayName(): string {
    const user = this.userConnected();
    const fullName = [user.firstname, user.lastname].filter(Boolean).join(' ');

    return fullName;
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

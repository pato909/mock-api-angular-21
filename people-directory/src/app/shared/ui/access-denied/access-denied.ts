import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-access-denied',
  imports: [MatButton, MatIcon, RouterLink, TranslatePipe],
  template: `
    <section class="page-section">
      <div class="page-hero access-hero">
        <div class="status-icon" aria-hidden="true">
          <mat-icon>lock</mat-icon>
        </div>

        <div class="status-copy">
          <span class="page-eyebrow">{{ 'accessDenied.eyebrow' | translate }}</span>
          <h1 class="page-title">{{ 'accessDenied.title' | translate }}</h1>
          <p class="page-subtitle">
            {{ 'accessDenied.message' | translate }}
          </p>
        </div>

        <div
          class="status-actions"
          role="group"
          [attr.aria-label]="'accessDenied.navigationLabel' | translate"
        >
          <a mat-flat-button routerLink="/persons">
            <mat-icon aria-hidden="true">groups</mat-icon>
            {{ 'common.directory' | translate }}
          </a>

          <a mat-button routerLink="/">
            <mat-icon aria-hidden="true">home</mat-icon>
            {{ 'common.backHome' | translate }}
          </a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .access-hero {
      align-items: start;
      background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--mat-sys-error-container) 64%, white),
        color-mix(in srgb, var(--mat-sys-surface) 88%, white)
      );
    }

    .status-icon {
      display: grid;
      place-items: center;
      width: 4rem;
      height: 4rem;
      border: 1px solid color-mix(in srgb, var(--mat-sys-error) 20%, white);
      border-radius: 1.25rem;
      background: color-mix(in srgb, var(--mat-sys-error-container) 72%, white);
      color: var(--mat-sys-error);
    }

    .status-icon mat-icon {
      width: 2rem;
      height: 2rem;
      font-size: 2rem;
    }

    .status-copy {
      display: grid;
      gap: var(--space-3);
    }

    .status-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .status-actions a {
      display: inline-flex;
      gap: var(--space-2);
    }

    @media (max-width: 640px) {
      .status-actions {
        width: 100%;
      }

      .status-actions a {
        flex: 1 1 12rem;
        justify-content: center;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessDeniedComponent {}

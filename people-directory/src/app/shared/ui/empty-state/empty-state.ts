import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-empty-state',
  imports: [MatButtonModule, MatCardModule, TranslatePipe],
  template: `
    <mat-card class="state-card">
      <mat-card-content class="state-layout">
        <span class="state-kicker">{{ kicker() | translate }}</span>

        <div class="state-copy">
          <h3>{{ title() | translate }}</h3>
          <p>{{ message() | translate }}</p>
        </div>

        @if (actionLabel()) {
          <button mat-flat-button type="button" (click)="action.emit()">
            {{ actionLabel() | translate }}
          </button>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .state-card {
      border-radius: var(--radius-md);
      border: 1px solid var(--app-border);
      background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--mat-sys-secondary-container) 72%, white),
        var(--app-surface)
      );
      box-shadow: none;
    }

    .state-layout {
      display: grid;
      gap: var(--space-4);
      justify-items: start;
      padding: var(--space-6);
    }

    .state-kicker {
      color: var(--mat-sys-primary);
      font: var(--mat-sys-label-large);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .state-copy {
      display: grid;
      gap: var(--space-2);
    }

    h3 {
      font: var(--mat-sys-title-large);
      color: var(--app-text);
    }

    p {
      color: var(--app-text-muted);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  readonly kicker = input('state.empty.kicker');
  readonly title = input('state.empty.title');
  readonly message = input('state.empty.message');
  readonly actionLabel = input('');
  readonly action = output<void>();
}

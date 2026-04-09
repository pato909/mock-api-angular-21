import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-empty-state',
  imports: [MatButtonModule, MatCardModule],
  template: `
    <mat-card class="state-card">
      <mat-card-content class="state-layout">
        <span class="state-kicker">{{ kicker() }}</span>

        <div class="state-copy">
          <h3>{{ title() }}</h3>
          <p>{{ message() }}</p>
        </div>

        @if (actionLabel()) {
          <button mat-flat-button type="button" (click)="action.emit()">
            {{ actionLabel() }}
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
  readonly kicker = input('Empty state');
  readonly title = input('Nothing to display');
  readonly message = input('Content will appear here once data is available.');
  readonly actionLabel = input('');
  readonly action = output<void>();
}

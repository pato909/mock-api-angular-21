import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-error-state',
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
          <button mat-stroked-button type="button" (click)="retry.emit()">
            {{ actionLabel() }}
          </button>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .state-card {
      border-radius: var(--radius-md);
      border: 1px solid color-mix(in srgb, var(--mat-sys-error) 22%, white);
      background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--mat-sys-error-container) 68%, white),
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
      color: var(--mat-sys-error);
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
export class ErrorStateComponent {
  readonly kicker = input('Error state');
  readonly title = input('Something went wrong');
  readonly message = input('Please retry or return later.');
  readonly actionLabel = input('');
  readonly retry = output<void>();
}

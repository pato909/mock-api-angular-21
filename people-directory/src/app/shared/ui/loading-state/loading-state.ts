import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-state',
  imports: [MatCardModule, MatProgressSpinnerModule],
  template: `
    <mat-card class="state-card">
      <mat-card-content class="state-layout">
        <mat-progress-spinner
          mode="indeterminate"
          diameter="40"
          strokeWidth="4"
          aria-label="Loading content"
        />

        <div class="state-copy">
          <h3>{{ title() }}</h3>
          <p>{{ message() }}</p>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .state-card {
      border-radius: var(--radius-md);
      border: 1px solid var(--app-border);
      background: var(--app-surface);
      box-shadow: none;
    }

    .state-layout {
      display: flex;
      align-items: center;
      gap: var(--space-5);
      padding: var(--space-6);
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
export class LoadingStateComponent {
  readonly title = input('Loading');
  readonly message = input('Please wait while the content is prepared.');
}

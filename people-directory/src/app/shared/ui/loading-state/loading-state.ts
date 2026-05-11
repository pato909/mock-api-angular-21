import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-loading-state',
  imports: [MatCardModule, MatProgressSpinnerModule, TranslatePipe],
  template: `
    <mat-card class="state-card">
      <mat-card-content class="state-layout">
        <mat-progress-spinner
          mode="indeterminate"
          diameter="40"
          strokeWidth="4"
          [attr.aria-label]="'common.loadingContent' | translate"
        />

        <div class="state-copy">
          <h3>{{ title() | translate }}</h3>
          <p>{{ message() | translate }}</p>
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
  readonly title = input('state.loading.title');
  readonly message = input('state.loading.message');
}

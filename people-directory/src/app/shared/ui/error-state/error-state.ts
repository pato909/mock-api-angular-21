import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-error-state',
  imports: [MatButtonModule, MatCardModule, TranslatePipe],
  template: `
    <div
      class="border border-gray-200 rounded-xl p-6 bg-white shadow-sm flex flex-col items-center gap-4 text-center"
    >
      <span class="text-sm font-medium text-gray-400 uppercase tracking-wide">
        {{ kicker() | translate }}
      </span>

      <div class="flex flex-col gap-1">
        <h3 class="text-base font-medium text-gray-700">{{ title() | translate }}</h3>
        <p class="text-sm text-gray-400">{{ message() | translate }}</p>
      </div>

      @if (actionLabel()) {
        <button mat-stroked-button type="button" (click)="retry.emit()">
          {{ actionLabel() | translate }}
        </button>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorStateComponent {
  readonly kicker = input('state.error.kicker');
  readonly title = input('state.error.title');
  readonly message = input('state.error.message');
  readonly actionLabel = input('');
  readonly retry = output<void>();
}

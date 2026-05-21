import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-loading-state',
  imports: [MatCardModule, MatProgressSpinnerModule, TranslatePipe],
  template: `
    <div class="border border-gray-200 rounded-xl p-6 bg-white shadow-sm flex items-center gap-4">
      <mat-progress-spinner
        mode="indeterminate"
        diameter="40"
        strokeWidth="4"
        [attr.aria-label]="'common.loadingContent' | translate"
      />

      <div class="flex flex-col gap-1">
        <h3 class="text-base font-medium text-gray-700">{{ title() | translate }}</h3>
        <p class="text-sm text-gray-400">{{ message() | translate }}</p>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingStateComponent {
  readonly title = input('state.loading.title');
  readonly message = input('state.loading.message');
}

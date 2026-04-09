import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoadingStateComponent } from '../../../../shared/ui/loading-state/loading-state';

@Component({
  selector: 'app-person-create-page',
  imports: [LoadingStateComponent],
  template: `
    <section class="page-section">
      <span class="page-eyebrow">Create foundation</span>
      <h1 class="section-title">Create person page placeholder</h1>
      <p class="section-copy">
        F06 will replace this with the real reactive form, but the submit/loading feedback style is
        already standardized.
      </p>

      <app-loading-state
        title="Form foundation ready"
        message="This shared component can later represent submission or initial edit-page loading."
      />
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonCreatePage {}

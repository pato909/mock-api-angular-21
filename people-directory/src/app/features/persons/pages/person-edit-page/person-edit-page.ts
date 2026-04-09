import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ErrorStateComponent } from '../../../../shared/ui/error-state/error-state';

@Component({
  selector: 'app-person-edit-page',
  imports: [ErrorStateComponent],
  template: `
    <section class="page-section">
      <span class="page-eyebrow">Edit foundation</span>
      <h1 class="section-title">Edit person page placeholder</h1>
      <p class="section-copy">
        F07 and F10 will connect this route to not-found and inline error handling, using the same
        shared presentation language.
      </p>

      <app-error-state
        kicker="Not-found and errors"
        title="Edit route states can now stay consistent"
        message="The shared error pattern is ready for not-found and failed read scenarios."
        actionLabel="Back to directory"
      />
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonEditPage {}

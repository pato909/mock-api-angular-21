import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state';
import { ErrorStateComponent } from '../../../../shared/ui/error-state/error-state';
import { LoadingStateComponent } from '../../../../shared/ui/loading-state/loading-state';

@Component({
  selector: 'app-persons-list-page',
  imports: [MatButtonModule, EmptyStateComponent, ErrorStateComponent, LoadingStateComponent],
  template: `
    <section class="page-section">
      <div class="page-hero">
        <span class="page-eyebrow">F02 shared foundations</span>
        <h1 class="page-title">People pages now have a Material-ready visual base.</h1>
        <p class="page-subtitle">
          This route acts as a small showcase for the reusable UI patterns we will plug into the
          list, detail and form flows in the next features.
        </p>

        <div class="badge-row">
          <span class="app-chip">Light Material 3</span>
          <span class="app-chip">Shared tokens</span>
          <span class="app-chip">Accessible focus</span>
        </div>
      </div>

      <div class="section-header">
        <div class="page-section">
          <h2 class="section-title">Reusable states</h2>
          <p class="section-copy">
            These components are shared foundations, not page-specific hacks. Later pages can reuse
            them without redefining layout, tone or actions.
          </p>
        </div>

        <button mat-stroked-button type="button">MatTable arrives in F04</button>
      </div>

      <div class="page-grid">
        <app-loading-state
          title="Loading persons"
          message="A shared loading pattern is ready for list and detail reads."
        />

        <app-empty-state
          kicker="Empty state"
          title="No people match the current view"
          message="The list page will reuse this layout when server-side search returns no result."
          actionLabel="Create first person"
        />

        <app-error-state
          kicker="Error state"
          title="The request could not be completed"
          message="This variant is meant for page-level read errors with a retry action."
          actionLabel="Retry later"
        />
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonsListPage {}

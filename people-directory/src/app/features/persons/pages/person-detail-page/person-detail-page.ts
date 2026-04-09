import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-person-detail-page',
  imports: [MatCardModule],
  template: `
    <section class="page-section">
      <div class="section-header">
        <div class="page-section">
          <span class="page-eyebrow">Detail foundation</span>
          <h1 class="section-title">Person detail page placeholder</h1>
          <p class="section-copy">
            F05 will plug real data into this route, but the shared theme tokens and surface styles
            are already in place.
          </p>
        </div>
      </div>

      <mat-card class="surface-card detail-card">
        <mat-card-content>
          <p>
            The detail screen will reuse the same surfaces, border treatment, spacing tokens and
            focus behavior introduced in F02.
          </p>
        </mat-card-content>
      </mat-card>
    </section>
  `,
  styles: `
    .detail-card {
      overflow: hidden;
    }

    mat-card-content {
      padding: var(--space-6);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonDetailPage {}

import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

type AvatarVariant = 'list' | 'detail';

@Component({
  selector: 'app-person-avatar',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="person-avatar" [class.person-avatar--detail]="variant() === 'detail'">
      @if (!imageFailed()) {
        <img
          class="person-avatar__image"
          [src]="avatar()"
          [alt]="accessibleLabel()"
          (error)="markImageAsFailed()"
        />
      } @else {
        <span class="person-avatar__fallback" role="img" [attr.aria-label]="accessibleLabel()">
          {{ initials() }}
        </span>
      }
    </span>
  `,
  styles: `
    .person-avatar {
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 999px;
    }
    .person-avatar--detail {
      width: clamp(7rem, 18vw, 10rem);
      height: clamp(7rem, 18vw, 10rem);
    }
    .person-avatar {
      display: inline-grid;
      place-items: center;
      overflow: hidden;
      border: 2px solid color-mix(in srgb, var(--mat-sys-secondary-container) 55%, white);
      background: color-mix(in srgb, var(--mat-sys-secondary-container) 38%, white);
    }
    .person-avatar__image,
    .person-avatar__fallback {
      width: 100%;
      height: 100%;
    }

    .person-avatar__image {
      display: block;
      object-fit: cover;
    }

    .person-avatar__fallback {
      display: inline-grid;
      place-items: center;
      font-weight: 700;
    }
    .person-avatar--detail .person-avatar__fallback {
      font-size: clamp(2rem, 5vw, 3rem);
    }
  `,
})
export class PersonAvatar {
  readonly firstName = input.required<string>();
  readonly lastName = input.required<string>();
  readonly avatar = input.required<string>();
  readonly variant = input<AvatarVariant>('list');

  private readonly failedAvatarUrl = signal<string | null>(null);

  initials = computed(() => {
    const firstName = this.firstName().trim();
    const lastName = this.lastName().trim();

    if (!firstName && !lastName) return '?';
    const firstInitial = firstName ? firstName.charAt(0).toLocaleUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toLocaleUpperCase() : '';

    return `${firstInitial}${lastInitial}`;
  });

  readonly imageFailed = computed(() => this.failedAvatarUrl() === this.avatar());

  markImageAsFailed(): void {
    this.failedAvatarUrl.set(this.avatar());
  }

  readonly accessibleLabel = computed(() =>
    `Avatar de ${this.firstName().trim()} ${this.lastName().trim()}`.trim(),
  );
}

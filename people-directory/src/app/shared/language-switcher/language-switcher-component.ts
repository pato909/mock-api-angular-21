import { Component, inject } from '@angular/core';
import { LanguageService } from '../../core/language/language.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  imports: [TranslatePipe],
  template: `
    <div class="language-switcher" [attr.aria-label]="'language.selection' | translate">
      <button
        type="button"
        class="language-switcher__link"
        [class.language-switcher__link--active]="activeLanguage() === 'fr'"
        [disabled]="activeLanguage() === 'fr'"
        (click)="useLanguage('fr')"
      >
        FR
      </button>

      <span class="language-switcher__separator" aria-hidden="true">·</span>

      <button
        type="button"
        class="language-switcher__link"
        [class.language-switcher__link--active]="activeLanguage() === 'en'"
        [disabled]="activeLanguage() === 'en'"
        (click)="useLanguage('en')"
      >
        EN
      </button>
    </div>
  `,
  styles: `
    .language-switcher {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.875rem;
      line-height: 1;
    }

    .language-switcher__link {
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--mat-sys-primary);
      cursor: pointer;
      font: inherit;
      font-weight: 500;
      letter-spacing: 0;
      text-decoration: none;
    }

    .language-switcher__link:hover:not(:disabled) {
      color: color-mix(in srgb, var(--mat-sys-primary) 82%, black);
      text-decoration: underline;
      text-underline-offset: 0.18em;
    }

    .language-switcher__link:focus-visible {
      outline: 2px solid var(--mat-sys-primary);
      outline-offset: 3px;
      border-radius: 0.125rem;
    }

    .language-switcher__link--active,
    .language-switcher__link:disabled {
      color: var(--app-text);
      cursor: default;
      font-weight: 700;
      text-decoration: none;
    }

    .language-switcher__separator {
      color: var(--app-text-muted);
      font-size: 0.8rem;
    }
  `,
})
export class LanguageSwitcherComponent {
  private readonly languageService = inject(LanguageService);
  readonly activeLanguage = this.languageService.activeLanguage;

  useLanguage(language: 'fr' | 'en'): void {
    this.languageService.use(language);
  }
}

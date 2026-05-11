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
        {{ 'language.fr' | translate }}
      </button>

      <span class="language-switcher__separator" aria-hidden="true">|</span>

      <button
        type="button"
        class="language-switcher__link"
        [class.language-switcher__link--active]="activeLanguage() === 'en'"
        [disabled]="activeLanguage() === 'en'"
        (click)="useLanguage('en')"
      >
        {{ 'language.en' | translate }}
      </button>
    </div>
  `,
  styles: `
    .language-switcher {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.875rem;
      margin-left: 100px;
    }

    .language-switcher__link {
      padding: 0;
      border: 0;
      background: transparent;
      color: #2563eb;
      cursor: pointer;
      font: inherit;
      text-decoration: underline;
      text-underline-offset: 0.15em;
    }

    .language-switcher__link:hover:not(:disabled) {
      color: #1d4ed8;
    }

    .language-switcher__link:focus-visible {
      outline: 2px solid #2563eb;
      outline-offset: 3px;
      border-radius: 0.125rem;
    }

    .language-switcher__link--active,
    .language-switcher__link:disabled {
      color: #475569;
      cursor: default;
      font-weight: 600;
      text-decoration: none;
    }

    .language-switcher__separator {
      color: #cbd5e1;
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

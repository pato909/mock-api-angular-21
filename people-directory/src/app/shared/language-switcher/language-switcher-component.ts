import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LanguageService } from '../../core/language/language.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe],
  template: `
    <div class="flex items-center gap-1" [attr.aria-label]="'language.selection' | translate">
      <button
        type="button"
        class="cursor-pointer px-2 py-1 text-sm font-medium rounded transition-colors"
        [class.text-gray-800]="activeLanguage() === 'fr'"
        [class.font-semibold]="activeLanguage() === 'fr'"
        [class.text-gray-400]="activeLanguage() !== 'fr'"
        [class.hover:text-gray-600]="activeLanguage() !== 'fr'"
        [disabled]="activeLanguage() === 'fr'"
        (click)="useLanguage('fr')"
      >
        FR
      </button>

      <span class="text-gray-300" aria-hidden="true">·</span>

      <button
        type="button"
        class="cursor-pointer px-2 py-1 text-sm font-medium rounded transition-colors"
        [class.text-gray-800]="activeLanguage() === 'en'"
        [class.font-semibold]="activeLanguage() === 'en'"
        [class.text-gray-400]="activeLanguage() !== 'en'"
        [class.hover:text-gray-600]="activeLanguage() !== 'en'"
        [disabled]="activeLanguage() === 'en'"
        (click)="useLanguage('en')"
      >
        EN
      </button>
    </div>
  `,
  styles: ``,
})
export class LanguageSwitcherComponent {
  private readonly languageService = inject(LanguageService);
  readonly activeLanguage = this.languageService.activeLanguage;

  useLanguage(language: 'fr' | 'en'): void {
    this.languageService.use(language);
  }
}

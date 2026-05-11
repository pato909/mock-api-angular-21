import { computed, inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

type SupportedLanguage = 'fr' | 'en';


@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translate = inject(TranslateService);

  private readonly supportedLanguages: SupportedLanguage[] = ['fr', 'en'];
  private readonly defaultLanguage: SupportedLanguage = 'fr';
  private readonly storageKey = 'language';

  private readonly currentLanguage = signal<SupportedLanguage>(this.defaultLanguage);
  readonly activeLanguage = computed(() => this.currentLanguage());

  init(): void {
    this.translate.addLangs(this.supportedLanguages);
    this.translate.setFallbackLang(this.defaultLanguage);

    const language = this.resolveInitialLanguage();

    this.currentLanguage.set(language);
    this.translate.use(language);
  }

  use(language: SupportedLanguage): void {
    localStorage.setItem(this.storageKey, language);
    this.currentLanguage.set(language);
    this.translate.use(language);
  }

  private resolveInitialLanguage(): SupportedLanguage {
    const savedLanguage = localStorage.getItem(this.storageKey);

    if (this.isSupportedLanguage(savedLanguage)) {
      return savedLanguage;
    }

    return this.defaultLanguage;
  }

  private isSupportedLanguage(language: string | null | undefined): language is SupportedLanguage {
    return language === 'fr' || language === 'en';
  }
}

import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SecurityService } from '../security/security.service';

type SupportedLanguage = 'fr' | 'en';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly securityService = inject(SecurityService);

  private readonly supportedLanguages: SupportedLanguage[] = ['fr', 'en'];
  private readonly defaultLanguage: SupportedLanguage = 'fr';
  private readonly storageKey = 'language';
  private readonly initialized = signal(false);
  private readonly lastSyncedSessionLocale = signal<string | null>(null);

  private readonly currentLanguage = signal<SupportedLanguage>(this.defaultLanguage);
  readonly activeLanguage = computed(() => this.currentLanguage());

  constructor() {
    effect(() => {
      if (!this.initialized()) {
        return;
      }

      const user = this.securityService.user();

      if (!user.connected) {
        this.lastSyncedSessionLocale.set(null);
        return;
      }

      if (user.locale === this.lastSyncedSessionLocale()) {
        return;
      }

      this.lastSyncedSessionLocale.set(user.locale);
      this.applyLanguage(this.resolveSupportedLanguage(user.locale), true);
    });
  }

  init(): void {
    this.translate.addLangs(this.supportedLanguages);
    this.translate.setFallbackLang(this.defaultLanguage);

    const language = this.resolveInitialLanguage();

    this.applyLanguage(language, false);
    this.initialized.set(true);
  }

  use(language: SupportedLanguage): void {
    this.lastSyncedSessionLocale.set(this.securityService.user().connected ? this.securityService.user().locale : null);
    this.applyLanguage(language, true);
  }

  private applyLanguage(language: SupportedLanguage, persist: boolean): void {
    if (persist) {
      localStorage.setItem(this.storageKey, language);
    }

    this.currentLanguage.set(language);
    this.translate.use(language);
  }

  private resolveInitialLanguage(): SupportedLanguage {
    const sessionLanguage = this.resolveSessionLanguage();

    if (sessionLanguage) {
      return sessionLanguage;
    }

    const savedLanguage = localStorage.getItem(this.storageKey);

    if (this.isSupportedLanguage(savedLanguage)) {
      return savedLanguage;
    }

    return this.defaultLanguage;
  }

  private resolveSessionLanguage(): SupportedLanguage | null {
    const user = this.securityService.user();

    if (!user.connected) {
      return null;
    }

    return this.resolveSupportedLanguage(user.locale);
  }

  private resolveSupportedLanguage(language: string | null | undefined): SupportedLanguage {
    const normalizedLanguage = language?.trim().toLowerCase().replace('_', '-');

    if (normalizedLanguage?.startsWith('en')) {
      return 'en';
    }

    if (normalizedLanguage?.startsWith('fr')) {
      return 'fr';
    }

    return this.defaultLanguage;
  }

  private isSupportedLanguage(language: string | null | undefined): language is SupportedLanguage {
    return language === 'fr' || language === 'en';
  }
}

import '@angular/compiler';
import {
  Injector,
  runInInjectionContext,
  signal,
  ɵChangeDetectionScheduler as ChangeDetectionScheduler,
  ɵEffectScheduler as EffectScheduler,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageService } from './language.service';
import { SecurityService } from '../security/security.service';
import { AppUser } from '../security/app-user';

describe('LanguageService', () => {
  const createUser = (overrides: Partial<AppUser> = {}): AppUser =>
    Object.assign(new AppUser(), overrides);

  beforeEach(() => {
    vi.stubGlobal('localStorage', createStorageMock());
    localStorage.clear();
  });

  it('uses the connected session language during initialization', async () => {
    const { service, translate, scheduler } = createService(
      createUser({ connected: true, locale: 'en' }),
    );

    service.init();
    scheduler.flush();

    expect(service.activeLanguage()).toBe('en');
    expect(translate.use).toHaveBeenLastCalledWith('en');
  });

  it('falls back to the saved language when there is no connected session', async () => {
    localStorage.setItem('language', 'en');
    const { service, translate, scheduler } = createService(
      createUser({ connected: false, locale: 'nl' }),
    );

    service.init();
    scheduler.flush();

    expect(service.activeLanguage()).toBe('en');
    expect(translate.use).toHaveBeenLastCalledWith('en');
  });

  it('re-synchronizes when the session language changes after init', async () => {
    const { service, translate, user, scheduler } = createService(
      createUser({ connected: false, locale: 'nl' }),
    );

    service.init();
    scheduler.flush();

    user.set(createUser({ connected: true, locale: 'en' }));
    scheduler.flush();

    expect(service.activeLanguage()).toBe('en');
    expect(localStorage.getItem('language')).toBe('en');
    expect(translate.use).toHaveBeenLastCalledWith('en');
  });

  it('maps an unsupported session locale to the default application language', async () => {
    const { service, translate, scheduler } = createService(
      createUser({ connected: true, locale: 'nl-BE' }),
    );

    service.init();
    scheduler.flush();

    expect(service.activeLanguage()).toBe('fr');
    expect(translate.use).toHaveBeenLastCalledWith('fr');
  });
});

function createService(initialUser: AppUser) {
  const user = signal(initialUser);
  const translate = createTranslateServiceSpy();
  const scheduler = createEffectScheduler();
  const injector = Injector.create({
    providers: [
      { provide: TranslateService, useValue: translate },
      { provide: SecurityService, useValue: { user: user.asReadonly() } },
      {
        provide: ChangeDetectionScheduler,
        useValue: { notify: vi.fn(), runningTick: false },
      },
      { provide: EffectScheduler, useValue: scheduler },
    ],
  });

  const service = runInInjectionContext(injector, () => new LanguageService());

  return { service, translate, user, scheduler };
}

function createTranslateServiceSpy() {
  return {
    addLangs: vi.fn(),
    setFallbackLang: vi.fn(),
    use: vi.fn(),
  };
}

function createStorageMock(): Storage {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key: string) => store.get(key) ?? null,
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => {
      store.delete(key);
    },
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
  };
}

function createEffectScheduler() {
  const queue = new Set<{ dirty: boolean; run: () => void }>();

  return {
    add: (effect: { dirty: boolean; run: () => void }) => {
      queue.add(effect);
    },
    schedule: vi.fn(),
    remove: (effect: { dirty: boolean; run: () => void }) => {
      queue.delete(effect);
    },
    flush: () => {
      for (const effect of Array.from(queue)) {
        if (effect.dirty) {
          effect.run();
        }
      }
    },
  };
}

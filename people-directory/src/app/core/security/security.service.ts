import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { AuthConfig, OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { AppUser } from './app-user';
import { ScopeEnum } from './scope.enum';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly oauthService = inject(OAuthService);
  private readonly router = inject(Router);

  SCOPES = [ScopeEnum.OPEN_ID, ScopeEnum.PROFILE, ScopeEnum.SCOPE_EID];

  private readonly anonymousUser: AppUser = {
    connected: false,
    admin: false,
    locale: 'nl',
  };

  private readonly _user = signal<AppUser>(this.anonymousUser);
  readonly user = this._user.asReadonly();

  readonly isConnected: Signal<boolean> = computed(
    () => this.user().connected && this.oauthService.hasValidAccessToken(),
  );

  private readonly authConfig = new AuthConfig({
    issuer: 'https://oauth-v5-mock-proxy.int.socialsecurity.be', // => https://oauth-v5-mock.int.socialsecurity.be/.well-known/openid-configuration
    strictDiscoveryDocumentValidation: false, //all endpoint in wellknown are not in same domain
    redirectUri: 'http://localhost:4200',
    clientId: 'demo:oauth2:angular:authorizationcode',
    responseType: 'code',
    showDebugInformation: false,
    scope: this.SCOPES.join(' '),
    postLogoutRedirectUri: 'http://localhost:4200',
  });

  constructor() {
    this.oauthService.configure(this.authConfig);
    this.oauthService.setupAutomaticSilentRefresh();
    this.watchOAuthEvents();
  }

  /**
   * Initiates the login process.
   * It first loads the discovery document and tries to log in using the current URL state (e.g., handling redirect callbacks).
   * If a valid access token is found, it builds and sets the user profile.
   * Otherwise, it triggers the OAuth2 authorization code flow, redirecting the user to the identity provider's login page.
   */
  async login(): Promise<void> {
    const currentPath = window.location.pathname;

    await this.oauthService.loadDiscoveryDocumentAndTryLogin();

    this.syncUserFromToken();

    if (this.oauthService.hasValidAccessToken()) {
      const state = this.oauthService.state;

      if (state && state !== '/') {
        await this.router.navigateByUrl(decodeURIComponent(state));
      }

      return;
    }

    if (currentPath !== '/') {
      this.oauthService.initCodeFlow(currentPath);
      return new Promise(() => {});
    }
  }

  forceLogin() {
    this.oauthService.initCodeFlow();
  }

  logout() {
    this.resetUser();
    this.oauthService.logOut();
  }

  private watchOAuthEvents(): void {
    this.oauthService.events
      .pipe(
        filter((event: OAuthEvent) =>
          [
            'token_received',
            'silently_refreshed',
            'token_refresh_error',
            'silent_refresh_error',
            'session_terminated',
            'session_error',
            'logout',
          ].includes(event.type),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        switch (event.type) {
          case 'token_received':
          case 'silently_refreshed':
            this.syncUserFromToken();
            break;

          default:
            this.resetUser();
            break;
        }
      });
  }

  private syncUserFromToken(): void {
    if (this.oauthService.hasValidAccessToken()) {
      this._user.set(this.buildUser());
      return;
    }

    this.resetUser();
  }

  private resetUser(): void {
    this._user.set({ ...this.anonymousUser });
  }

  private buildUser(): AppUser {
    const user = new AppUser();
    const identityClaims: unknown = this.oauthService.getIdentityClaims();

    if (isIdentityClaims(identityClaims)) {
      user.firstname = identityClaims.given_name;
      user.lastname = identityClaims.family_name;
      user.ssin = toOptionalNumber(identityClaims.social_security_identification_number);
      user.bce = toOptionalNumber(identityClaims.enterprise_number);
      user.connected = true;
      user.admin = this.hasScope(ScopeEnum.SCOPE_EID);
      user.locale = this.retrieveLanguageFromUrl() || 'nl';
    }

    return user;
  }

  retrieveLanguageFromUrl(): string | null {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('login.language');
  }

  // return all query param from url as Records
  private getQueryParams(): Record<string, string> {
    return Object.fromEntries(new URLSearchParams(window.location.search));
  }

  private hasScope(scope: ScopeEnum): boolean {
    return this.getGrantedScopes().includes(scope);
  }

  private getGrantedScopes(): string[] {
    const grantedScopes: unknown = this.oauthService.getGrantedScopes();

    if (Array.isArray(grantedScopes)) {
      return grantedScopes.filter((scope): scope is string => typeof scope === 'string');
    }

    if (typeof grantedScopes === 'string') {
      return grantedScopes.split(' ').filter(Boolean);
    }

    return [];
  }
}

interface IdentityClaims {
  given_name?: string;
  family_name?: string;
  social_security_identification_number?: string | number;
  enterprise_number?: string | number;
}

function isIdentityClaims(value: unknown): value is IdentityClaims {
  return typeof value === 'object' && value !== null;
}

function toOptionalNumber(value: string | number | undefined): number | undefined {
  if (value === undefined || value === '') {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

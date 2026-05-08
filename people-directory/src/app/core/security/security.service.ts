import {computed, Injectable, signal} from '@angular/core';
import {AuthConfig, OAuthService} from 'angular-oauth2-oidc';
import {AppUser} from './app-user';
import {ScopeEnum} from "./scope.enum";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  SCOPES = [
    ScopeEnum.OPEN_ID,
    ScopeEnum.PROFILE,
    ScopeEnum.SCOPE_EID
  ];

  private readonly _user = signal<AppUser>({connected: false, admin: false, locale: 'nl'});

  public readonly user = this._user.asReadonly();

  private authConfig = new AuthConfig({
    issuer: 'https://oauth-v5-mock-proxy.int.socialsecurity.be',  // => https://oauth-v5-mock.int.socialsecurity.be/.well-known/openid-configuration
    strictDiscoveryDocumentValidation: false,               //all endpoint in wellknown are not in same domain
    redirectUri: 'http://localhost:4200',
    clientId: 'demo:oauth2:angular:authorizationcode',
    responseType: 'code',
    showDebugInformation: true,
    scope: this.SCOPES.join(' '),
    postLogoutRedirectUri: 'https://www.socialsecurity.be'

  })

  constructor(private readonly oauthService: OAuthService, private readonly router: Router) {
    this.oauthService.configure(this.authConfig);
    this.oauthService.setupAutomaticSilentRefresh();
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

    if (this.oauthService.hasValidAccessToken()) {
      // Token valid, build the user
      //await new Promise(resolve => setTimeout(resolve, 3000));
      this._user.set(this.buildUser());

      const state = this.oauthService.state;
      if (state && state !== '/') {
        await this.router.navigateByUrl(decodeURIComponent(state));
      }

    } else if (currentPath != '/') {
      // Path protégé + pas de token → on redirige vers l'IdP et on bloque
      this.oauthService.initCodeFlow(currentPath);
      return new Promise(() => {}); // ← block rendering, redirect in progress
    }
  }


  forceLogin(){
    this.oauthService.initCodeFlow();
  }

  logout() {
    console.log('Logout');
    this.oauthService.logOut();
  }

  private buildUser(): AppUser {
    let user = new AppUser();
    const identityClaims: any = this.oauthService.getIdentityClaims();
    if (identityClaims) {
      console.log('Identity Claims:', identityClaims);
      user.firstname = identityClaims.given_name;
      user.lastname = identityClaims.family_name;
      user.ssin = identityClaims.social_security_identification_number;
      user.bce = +identityClaims.enterprise_number;
      user.connected = true;
      console.log('granted scopes : ' + this.oauthService.getGrantedScopes());
      user.admin = this.oauthService.getGrantedScopes().toString().includes(ScopeEnum.SCOPE_EID);
      user.locale = this.retrieveLanguageFromUrl() || 'nl';

    }
    console.log('build user with ssin ' + user.ssin);

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
}

import { Component, inject } from '@angular/core';
import { LanguageSwitcherComponent } from '../../language-switcher/language-switcher-component';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SecurityService } from '../../../core/security/security.service';

@Component({
  selector: 'app-header',
  imports: [LanguageSwitcherComponent, RouterLink, TranslatePipe],
  template: `
    <nav class="border-b border-gray-200 mb-3 px-6 py-3 flex items-center justify-between">
      <!-- Brand -->
      <a routerLink="/">
        <div class="flex items-center gap-3">
          <span class="font-bold text-lg">PD</span>
          <div class="flex flex-col leading-tight">
            <span class="font-semibold text-sm">{{ 'app.title' | translate }}</span>
            <span class="text-xs text-gray-400">{{ 'app.tagline' | translate }}</span>
          </div>
        </div>
      </a>

      <!-- Actions -->
      <div class="flex items-center gap-4 text-sm">
        <a routerLink="/persons" class="hover:text-blue-600 transition-colors">
          {{ 'app.nav.directory' | translate }}
        </a>

        @if (securityService.canCreatePerson()) {
          <a routerLink="/persons/new" class="hover:text-blue-600 transition-colors">
            {{ 'app.nav.newPerson' | translate }}
          </a>
        }

        @if (!securityService.isConnected()) {
          <button
            (click)="forceLogin()"
            class="cursor-pointer hover:text-blue-600 transition-colors"
          >
            {{ 'app.nav.login' | translate }}
          </button>
        } @else {
          <a routerLink="/profile" class="hover:text-blue-600 transition-colors">
            {{ securityService.user().firstname }} {{ securityService.user().lastname }}
          </a>
          <button
            (click)="securityService.logout()"
            class="cursor-pointer hover:text-red-500 transition-colors"
          >
            {{ 'app.nav.logout' | translate }}
          </button>
        }

        <app-language-switcher />
      </div>
    </nav>
  `,
  styles: ``,
})
export class Header {
  securityService = inject(SecurityService);

  protected forceLogin() {
    this.securityService.forceLogin();
  }
}

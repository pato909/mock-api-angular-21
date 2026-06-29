import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SecurityService } from '../core/security/security.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  imports: [MatIcon, RouterLink, UpperCasePipe, TranslatePipe],
  template: `
    @if (userConnected(); as user) {
      <div class="px-6 py-10 flex flex-col gap-8">
        <!-- Hero -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div class="flex items-center gap-4">
            <div
              class="w-14 h-14 rounded-full bg-gray-200 text-black flex items-center justify-center text-lg font-bold shrink-0"
            >
              {{ initials() }}
            </div>
            <div>
              <span class="text-xs font-semibold uppercase tracking-widest text-gray-400">{{
                'profile.eyebrow' | translate
              }}</span>
              <h1 class="text-2xl font-bold text-gray-900">
                {{ displayName() || ('profile.fallbackName' | translate) }}
              </h1>
              <p class="text-sm text-gray-500">{{ 'profile.subtitle' | translate }}</p>
            </div>
          </div>

          <div class="flex gap-3">
            <a
              routerLink="/persons"
              class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded border border-gray-300 text-sm font-medium transition-colors hover:bg-gray-200"
            >
              <mat-icon class="text-base" aria-hidden="true">groups</mat-icon>
              {{ 'common.directory' | translate }}
            </a>
            <button
              type="button"
              (click)="securityService.logout()"
              class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded border border-gray-300 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <mat-icon class="text-base" aria-hidden="true">logout</mat-icon>
              {{ 'app.nav.logout' | translate }}
            </button>
          </div>
        </div>

        <!-- Identity -->
        <div class="border border-gray-200 rounded-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <span class="text-xs font-semibold uppercase tracking-widest text-gray-400">{{
              'profile.identity' | translate
            }}</span>
            <h2 class="text-base font-semibold text-gray-900">
              {{ 'profile.mainInformation' | translate }}
            </h2>
          </div>
          <div
            class="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100"
          >
            <div class="px-6 py-4">
              <span class="text-xs text-gray-400 uppercase tracking-wide">{{
                'common.firstName' | translate
              }}</span>
              <p class="text-sm font-medium text-gray-900 mt-1">
                {{ user.firstname || ('common.notFilled' | translate) }}
              </p>
            </div>
            <div class="px-6 py-4">
              <span class="text-xs text-gray-400 uppercase tracking-wide">{{
                'common.lastName' | translate
              }}</span>
              <p class="text-sm font-medium text-gray-900 mt-1">
                {{ user.lastname || ('common.notFilled' | translate) }}
              </p>
            </div>
            <div class="px-6 py-4">
              <span class="text-xs text-gray-400 uppercase tracking-wide">{{
                'common.language' | translate
              }}</span>
              <p class="text-sm font-medium text-gray-900 mt-1">{{ user.locale | uppercase }}</p>
            </div>
          </div>
        </div>

        <!-- Permissions -->
        <div class="border border-gray-200 rounded-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <span class="text-xs font-semibold uppercase tracking-widest text-gray-400">{{
              'profile.permissions' | translate
            }}</span>
            <h2 class="text-base font-semibold text-gray-900">
              {{ 'profile.availableActions' | translate }}
            </h2>
          </div>
          <ul class="divide-y divide-gray-100">
            @for (permission of permissions(); track permission.labelKey) {
              <li class="flex items-center gap-4 px-6 py-4">
                <mat-icon
                  aria-hidden="true"
                  [class]="permission.allowed ? 'text-green-500' : 'text-red-400'"
                >
                  {{ permission.allowed ? 'check_circle' : 'block' }}
                </mat-icon>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">
                    {{ permission.labelKey | translate }}
                  </p>
                  <p class="text-xs text-gray-500">{{ permission.descriptionKey | translate }}</p>
                </div>
                <span
                  [class]="
                    permission.allowed
                      ? 'text-green-600 bg-green-50 border border-green-200'
                      : 'text-red-500 bg-red-50 border border-red-200'
                  "
                  class="text-xs font-medium px-2 py-1 rounded-full shrink-0"
                >
                  {{
                    (permission.allowed ? 'common.authorized' : 'common.notAuthorized') | translate
                  }}
                </span>
              </li>
            }
          </ul>
        </div>

        <!-- Security -->
        <div class="border border-gray-200 rounded-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <span class="text-xs font-semibold uppercase tracking-widest text-gray-400">{{
              'common.security' | translate
            }}</span>
            <h2 class="text-base font-semibold text-gray-900">
              {{ 'profile.securityTitle' | translate }}
            </h2>
          </div>
          <dl
            class="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100"
          >
            <div class="px-6 py-4">
              <dt class="text-xs text-gray-400 uppercase tracking-wide">
                {{ 'common.status' | translate }}
              </dt>
              <dd class="text-sm font-medium text-gray-900 mt-1">
                {{ (user.connected ? 'profile.connected' : 'profile.disconnected') | translate }}
              </dd>
            </div>
            <div class="px-6 py-4">
              <dt class="text-xs text-gray-400 uppercase tracking-wide">
                {{ 'common.role' | translate }}
              </dt>
              <dd class="text-sm font-medium text-gray-900 mt-1">
                {{ (user.admin ? 'profile.administrator' : 'profile.user') | translate }}
              </dd>
            </div>
            <div class="px-6 py-4 border-t border-gray-100">
              <dt class="text-xs text-gray-400 uppercase tracking-wide">NISS</dt>
              <dd class="text-sm font-medium text-gray-900 mt-1">
                {{ user.ssin || ('common.notFilled' | translate) }}
              </dd>
            </div>
            <div class="px-6 py-4 border-t border-gray-100">
              <dt class="text-xs text-gray-400 uppercase tracking-wide">BCE</dt>
              <dd class="text-sm font-medium text-gray-900 mt-1">
                {{ user.bce || ('common.notFilled' | translate) }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    }
  `,

  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  protected readonly securityService = inject(SecurityService);

  protected readonly userConnected = this.securityService.user;

  protected readonly permissions = computed(() => {
    return [
      {
        labelKey: 'profile.permissionsList.directory.label',
        descriptionKey: 'profile.permissionsList.directory.description',
        allowed: this.securityService.canViewDirectory(),
      },
      {
        labelKey: 'profile.permissionsList.detail.label',
        descriptionKey: 'profile.permissionsList.detail.description',
        allowed: this.securityService.canViewPerson(),
      },
      {
        labelKey: 'profile.permissionsList.create.label',
        descriptionKey: 'profile.permissionsList.create.description',
        allowed: this.securityService.canCreatePerson(),
      },
      {
        labelKey: 'profile.permissionsList.edit.label',
        descriptionKey: 'profile.permissionsList.edit.description',
        allowed: this.securityService.canEditPerson(),
      },
      {
        labelKey: 'profile.permissionsList.delete.label',
        descriptionKey: 'profile.permissionsList.delete.description',
        allowed: this.securityService.canDeletePerson(),
      },
    ];
  });

  protected displayName(): string {
    const user = this.userConnected();
    const fullName = [user.firstname, user.lastname].filter(Boolean).join(' ');

    return fullName;
  }

  protected initials(): string {
    const user = this.userConnected();
    const initials = [user.firstname, user.lastname]
      .filter(Boolean)
      .map((part) => part?.charAt(0).toUpperCase())
      .join('');

    return initials || 'PU';
  }
}

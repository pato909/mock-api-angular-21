import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-access-denied',
  imports: [MatButton, MatIcon, RouterLink, TranslatePipe],
  template: `
    <section class="flex justify-center items-center p-12">
      <div class="flex flex-col items-center gap-6 text-center max-w-md">
        <div aria-hidden="true" class="text-gray-400">
          <mat-icon class="text-5xl">lock</mat-icon>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-sm font-medium text-gray-400 uppercase tracking-wide">
            {{ 'accessDenied.eyebrow' | translate }}
          </span>
          <h1 class="text-2xl font-bold text-gray-800">
            {{ 'accessDenied.title' | translate }}
          </h1>
          <p class="text-gray-500">
            {{ 'accessDenied.message' | translate }}
          </p>
        </div>

        <div
          class="flex gap-3"
          role="group"
          [attr.aria-label]="'accessDenied.navigationLabel' | translate"
        >
          <a mat-flat-button routerLink="/persons">
            <mat-icon aria-hidden="true">groups</mat-icon>
            {{ 'common.directory' | translate }}
          </a>

          <a mat-button routerLink="/">
            <mat-icon aria-hidden="true">home</mat-icon>
            {{ 'common.backHome' | translate }}
          </a>
        </div>
      </div>
    </section>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessDeniedComponent {}

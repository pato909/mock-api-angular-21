import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SecurityService } from './core/security/security.service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from './core/language/language.service';
import { LanguageSwitcherComponent } from './shared/language-switcher/language-switcher-component';

@Component({
  selector: 'app-root',
  imports: [
    MatButtonModule,
    MatToolbarModule,
    RouterLink,
    RouterOutlet,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatDivider,
    TranslatePipe,
    LanguageSwitcherComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  securityService = inject(SecurityService);
  private readonly languageService = inject(LanguageService);

  constructor() {
    this.languageService.init();
  }

  logout() {
    this.securityService.logout();
  }

  protected forceLogin() {
    this.securityService.forceLogin();
  }
}

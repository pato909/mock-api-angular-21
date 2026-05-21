import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { SecurityService } from './core/security/security.service';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from './core/language/language.service';
import { Header } from './shared/ui/header/header';
import { Footer } from './shared/ui/footer/footer';

@Component({
  selector: 'app-root',
  imports: [MatButtonModule, MatToolbarModule, RouterOutlet, Header, Footer],
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

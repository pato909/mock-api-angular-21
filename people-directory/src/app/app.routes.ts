import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { SecurityService } from './core/security/security.service';
import { AccessDeniedComponent } from './shared/ui/access-denied/access-denied';
import { NotFoundComponent } from './shared/ui/not-found/not-found';

export function adminGuard() {
  const securityService = inject(SecurityService);
  const router = inject(Router);

  if (securityService.isConnected() && securityService.user().admin) {
    return true;
  }

  return router.parseUrl('/denied');
}


export function connectedGuard() {
  const securityService = inject(SecurityService);
  const router = inject(Router);

  if (securityService.isConnected()) {
    return true;
  }

  return router.parseUrl('/denied');
}
export const routes: Routes = [
  { path: '', redirectTo: 'persons', pathMatch: 'full' },
  {
    path: 'persons',
    loadComponent: () =>
      import('./features/persons/pages/persons-list-page/persons-list-page').then(
        (m) => m.PersonsListPage,
      ),
  },
  {
    path: 'persons/new',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/persons/pages/person-create-page/person-create-page').then(
        (m) => m.PersonCreatePage,
      ),
  },
  {
    path: 'persons/:id',
    canActivate: [connectedGuard],
    loadComponent: () =>
      import('./features/persons/pages/person-detail-page/person-detail-page').then(
        (m) => m.PersonDetailPage,
      ),
  },
  {
    path: 'persons/:id/edit',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/persons/pages/person-edit-page/person-edit-page').then(
        (m) => m.PersonEditPage,
      ),
  },
  {
    path: 'profile',
    canActivate: [connectedGuard],
    loadComponent: () =>
      import('./features/profile/ui/profile/profile').then((m) => m.ProfileComponent),
  },
  {
    path: 'denied',
    component: AccessDeniedComponent,
    canActivate: [],
  },
  {
    path: '**',
    component: NotFoundComponent,
    canActivate: [],
  },
];

import { Routes } from '@angular/router';
import { AccessDeniedComponent } from './shared/ui/access-denied/access-denied';
import { NotFoundComponent } from './shared/ui/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'persons', pathMatch: 'full' },
  {
    path: 'persons',
    loadChildren: () => import('./persons/person.routes').then((m) => m.PERSON_ROUTES),
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.routes').then((m) => m.PROFILE_ROUTES),
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

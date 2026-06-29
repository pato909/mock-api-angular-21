import { Routes } from '@angular/router';
import { connectedGuard } from '../core/security/guards/security.guards';

export const PROFILE_ROUTES: Routes = [
  {
    path: 'profile',
    canActivate: [connectedGuard],
    loadComponent: () => import('./profile').then((m) => m.ProfileComponent),
  },
];

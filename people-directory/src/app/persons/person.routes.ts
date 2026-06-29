import { Routes } from '@angular/router';
import { adminGuard, connectedGuard } from '../core/security/guards/security.guards';

export const PERSON_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./persons-list-page/persons-list-page').then((m) => m.PersonsListPage),
  },
  {
    path: 'new',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./person-create-page/person-create-page').then((m) => m.PersonCreatePage),
  },
  {
    path: ':id',
    canActivate: [connectedGuard],
    loadComponent: () =>
      import('./person-detail-page/person-detail-page').then((m) => m.PersonDetailPage),
  },
  {
    path: ':id/edit',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./person-edit-page/person-edit-page').then((m) => m.PersonEditPage),
  },
];

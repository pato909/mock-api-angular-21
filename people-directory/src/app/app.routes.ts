import { Routes } from '@angular/router';

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
    loadComponent: () =>
      import('./features/persons/pages/person-create-page/person-create-page').then(
        (m) => m.PersonCreatePage,
      ),
  },
  {
    path: 'persons/:id',
    loadComponent: () =>
      import('./features/persons/pages/person-detail-page/person-detail-page').then(
        (m) => m.PersonDetailPage,
      ),
  },
  {
    path: 'persons/:id/edit',
    loadComponent: () =>
      import('./features/persons/pages/person-edit-page/person-edit-page').then(
        (m) => m.PersonEditPage,
      ),
  },
];

import { Routes } from '@angular/router';
import { PersonsListPage } from './features/persons/pages/persons-list-page/persons-list-page';
import { PersonCreatePage } from './features/persons/pages/person-create-page/person-create-page';
import { PersonDetailPage } from './features/persons/pages/person-detail-page/person-detail-page';
import { PersonEditPage } from './features/persons/pages/person-edit-page/person-edit-page';

export const routes: Routes = [
  { path: '', redirectTo: 'persons', pathMatch: 'full' },
  { path: 'persons', component: PersonsListPage },
  { path: 'persons/new', component: PersonCreatePage },
  { path: 'persons/:id', component: PersonDetailPage },
  { path: 'persons/:id/edit', component: PersonEditPage },

];

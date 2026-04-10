import { httpResource } from '@angular/common/http';
import { inject, Injectable, Injector, Signal } from '@angular/core';
import { Person } from '../model/person.model';
import { PersonsListQuery } from '../model/person-query.model';

@Injectable({
  providedIn: 'root',
})
export class PersonsResources {
  private readonly baseUrl = 'https://69ca6329ba5984c44bf30fe2.mockapi.io/api/v1';
  private readonly injector = inject(Injector);

  personsList(query: Signal<PersonsListQuery>) {
    return httpResource<Person[]>(
      () => ({
        url: `${this.baseUrl}/persons`,
        method: 'GET',
        params: {
          search: query().search,
          sortBy: query().sortBy,
          order: query().order,
          page: query().page,
          limit: query().limit,
        },
      }),
      {
        injector: this.injector,
      },
    );
  }

  personDetail(id: Signal<string>) {
    return httpResource<Person>(
      () => ({
        url: `${this.baseUrl}/persons/${id()}`,
        method: 'GET',
      }),
      {
        injector: this.injector,
      },
    );
  }
}

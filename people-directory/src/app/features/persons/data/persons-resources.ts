import { httpResource, HttpResourceRef } from '@angular/common/http';
import { computed, Injectable, signal, Signal } from '@angular/core';
import { Person } from '../model/person.model';
import { PersonsListQuery } from '../model/person-query.model';

@Injectable({
  providedIn: 'root',
})
export class PersonsResources {
  private readonly baseUrl = 'https://69ca6329ba5984c44bf30fe2.mockapi.io/api/v1';

  // ----- Signals internes -----
  private readonly _listQuery = signal<PersonsListQuery>({
    search: '',
    sortBy: 'name',
    order: 'asc',
    page: 1,
    limit: 10,
  });

  private readonly _personId = signal<string | null>(null);

  // ----- Exposition lecture seule -----
  readonly listQuery = this._listQuery.asReadonly();
  readonly personId = this._personId.asReadonly();

  // ----- Setters / updaters -----
  setListQuery(query: PersonsListQuery): void {
    this._listQuery.set(query);
  }

  patchListQuery(partial: Partial<PersonsListQuery>): void {
    this._listQuery.update((q) => ({ ...q, ...partial }));
  }

  setPersonId(id: string | null): void {
    this._personId.set(id);
  }

  // ----- Ressources réactives -----
  readonly personsList: HttpResourceRef<Person[] | undefined> = httpResource<Person[]>(() => ({
    url: `${this.baseUrl}/persons`,
    params: {
      search: this._listQuery().search,
      sortBy: this._listQuery().sortBy,
      order: this._listQuery().order,
      page: this._listQuery().page,
      limit: this._listQuery().limit,
    },
  }));

  private readonly _personsCountResource = httpResource<Person[]>(() => ({
    url: `${this.baseUrl}/persons`,
    params: {
      search: this._listQuery().search,
      page: 1,
      limit: 100000,
    },
  }));

  readonly personsCount: Signal<number> = computed(
    () => this._personsCountResource.value()?.length ?? 0,
  );

  readonly personDetail: HttpResourceRef<Person | undefined> = httpResource<Person>(() => {
    const id = this._personId();
    return id ? { url: `${this.baseUrl}/persons/${id}` } : undefined;
  });

  reloadPersonDetail(): void {
    this.personDetail.reload();
  }

  reloadPersons(): void {
    this.personsList.reload();
  }

  reloadPersonsCount(): void {
    this._personsCountResource.reload();
  }
}

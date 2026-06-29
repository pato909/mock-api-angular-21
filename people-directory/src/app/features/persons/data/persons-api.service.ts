import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { Person, PersonUpsertPayload } from '../model/person.model';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/api/api.config';
import { PersonsListQuery } from '../model/person-query.model';

@Injectable({
  providedIn: 'root',
})
export class PersonsApiService {
  private readonly httpClient = inject(HttpClient);

  private readonly _listQuery = signal<PersonsListQuery>({
    search: '',
    sortBy: 'name',
    order: 'asc',
    page: 1,
    limit: 10,
  });

  private readonly _personId = signal<string | null>(null);

  create(payload: PersonUpsertPayload): Observable<Person> {
    return this.httpClient.post<Person>(`${API_BASE_URL}/persons`, payload);
  }

  update(id: string, payload: PersonUpsertPayload): Observable<Person> {
    return this.httpClient.put<Person>(`${API_BASE_URL}/persons/${id}`, payload);
  }

  delete(id: string): Observable<Person> {
    return this.httpClient.delete<Person>(`${API_BASE_URL}/persons/${id}`);
  }
  readonly listQuery = this._listQuery.asReadonly();
  readonly personId = this._personId.asReadonly();

  setListQuery(query: PersonsListQuery): void {
    this._listQuery.set(query);
  }

  patchListQuery(partial: Partial<PersonsListQuery>): void {
    this._listQuery.update((q) => ({ ...q, ...partial }));
  }

  setPersonId(id: string | null): void {
    this._personId.set(id);
  }

  readonly personsList: HttpResourceRef<Person[]> = httpResource<Person[]>(
    () => ({
      url: `${API_BASE_URL}/persons`,
      params: {
        search: this._listQuery().search,
        sortBy: this._listQuery().sortBy,
        order: this._listQuery().order,
        page: this._listQuery().page,
        limit: this._listQuery().limit,
      },
    }),
    { defaultValue: [] },
  );

  private readonly _personsCountResource = httpResource<Person[]>(
    () => ({
      url: `${API_BASE_URL}/persons`,
      params: {
        search: this._listQuery().search,
        page: 1,
        limit: 100000,
      },
    }),
    { defaultValue: [] },
  );

  readonly personsCount: Signal<number> = computed(
    () => this._personsCountResource.value()?.length ?? 0,
  );

  readonly personDetail: HttpResourceRef<Person | undefined> = httpResource<Person>(() => {
    const id = this._personId();
    return id ? { url: `${API_BASE_URL}/persons/${id}` } : undefined;
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

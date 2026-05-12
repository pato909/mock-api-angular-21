import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Person, PersonUpsertPayload } from '../model/person.model';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/api/api.config';

@Injectable({
  providedIn: 'root',
})
export class PersonsApiService {
  private readonly httpClient = inject(HttpClient);

  create(payload: PersonUpsertPayload): Observable<Person> {
    return this.httpClient.post<Person>(`${API_BASE_URL}/persons`, payload);
  }

  update(id: string, payload: PersonUpsertPayload): Observable<Person> {
    return this.httpClient.put<Person>(`${API_BASE_URL}/persons/${id}`, payload);
  }

  delete(id: string): Observable<Person> {
    return this.httpClient.delete<Person>(`${API_BASE_URL}/persons/${id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Person, PersonUpsertPayload } from '../model/person.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonsApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = 'https://69ca6329ba5984c44bf30fe2.mockapi.io/api/v1';

  create(payload: PersonUpsertPayload): Observable<Person> {
    return this.httpClient.post<Person>(`${this.baseUrl}/persons`, payload);
  }

  update(id: string, payload: PersonUpsertPayload): Observable<Person> {
    return this.httpClient.put<Person>(`${this.baseUrl}/persons/${id}`, payload);
  }

  delete(id: string): Observable<Person> {
    return this.httpClient.delete<Person>(`${this.baseUrl}/persons/${id}`);
  }
}

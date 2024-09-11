import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private apiUrl = 'http://localhost:3000/insert';

  constructor(private http: HttpClient) {}

  insertRecord(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}

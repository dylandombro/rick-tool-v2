import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { OktaAuthStateService } from '@okta/okta-angular';
import { switchMap, first } from 'rxjs/operators';
import { AuthState } from '@okta/okta-auth-js';
import { OktaAuth } from '@okta/okta-auth-js';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private apiUrl = 'http://localhost:3000/api/insertRecord';

  constructor(
    private http: HttpClient,
    private oktaAuthService: OktaAuthStateService,
    private oktaAuth: OktaAuth
  ) {}

  insertRecord(data: FormData): Observable<any> {
    return this.oktaAuthService.authState$.pipe(
      first(),
      switchMap((authState: AuthState) => {
        if (!authState.isAuthenticated) {
          return throwError(() => new Error('User is not authenticated'));
        }

        return from(Promise.resolve(this.oktaAuth.getAccessToken())).pipe(
          switchMap((token: string | undefined) => {
            if (!token) {
              return throwError(() => new Error('Failed to get access token'));
            }
            const headers = new HttpHeaders().set(
              'Authorization',
              `Bearer ${token}`
            );
            return this.http.post(this.apiUrl, data, { headers });
          })
        );
      })
    );
  }
}

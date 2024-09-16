import { Component, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth, AuthState } from '@okta/okta-auth-js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'; // Add this line
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterModule, CommonModule],
  template: `
    <div>
      <button *ngIf="!(isAuthenticated$ | async)" (click)="login()">
        Login
      </button>
      <button *ngIf="isAuthenticated$ | async" (click)="logout()">
        Logout
      </button>
    </div>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;

  constructor(
    private oktaStateService: OktaAuthStateService,
    private oktaAuth: OktaAuth,
    private router: Router
  ) {
    this.isAuthenticated$ = this.oktaStateService.authState$.pipe(
      map((authState: AuthState) => !!authState.isAuthenticated)
    );
  }

  ngOnInit() {
    // Subscribe to authentication state changes
    this.oktaStateService.authState$.subscribe((authState: AuthState) => {
      if (authState.isAuthenticated) {
        this.router.navigate(['/rick-tool']);
      }
    });
  }

  login() {
    this.oktaAuth.signInWithRedirect();
  }

  logout() {
    this.oktaAuth.signOut();
  }
}

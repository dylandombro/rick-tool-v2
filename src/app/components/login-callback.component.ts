import { Component, OnInit, Inject } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-login-callback',
  template: '<p>Logging in, please wait...</p>',
})
export class LoginCallbackComponent implements OnInit {
  constructor(
    @Inject(OKTA_AUTH) private oktaAuth: any,
    private oktaAuthService: OktaAuthStateService,
    private router: Router
  ) {}

  ngOnInit() {
    // Handles the response from Okta and parses it for errors, access token, etc.
    this.oktaAuth
      .handleLoginRedirect()
      .then(() => {
        this.oktaAuthService.authState$
          .pipe(
            filter((authState) => !!authState && !!authState.isAuthenticated),
            take(1)
          )
          .subscribe(() => {
            // Redirect to the desired route after successful authentication
            this.router.navigate(['/']); // Replace '/' with your desired route
          });
      })
      .catch((error: any) => {
        // Handle any errors that occur during the login process
        console.error('Error during login:', error);
        // You might want to redirect to an error page or show a message to the user
        this.router.navigate(['/login-error']); // Replace with your error handling route
      });
  }
}

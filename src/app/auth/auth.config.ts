import { OktaAuthOptions } from '@okta/okta-auth-js';
import { OktaAuth } from '@okta/okta-auth-js';

const oktaConfig = {
  issuer: 'https://dev-30654601.okta.com/oauth2/default',
  clientId: '0oaifabhx2O42IyFl5d7',
  redirectUri: window.location.origin + '/login/callback',
  scopes: ['openid', 'profile', 'email'],
};

export const oktaAuth = new OktaAuth(oktaConfig);

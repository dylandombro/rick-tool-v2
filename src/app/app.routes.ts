import { Routes } from '@angular/router';
import { RickToolComponent } from './components/rick-tool.component';
import { LoginCallbackComponent } from './components/login-callback.component';

export const routes: Routes = [
  { path: '', redirectTo: '/rick-tool', pathMatch: 'full' },
  { path: 'rick-tool', component: RickToolComponent },
  { path: 'login/callback', component: LoginCallbackComponent },
];

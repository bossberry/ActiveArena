import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/ui/login.component'; 
import { UserProfileComponent } from './pages/user-profile/ui/user-profile.component';
import { authGuard } from './shared/data-access/auth.guard';
import { PersonalRecordComponent } from './pages/personal-record/ui/personal-record.component';

export const APP_ROUTE: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'user-profile', component: UserProfileComponent, canActivate: [authGuard] },
  { path: 'personal-record', component: PersonalRecordComponent, canActivate: [authGuard]},
  { path: '**', redirectTo: 'login' }

];

import { UserDetailsComponent } from './user-details/user-details.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserLogoutComponent } from './user-logout/user-logout.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserGuard } from  './guard/user.guard';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full',canActivate: [UserGuard] },
  { path: 'users', component: UserListComponent, canActivate: [UserGuard] },
  { path: 'login', component: UserLoginComponent },
  { path: 'logout', component: UserLogoutComponent, canActivate: [UserGuard] },
  { path: 'register', component: UserRegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from '../auth/register/register.component';
import { LoginComponent } from '../auth/login/login.component';
import { RecoverPasswordComponent } from '../auth/recover-password/recover-password.component';
import { ResetPasswordComponent } from '../auth/reset-password/reset-password.component';

const routes: Routes =  [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'recoverpassword', component: RecoverPasswordComponent },
    { path: 'resetpassword/:token', component: ResetPasswordComponent },
    { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

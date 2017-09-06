import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SiteComponent } from './site.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { AuthService } from '../services/auth.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    SiteComponent,
    HeaderComponent,
    FooterComponent
  ],
  providers: [
    AuthService
  ]
})
export class SiteModule { }

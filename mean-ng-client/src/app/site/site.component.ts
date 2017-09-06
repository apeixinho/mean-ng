import { Component } from '@angular/core';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-site',
  templateUrl: 'site.component.html'
})
export class SiteComponent {
  constructor(private authService: AuthService) { }

  get isLoggedIn() { return AuthService.isLoggedIn }
}

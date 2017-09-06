import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(private http: Http) { }

  static get isLoggedIn() {
    return localStorage.getItem('_uid') !== null;
  }

  static get user() {
    return {
      name: localStorage.getItem('_username'),
      pictureUrl: localStorage.getItem('_pictureUrl') === 'undefined' ? null : localStorage.getItem('_pictureUrl')
    };
  }

  register(user: User) {
    const body = JSON.stringify(user);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post(environment.apiUrl + '/api/v1/auth/register', body, { headers: headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
  }

  login(user: User, remember: Boolean = false) {
    user.remember = remember;
    const body = JSON.stringify(user);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    console.log(environment.apiUrl + '/api/v1/auth/login');
    return this.http.post(environment.apiUrl + '/api/v1/auth/login', body, { headers: headers, withCredentials: true })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        return Observable.throw(error.json());
      });
  }

  logout() {
    localStorage.clear();
    return this.http.get(environment.apiUrl + '/api/v1/auth/logout')
      .map((response: Response) => response)      // Success (200) returns no content
      .catch((error: Response) => {
        return Observable.throw(new Error('failed'));
      });
  }

  recoverPassword(email: String) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.get(environment.apiUrl + '/api/v1/auth/password?email=' + email, { headers: headers })
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        console.log(JSON.stringify(error))
        return Observable.throw(error.json());
      });
  }

  resetPassword(token: String, password: String) {
    const body = JSON.stringify({ email: 'xxxxxx', password: password });
    const headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post(environment.apiUrl + '/api/v1/auth/password/' + token, body, { headers: headers })
      .map((response: Response) => response)
      .catch((error: Response) => {
        console.log(error);
        return Observable.throw(error.json());
      });
  }

  get callLinkedInUrl(): String {
    return environment.apiUrl + '/api/v1/auth/linkedin';
  }

  get callFacebookUrl(): String {
    return environment.apiUrl + '/api/v1/auth/facebook';
  }
}

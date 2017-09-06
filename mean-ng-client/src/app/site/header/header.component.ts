import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-header',
    template: `
        <nav class="navbar navbar-inverse bg-inverse navbar-fixed-top">
            <div class="container">
                 <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navOptions">
                        <span class="icon-bar"></span>                      
                        <span class="icon-bar"></span>                      
                        <span class="icon-bar"></span>                      
                    </button>
                    <a class="navbar-brand" href="#">MEAN-NG Client</a>
                </div>
                <div class="collapse navbar-collapse" id="navOptions">
                    <div *ngIf="isLoggedIn;else login">
                        <ul class="nav navbar-nav navbar-right">
                            <li>
                                <a href="#" class="profile-image">
                                    <img class="img-circle special-img" src="{{ userPictureUrl }}" />                                
                                    {{ user.name }}
                                </a>
                            </li>
                            <button (click)="logout()" class="btn navbar-btn btn-sm btn-default">Logout</button>
                        </ul>
                    </div>
                    <ng-template #login>
                        <ul class="nav navbar-nav navbar-right">
                            <li><a routerLink="/auth/register"><span class="glyphicon glyphicon-user"></span>&nbsp;&nbsp;Register</a></li>
                            <li><a routerLink="/auth/login"><span class="glyphicon glyphicon-log-in"></span>&nbsp;&nbsp;Login</a></li>
                        </ul>
                    </ng-template>
                </div>
            </div>
        </nav>
    `,
    styles: [`
        nav { min-width: 350px }
        .special-img {
            position: relative;
            top: -5px;
            left: -5px;
            float: left;
            max-height: 30px;
        }
    `]
})
export class HeaderComponent {
    constructor(private authService: AuthService, private router: Router) { }

    get isLoggedIn() { return AuthService.isLoggedIn }
    get user() { return AuthService.user }
    get userPictureUrl() { return AuthService.user.pictureUrl || './assets/icon-default-profile.png' }

    logout() {
        this.authService.logout().subscribe();
        this.router.navigate(['/'], { skipLocationChange: true });
    }
}

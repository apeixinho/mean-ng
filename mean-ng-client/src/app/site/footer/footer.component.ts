import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <nav class="navbar navbar-inverse bg-primary navbar-fixed-bottom">
      <div class="container">
        <ul class="nav navbar-nav pull-right">
          <li class="pull-left"><a href="https://twitter.com/nukegold/" class="fa fa-twitter"></a></li>
          <li class="pull-left"><a href="https://github.com/nukegold" class="fa fa-github"></a></li>
        </ul>
      </div>
    </nav>
    `,
  styles: [`nav { min-width: 350px }`]
})
export class FooterComponent {
  constructor() {
  }
}

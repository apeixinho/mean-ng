import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-error',
  template: `
        <div class="alert alert-danger" *ngIf="message">
            <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
            <span class="sr-only">Error:</span>
            {{ message }}
        </div>`
})
export class FormErrorComponent {
  @Input() message: string = null;
}

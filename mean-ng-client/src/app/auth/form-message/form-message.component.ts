import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { FormValidatorsService } from '../../services/form-validators.service';

@Component({
    selector: 'app-form-message',
    template: `<div class="text-danger" *ngIf="errorMessage !== null">{{ errorMessage }}</div>`
})
export class FormMessageComponent {
    @Input() control: FormControl;

    get errorMessage() {
        if (!this.control || !this.control.errors) {
            return null;
        }

        for (const propertyName in this.control.errors) {
            if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
                return FormValidatorsService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
            }
        }

        return null;
    }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { User } from '../../models/user.model';
import { FormValidatorsService } from '../../services/form-validators.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
    mainForm: FormGroup;
    errorMessage: String;
    successMessage: String;
    success: Boolean = false;
    inputPassword = new FormControl(null);
    inputPassword2 = new FormControl(null);

    private token;

    constructor(private authService: AuthService, private route: ActivatedRoute) { }

    valid(control) {
        return control.valid || !control.touched;
    }

    onSubmit() {
        const password = this.mainForm.value.inputPassword;
        this.authService.resetPassword(this.token, password)
            .subscribe(
            data => {
                this.errorMessage = null;
                this.mainForm.reset();
                this.success = true;
                this.successMessage = 'Password changed. You may now log into your account.';
            },
            error => { this.errorMessage = error.message; }
            );
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.token = params['token'];
        });

        this.inputPassword.setValidators([
            Validators.required,
            FormValidatorsService.passwordValidator,
            FormValidatorsService.passwordCompare(this.inputPassword2, true)
        ]);
        this.inputPassword2.setValidators([
            Validators.required,
            FormValidatorsService.passwordCompare(this.inputPassword, false)
        ]);

        this.mainForm = new FormGroup({
            inputPassword: this.inputPassword,
            inputPassword2: this.inputPassword2
        });
    }
}

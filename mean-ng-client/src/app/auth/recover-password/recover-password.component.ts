import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { User } from '../../models/user.model';
import { FormValidatorsService } from '../../services/form-validators.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html'
})
export class RecoverPasswordComponent implements OnInit {
  mainForm: FormGroup;
  errorMessage: String;
  notSubmitted: boolean = true;

  constructor(private authService: AuthService) { }

  valid(control) {
    return control.valid || !control.touched;
  }

  onSubmit() {
    const email = this.mainForm.value.inputEmail;
    this.authService.recoverPassword(email)
      .subscribe(
      data => {
        this.errorMessage = null;
        this.mainForm.reset();
        this.notSubmitted = false;
      },
      error => { this.errorMessage = error.message; }
      );
  }

  ngOnInit() {
    this.mainForm = new FormGroup({
      inputEmail: new FormControl(null, [
        Validators.required,
        FormValidatorsService.emailValidator
      ])
    });
  }
}

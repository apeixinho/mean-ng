import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../../models/user.model';
import { FormValidatorsService } from '../../services/form-validators.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: String;
  inputPassword = new FormControl(null);
  inputPassword2 = new FormControl(null);

  constructor(private authService: AuthService, private router: Router) { }

  valid(control) {
    return control.valid || !control.touched;
  }

  onSubmit() {
    const user = new User(
      this.registerForm.value.inputEmail,
      this.registerForm.value.inputPassword,
      this.registerForm.value.inputFullName
    );

    this.authService.register(user)
      .subscribe(
      data => {
        this.registerForm.reset();
        this.errorMessage = null;
        localStorage.setItem('_uid', data.uid);
        localStorage.setItem('_username', data.obj.name);
        localStorage.setItem('_pictureUrl', data.obj.pictureUrl);
        this.router.navigateByUrl('/');
      },
      error => { this.errorMessage = error.message; }
      );
  }

  ngOnInit() {
    this.inputPassword.setValidators([
      Validators.required,
      FormValidatorsService.passwordValidator,
      FormValidatorsService.passwordCompare(this.inputPassword2, true)
    ]);
    this.inputPassword2.setValidators([
      Validators.required,
      FormValidatorsService.passwordCompare(this.inputPassword, false)
    ]);

    this.registerForm = new FormGroup({
      inputFullName: new FormControl(null, Validators.required),
      inputEmail: new FormControl(null, [
        Validators.required,
        FormValidatorsService.emailValidator,
      ]),
      inputPassword: this.inputPassword,
      inputPassword2: this.inputPassword2
    });
  }
}

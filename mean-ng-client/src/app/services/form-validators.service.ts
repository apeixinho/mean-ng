import { FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class FormValidatorsService {
  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    const config = {
      'required': 'Required field',
      'invalidEmailAddress': 'Invalid email address',
      'invalidPassword': 'Password must be at least 6 characters long, and contain a number',
      'passwordMismatch': 'Passwords do not match',
      'minlength': `Minimum length ${validatorValue.requiredLength}`,
      'maxlength': `Maximum length ${validatorValue.requiredLength}`
    };

    return config[validatorName];
  }

  // Better filtering than the native Angular 4 validator
  static emailValidator(control) {
    // RFC 2822 compliant regex
    // tslint:disable-next-line:max-line-length
    if (control.value && control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    } else {
      return { 'invalidEmailAddress': true };
    }
  }

  static passwordValidator(control) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value && control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return { 'invalidPassword': true };
    }
  }

  static passwordCompare = (control1: FormControl, reverse: boolean = false) => {
    return (control2: FormControl) => {
      if (control1.value === control2.value) {
        if (reverse) {
          control1.setErrors(null);
        }
        return null;
      } else {
        if (reverse) {
          control1.setErrors({ 'passwordMismatch': true });
          return null;
        }
        return { 'passwordMismatch': true };
      }
    };
  }
}

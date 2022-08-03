import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  static forbiddenCharValidator(regex: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = regex.test(control.value);
      return forbidden ? {forbiddenChar: {value: control.value}} : null;
    };
  }

  static passwordValidator(): ValidatorFn {
    const regex = /(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[0-9]+)(?=.*[^a-zA-Z0-9]+)/
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = regex.test(control.value);
      return valid ? null : {validPassword: {value: control.value}};
    };
  }

}


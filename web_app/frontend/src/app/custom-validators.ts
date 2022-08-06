import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { UsersService } from './services/users.service';


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
      return valid ? null : {invalidPassword: {value: control.value}};
    };
  }

  static uniqueUsernameValidator(usersService: UsersService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null>  => {
      return usersService.checkIfUsernameExists(control.value).pipe(map(response => {
        return response.usernameExists ? { usernameAlreadyExists: { value: control.value } } : null;
      }));
    };
  }

}


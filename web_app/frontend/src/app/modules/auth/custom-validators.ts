import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth-service/auth.service';

export class CustomValidators {
  static forbiddenCharacters(forbiddenCharRegEx: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = forbiddenCharRegEx.test(control.value);
      return forbidden ? { hasForbiddenChar: true } : null;
    };
  }

  static passwordValidator(): ValidatorFn {
    const regEx = /(?=.*[a-z]+)(?=.*[A-Z]+)(?=.*[0-9]+)(?=.*[^a-zA-Z0-9]+)/;
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = regEx.test(control.value);
      return valid ? null : { invalidPassword: { value: control.value } };
    };
  }

  static uniqueUsernameValidator(authService: AuthService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return authService.checkIfUsernameExists(control.value).pipe(
        map(response => {
          return response.usernameExists
            ? { usernameAlreadyExists: { username: control.value } }
            : null;
        }),
        catchError((err) => of({ usernameAlreadyExists: { error: err } }))
      );
    };
  }

  static matchValidator(source: string, target: string): ValidatorFn {
    return (formControl: AbstractControl): ValidationErrors | null => {
      const sourceControl = formControl.get(source);
      const targetControl = formControl.get(target);

      if (sourceControl && targetControl)
        if (sourceControl.value !== targetControl.value) {
          targetControl.setErrors({ mismatchedValues: true });
          return { mismatchedValues: true };
        } else {
          targetControl.setErrors(null);
          return null;
        }
      else return null;
    };
  }
}

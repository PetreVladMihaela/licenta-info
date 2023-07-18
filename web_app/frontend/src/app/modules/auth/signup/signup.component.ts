import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import { CanDeactivateComponent } from 'src/app/can-deactivate.guard';
import { RegisterUser } from 'src/app/interfaces/register_user';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomValidators } from '../custom-validators';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel
} from '../../material/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-register',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy, CanDeactivateComponent {
  public errorMessage: string = '';
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  public registeredUser: string | null = '';

  private formEdited: boolean = false;
  private signupStarted: boolean = false;
  private emailsInUse: string[] = [];

  constructor(private authService: AuthService, private dialog: MatDialog) {}

  canDeactivate(): Observable<boolean> | boolean {
    // if(this.formEdited) { const response=window.confirm('You have unsaved changes. Are you sure you want to leave?');
    //   return of(response); }
    // return true;
    if (this.formEdited) {
      const dialogData = new ConfirmationDialogModel('Warning',
        'You have unsaved changes. Are you sure you want to leave this page?'
      );

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        maxWidth: 'fit-content',
        minWidth: '280px',
        position: { top: '30px' },
        disableClose: true,
        data: dialogData
      });
      return dialogRef.afterClosed();
    } else return true; //navigation continues
  }


  public registerForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),

      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(25),
        CustomValidators.passwordValidator()
      ]),

      confirmPassword: new FormControl('', [Validators.required]),

      username: new FormControl('',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
          CustomValidators.forbiddenCharacters(/[^-\w]/)
        ], 
        CustomValidators.uniqueUsernameValidator(this.authService)
      )
    },
    CustomValidators.matchValidator('password', 'confirmPassword')
  );

  get email(): AbstractControl {
    return this.registerForm.get('email')!;
  }
  get password(): AbstractControl {
    return this.registerForm.get('password')!;
  }
  get confirmPassword(): AbstractControl {
    return this.registerForm.get('confirmPassword')!;
  }
  get username(): AbstractControl {
    return this.registerForm.get('username')!;
  }

  @ViewChildren('formField') private formFields!: QueryList<MatFormField>;
  private resizeObserver = new ResizeObserver(() => {
    this.formFields.forEach((formField) => {
      formField.updateOutlineGap();
    });
  });
  private observers: ResizeObserver[] = [];


  private onBeforeunload = (event: any) => {
    if (this.formEdited) event.returnValue = true; // message cannot be set
  };

  ngOnInit(): void {
    window.addEventListener('beforeunload', this.onBeforeunload);

    const newUser = localStorage.getItem('New User');
    if (newUser)
      this.authService.checkIfUsernameExists(newUser).subscribe({
        next: (response) => {
          if (response.usernameExists) this.registeredUser = newUser;
          else {
            localStorage.removeItem('New User');
            this.showForm();
          }
        },
        error: () => { //localStorage.removeItem('New User');
          this.showForm();
        }
      });
    else this.showForm();
  }

  private showForm(): void {
    this.registeredUser = null;
    document.getElementById('register-form')?.addEventListener('mousedown', this.onFormMousedown);
    document.getElementById('password-field')?.addEventListener('focusout', this.passwordFocusout);
    document.getElementById('username-field')?.addEventListener('focusout', this.usernameFocusout);
    this.trackFormChanges();
  }

  private onFormMousedown = (event: Event) => {
    const target = event.target as HTMLElement;
    if (
      target.id != 'register-form' &&
      target.classList.contains('mat-form-field-wrapper') == false &&
      target.classList.contains('mat-button-wrapper') == false
    ) {
      this.resizeObserver.observe(target);
      this.observers.push(this.resizeObserver);
      document
        .getElementById('register-form')
        ?.removeEventListener('mousedown', this.onFormMousedown);
    }
  };

  private passwordFocusout = this.onFocusout.bind(this, 'password', '#password-warning');
  private usernameFocusout = this.onFocusout.bind(this, 'username', '#invalid-username');

  private onFocusout(fieldName: string, errorSelector: string): void {
    let errorContainer;
    if (fieldName == 'password') {
      //starts on first password focusout
      this.registerForm.get('password')?.valueChanges.subscribe(() => {
        this.changeErrorMarginTop('password', '#password-warning');
      });
      document
        .getElementById('password-field')
        ?.removeEventListener('focusout', this.passwordFocusout);
      errorContainer = document.getElementById('password-warning');
      errorContainer!.style.color = 'red';
    } 
    else if (fieldName == 'username') {
      //starts on first username focusout
      this.registerForm.get('username')?.valueChanges.subscribe(() => {
        this.changeErrorMarginTop('username', '#invalid-username');
      });   
      document
        .getElementById('username-field')
        ?.removeEventListener('focusout', this.usernameFocusout);
      errorContainer = document.getElementById('invalid-username');
    }

    const observer = new ResizeObserver(() => {//can detect when display changes to and from 'none'
      this.changeErrorMarginTop(fieldName, errorSelector); 
    });
    if (errorContainer) {
      observer.observe(errorContainer);
      this.observers.push(observer);
    }
  }

  private changeErrorMarginTop(fieldName: string, errorSelector: string): void {
    const errorContainer = document.querySelector(errorSelector) as HTMLElement;
    if (errorContainer) {
      const errors = this.registerForm.get(fieldName)?.errors;
      if (errors) {
        if (errors['required'] || errors['minlength'] || errors['maxlength']) {
          if (window.innerWidth > 350) errorContainer.style.marginTop = '2px';
          else errorContainer.style.marginTop = '10px';
        } else errorContainer.style.marginTop = '-18px';
      }
    }
  }


  private trackFormChanges(): void {
    this.registerForm.valueChanges.subscribe((formValues) => { //console.log(formValues);
      this.formEdited = false;
      for (const formField in formValues)
        if (formValues[formField]) {
          this.formEdited = true;
          break;
        }
    });

    this.registerForm.get('email')?.valueChanges.subscribe((emailValue) => {
      if (this.emailsInUse.includes(emailValue)) this.email.setErrors({ emailInUse: emailValue });
      else if (
        this.errorMessage == 'User creation failed. An account with this email already exists.'
      )
        this.errorMessage = '';
    });

    this.registerForm.get('username')?.valueChanges.subscribe(() => {
      this.changeErrorDisplay('username', 'invalid-username', 'hasForbiddenChar');
      if (this.errorMessage == 'The username already exists.') this.errorMessage = '';
    });

    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.changeErrorDisplay('password', 'password-warning', 'invalidPassword');
    });
  }

  private changeErrorDisplay(fieldName: string, errorId: string, errorName: string): void {
    const errorContainer = document.getElementById(errorId);
    if (errorContainer) {
      const fieldErrors = this.registerForm.get(fieldName)?.errors;
      if (fieldErrors && fieldErrors[errorName]) errorContainer.style.display = 'block';
      else errorContainer.style.display = 'none';
    }
  }


  ngOnDestroy(): void {
    this.observers.forEach((observer) => observer.disconnect());
    window.removeEventListener('beforeunload', this.onBeforeunload);
  }


  public register(): void {
    if (!this.signupStarted) {
      this.signupStarted = true;
      const newUser: RegisterUser = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        username: this.registerForm.value.username,
        role: 'Basic User'
      };

      this.authService.registerNewUser(newUser).subscribe({
        next: () => { 
          this.formEdited = false;
          window.removeEventListener('beforeunload', this.onBeforeunload);
          localStorage.setItem('New User', newUser.username);
          this.registeredUser = newUser.username;
          document.body.style.cursor = 'auto';
          // this.authService.logInUser(newUser.username, newUser.password).subscribe(() => {
          //   localStorage.setItem('User', newUser.username);
          //   window.location.href = '/users/info/' + newUser.username;
          // });
        },
        error: (err) => {
          this.signupStarted = false;
          this.errorMessage = err.message;
          if (err.message == 'User creation failed. An account with this email already exists.') {
            this.emailsInUse.push(newUser.email);
            this.email.setErrors({ emailInUse: newUser.email });
          }
        }
      });
    }
  }

  public goBackToSignup(): void {
    localStorage.removeItem('New User');
    window.location.href = 'auth/signup';
  }
}

import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { CustomValidators } from '../custom-validators';
import { LogInUser } from 'src/app/interfaces/log_in_user';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public errorMessage: string = '';
  public showPassword: boolean = false;
  public newUser: string | null = localStorage.getItem('New User');

  public userIdentifier: string = 'username';
  public otherIdentifier: string = 'email';

  private nonexistentUsernames: string[] = [];
  private subscription: Subscription | undefined;

  constructor(private authService: AuthService, private dialog: MatDialog) {}

  public loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30),
      CustomValidators.forbiddenCharacters(/[^-\w]/)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(25)
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  public get username(): AbstractControl {
    return this.loginForm.get('username')!;
  }
  public get password(): AbstractControl {
    return this.loginForm.get('password')!;
  }
  public get email(): AbstractControl {
    return this.loginForm.get('email')!;
  }

  @ViewChildren('formField') private formFields!: QueryList<MatFormField>;

  private resizeObserver = new ResizeObserver(() => {
    this.formFields.forEach((formField) => {
      formField.updateOutlineGap();
    });
  });
  private formIsObserved = false;

  ngOnInit(): void { document.cookie = 'Token_Expiry_Date=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    this.onUsernameChange();
    if (this.newUser) {
      document.getElementById('login-section')?.classList.add('login-prompt');
      this.loginForm.patchValue({ username: this.newUser });
      const firstFormInput = document.querySelector('.form-input')!;
      this.resizeObserver.observe(firstFormInput);
      this.formIsObserved = true;
    } else
      document.getElementById('login-form')?.addEventListener('mousedown', this.onFormMouseDown);
  }

  private onFormMouseDown = (event: Event) => {
    const target = event.target as HTMLElement;
    if (target.id != 'login-form' && target.classList.contains('mat-button-wrapper') == false)
      if (target.classList.contains('mat-form-field-wrapper') == false) {
        this.resizeObserver.observe(target);
        this.formIsObserved = true;
        document.getElementById('login-form')?.removeEventListener('mousedown', this.onFormMouseDown);   
      }
  };

  private onUsernameChange(): void {
    this.loginForm.get('username')?.valueChanges.subscribe((usernameValue) => {
      if (this.nonexistentUsernames.includes(usernameValue))
        this.username.setErrors({ usernameNotFound: usernameValue });
      else if (this.errorMessage == 'The username was not found!') this.errorMessage = '';
    });
  }

  ngOnDestroy(): void {
    if (this.formIsObserved) this.resizeObserver.disconnect();
    if (this.subscription && this.subscription.closed == false) this.subscription.unsubscribe();
  }

  public logIn(): void {
    if (this.subscription == undefined)
      window.addEventListener('beforeunload', () => {
        if (this.subscription && !this.subscription.closed) this.subscription.unsubscribe();
      });

    if (this.subscription == undefined || this.subscription.closed) {
      const formData = this.loginForm.value;

      let userIdentifier = formData.username;
      let emailLogin = false;
      if (this.userIdentifier=='email') {
        emailLogin = true;
        userIdentifier = formData.email;
      }
        
      const loginModel: LogInUser = {
        userIdentifier: userIdentifier,
        password: formData.password,
        emailLogin: emailLogin
      };

      this.subscription = this.authService.logInUser(loginModel).subscribe({
        next: (response) => {
          if (this.newUser) localStorage.removeItem('New User');
          if (this.newUser) localStorage.removeItem('New User Email');

          let loggedInUser = formData.username;
          if (this.userIdentifier == 'email') loggedInUser = response.username;

          localStorage.setItem('User', loggedInUser);
          window.location.href = `/users/account/${loggedInUser}`;
          //this.subscription!.unsubscribe();
        },
        error: (err) => {
          this.errorMessage = err.message;
          if (err.message == 'The username was not found!') {
            this.nonexistentUsernames.push(formData.username);
            this.username.setErrors({ usernameNotFound: formData.username });
          }
        }
      });
    }
  }
  
  public changeLoginMethod() {
    if (this.userIdentifier=='username') {
      this.userIdentifier = 'email';
      this.otherIdentifier = 'username';
    }
    else {
      this.userIdentifier = 'username';
      this.otherIdentifier = 'email';
    }
  }


  public openResetPasswordDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '85%';
    dialogConfig.minWidth = '280px';
    dialogConfig.maxWidth = '551px';
    dialogConfig.minHeight = '350px';
    dialogConfig.disableClose = true;
    dialogConfig.data = this.loginForm.value.email;
    this.dialog.open(ResetPasswordComponent, dialogConfig);
  }
}

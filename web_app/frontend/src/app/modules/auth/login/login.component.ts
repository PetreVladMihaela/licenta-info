import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { CustomValidators } from '../custom-validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public errorMessage: string = '';
  public showPassword: boolean = false;
  public newUser: string | null = localStorage.getItem('New User');

  private nonexistentUsernames: string[] = [];
  private subscription: Subscription | undefined;

  constructor(private authService: AuthService) {}

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
    ])
  });

  public get username(): AbstractControl {
    return this.loginForm.get('username')!;
  }
  public get password(): AbstractControl {
    return this.loginForm.get('password')!;
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
      this.subscription = this.authService.logInUser(formData.username, formData.password).subscribe({
        next: () => {
          if (this.newUser) localStorage.removeItem('New User');
          localStorage.setItem('User', formData.username);
          window.location.href = `/users/account/${formData.username}`;
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
  
}

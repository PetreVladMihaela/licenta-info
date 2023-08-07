import { Component, HostListener, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { TooltipPosition } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { Subscription } from 'rxjs/internal/Subscription';
import { catchError, map } from 'rxjs/operators';
import { ChangePassword } from 'src/app/interfaces/change_password';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { UsersService } from 'src/app/services/users-service/users.service';
import { CustomValidators } from '../../auth/custom-validators';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit, OnDestroy {
  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  private sub: Subscription = new Subscription();
  public currentUser: User = {
    //userId: '',
    username: '',
    email: '',
    userRoles: []
  };

  public authorized = false;
  public errorMessage = '';
  public response = '';

  public showPassword = false;
  public showNewPassword = false;
  public showConfirmPassword = false;
  public changePassword = false;

  public editUsername = false;
  public editEmail = false;
  public editUsernameError = '';
  public editEmailError = '';

  private formObserved = false;
  private saveUsernameStarted = false;
  private saveEmailStarted = false;

  public tooltipPosition: TooltipPosition = 'above';
  @HostListener('window:resize', []) changeTooltipPosition() {
    if (window.innerWidth < 600) this.tooltipPosition = 'below';
    else this.tooltipPosition = 'right';
  }


  public editForm: FormGroup = new FormGroup({
    username: new FormControl('',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        CustomValidators.forbiddenCharacters(/[^-\w]/)
      ],
      [this.uniqueUsernameValidator(this.authService)]
    ),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  get username(): AbstractControl {
    return this.editForm.get('username')!;
  }
  get email(): AbstractControl {
    return this.editForm.get('email')!;
  }


  public passwordForm: FormGroup = new FormGroup(
    {
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(25),
        CustomValidators.passwordValidator()
      ]),
      confirmNewPassword: new FormControl('')
    },
    CustomValidators.matchValidator('newPassword', 'confirmNewPassword')
  );

  get currentPassword(): AbstractControl {
    return this.passwordForm.get('currentPassword')!;
  }
  get newPassword(): AbstractControl {
    return this.passwordForm.get('newPassword')!;
  }
  get confirmNewPassword(): AbstractControl {
    return this.passwordForm.get('confirmNewPassword')!;
  }


  @ViewChildren('formField') private formFields!: QueryList<MatFormField>;
  private resizeObserver = new ResizeObserver(() => { //console.log(this.formFields)
    this.formFields.forEach((formField) => {
      formField.updateOutlineGap();
    });
  });

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      const username = params['username'];
      this.usersService.getUserByName(username).subscribe({
        next: (user) => {
          this.authorized = true;
          this.currentUser = user;
          this.editForm.setValue({
            username: user.username,
            email: user.email
          });

          document.getElementById('account-info')?.addEventListener('click', this.onCardClick);
          document
            .querySelector('#change-password>button')
            ?.addEventListener('click', this.onPasswordChange);
        },
        error: (err) => {
          if (err.name == 'HTTP Error with Code 403' || err.status == 403)
            this.errorMessage = "You don't have permission to access this page.";
          else if (err.name == 'HTTP Error with Code 401' || err.status == 401)
            this.errorMessage = 'You need to be logged in to see this page.';
          else this.errorMessage = 'Error: ' + err.message;
        }
      });
    });
  }

  private onCardClick = (event: Event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('edit-icon')) {
      const formFields = document.getElementsByTagName('mat-form-field');
      Array.from(formFields).forEach((formField) => {
        this.resizeObserver.observe(formField);
      });
      this.formObserved = true;
      document.getElementById('account-info')?.removeEventListener('click', this.onCardClick);
    }
  };

  private onPasswordChange = () => {
    this.formObserved = true;
    const passwordForm = document.getElementById('password-form')!;
    this.resizeObserver.observe(passwordForm);
    document
      .getElementById('#change-password>button')
      ?.removeEventListener('click', this.onPasswordChange);
  };

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
    if (this.formObserved) this.resizeObserver.disconnect();
  }


  private uniqueUsernameValidator(authService: AuthService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (control.value == this.currentUser.username) return of(null);
      return authService.checkIfUsernameExists(control.value).pipe(
        map((response) => {
          return response.usernameExists
            ? { usernameAlreadyExists: { username: control.value } }
            : null;
        }),
        catchError((err) => of({ usernameAlreadyExists: { error: err } }))
      );
    };
  }

  public saveUsername(): void {
    const newUsername = this.editForm.value.username;
    if (newUsername !== this.currentUser.username) {
      if (this.saveUsernameStarted == false) {
        this.saveUsernameStarted = true;
        this.usersService.updateUsername(this.currentUser.username, newUsername).subscribe({
          next: () => {
            localStorage.setItem('User', newUsername);
            this.authService.emitUsername(newUsername);
            this.currentUser.username = newUsername;

            const userLink = document.getElementById('nav-user');
            if (userLink) userLink.textContent = 'User ' + newUsername;
            
            this.router.navigate(['/users/account/' + newUsername]).then(() => {
              this.editUsername = false;
              document.body.style.cursor = 'auto';
              this.editUsernameError = '';
              this.saveUsernameStarted = false;
            });
          },
          error: (err) => {
            this.editUsernameError = err.message;
            this.saveUsernameStarted = false;
          }
        });
      }
    } else {
      this.editUsername = !this.editUsername;
      document.body.style.cursor = 'auto';
      this.editUsernameError = '';
    }
  }

  public saveEmail(): void {
    const newEmail = this.editForm.value.email;
    if (newEmail !== this.currentUser.email) {
      if (this.saveEmailStarted == false) {
        this.saveEmailStarted = true;
        this.usersService.updateEmail(this.currentUser.username, newEmail).subscribe({
          next: () => {
            this.currentUser.email = newEmail;
            this.editEmail = false;
            if (this.currentUser.profile)
              this.currentUser.profile.email = newEmail;
            document.body.style.cursor = 'auto';
            this.editEmailError = '';
            this.saveEmailStarted = false;
          },
          error: (err) => {
            this.editEmailError = err.message;
            this.saveEmailStarted = false;
          }
        });
      }
    } else {
      this.editEmail = !this.editEmail;
      document.body.style.cursor = 'auto';
      this.editEmailError = '';
    }
  }

  public savePassword(): void {
    const responseDiv = document.getElementById('response')!;
    const currentPassword = this.passwordForm.value.currentPassword;
    const newPassword = this.passwordForm.value.newPassword;

    if (currentPassword != newPassword) {
      const model: ChangePassword = {
        username: this.currentUser.username,
        oldPassword: currentPassword,
        newPassword: newPassword
      };

      this.usersService.updatePassword(model).subscribe({
        next: (OKresponse) => {
          const responseDiv = document.getElementById('response')!;
          responseDiv.style.color = 'green';
          this.response = OKresponse;
          document.body.style.cursor = 'auto';
        },
        error: (err) => {
          responseDiv.style.color = 'red';
          if (err.message.includes('PasswordMismatch'))
            this.response = 'The current password is incorrect.';
          else this.response = err.message;
        }
      });
    } else {
      document.body.style.cursor = 'auto';
      responseDiv.style.color = 'red';
      this.response = 'The new password must be different from the old one.';
      responseDiv.id = 'identic-passwords-response';
      //responseDiv.style.maxWidth = '340px';
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'src/app/custom-validators';
import { User } from 'src/app/interfaces/user';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(
    private usersService: UsersService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public registerForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(25),
      CustomValidators.passwordValidator()]),
    username: new FormControl('', [Validators.required,  Validators.maxLength(30), 
      CustomValidators.forbiddenCharValidator(/[^-\w]/)])
  });

  get email(): AbstractControl {
    return this.registerForm.get('email')!;
  }
  get password(): AbstractControl {
    return this.registerForm.get('password')!;
  }
  get username(): AbstractControl {
    return this.registerForm.get('username')!;
  }

  public register(): void {

    const newUser: User = {
      userId: "",
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      username: this.registerForm.value.username,
      role: "BasicUser"
    };
    
  //   this.usersService.createUser(newUser).subscribe((result) => {
  //     console.log(result)
  //     this.usersService.login(newUser.username, newUser.password).subscribe((token:AccessToken) => {
  //       localStorage.setItem("access_token", token.accessToken);
  //       localStorage.setItem("expires_at", token.accessTokenExpiryDate.toString());
  //       this.router.navigate(['/users/info', newUser.username]);
  //     });
  //   });

    this.usersService.createUser(newUser).subscribe({
      next: () => {
        this.usersService.login(newUser.username, newUser.password).subscribe(() => {
          localStorage.setItem("User", newUser.username);
          this.router.navigate(['/users/info', newUser.username])
            .then(() => {
              window.location.reload();
            });
        });
      },
      error: err => {
        //this.errorMessage = err.message;
        console.log(err);
      }
    });
  }

}


import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/custom-validators';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public errorMessage = "";

  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
  }

  public loginForm: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]),
    username: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30), 
        CustomValidators.forbiddenCharValidator(/[^-\w]/)])
  });

  get password(): AbstractControl {
    return this.loginForm.get('password')!;
  }

  get username(): AbstractControl {
    return this.loginForm.get('username')!;
  }

  public login(): void {
    const formData = this.loginForm.value;
    this.usersService.login(formData.username, formData.password).subscribe({
      next: () => {
        localStorage.setItem("User", formData.username);
        window.location.href='/users/info/'+formData.username
      },
      error: err => {
        this.errorMessage = err.message;
        //console.log(err); //Error: message
      }
    });
  }

}

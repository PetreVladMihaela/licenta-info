import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public email: string;
  public disableButton: boolean = true;
  public errorMessage: string = '';
  public emailSent: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) userEmail: string,
    private dialogRef: MatDialogRef<ResetPasswordComponent>,
    private authService: AuthService
  ) {
    this.email = userEmail;
    if (userEmail != '') this.disableButton = false;
  }

  ngOnInit(): void {
    const emailInput = document.getElementById("email-input")! as HTMLInputElement;
    emailInput.addEventListener("input", () => {
      this.email = emailInput.value;
      if (emailInput.value == '') this.disableButton = true;
      else this.disableButton = false;
  });
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public sendResetPasswordEmail(): void {
    this.disableButton = true;
    const emailInput = document.getElementById("email-input")! as HTMLInputElement;
    if (emailInput.validity.valid)
      this.authService.sendResetPasswordEmail(this.email).subscribe({
        next: () => {
          this.errorMessage = '';
          this.emailSent = true;
        },
        error: (error) => {
          this.errorMessage = error;
        }
      });
    else emailInput.reportValidity();
  }
}

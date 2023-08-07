import { Component } from '@angular/core';
import { AuthService } from './services/auth-service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel
} from './modules/material/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  username: string | null = null;
  userIsLoggedIn = false;

  constructor(private authService: AuthService, private dialog: MatDialog) {}

  private onUnload = () => {
    this.authService.nameSubscriber.subscribe(username => {
      if (username != localStorage.getItem('User'))
        localStorage.setItem("User", username);
    });
  }

  ngOnInit(): void {
    this.userIsLoggedIn = this.authService.checkUserIsLoggedIn();
    const currentUser = localStorage.getItem('User');
    if (currentUser && this.userIsLoggedIn) {
      this.authService.emitUsername(currentUser);
      this.username = currentUser;

      window.addEventListener('beforeunload', this.onUnload);

      // this.usersService.getUserByName(currentUser).subscribe(user => {
      //   this.showAdminBoard = user.userRoles.includes('Admin');
      // });
    }

    this.authService.loggedIn.subscribe(value => {
      if (value) { 
        this.userIsLoggedIn = value;
        this.username = currentUser;
        if (currentUser) this.authService.emitUsername(currentUser);
      }
    });
  }

  logOut() {
    const dialogData = new ConfirmationDialogModel('',
      'Are you sure you want to log out of your account?',
      'Log out',
      'Cancel'
    );

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '90vw',
      minWidth: '260px',
      position: { top: '30px' },
      disableClose: true,
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((answer) => {
      if (answer) {
        window.removeEventListener('beforeunload', this.onUnload);
        this.authService.logOutUser();
      }
    });
  }

}

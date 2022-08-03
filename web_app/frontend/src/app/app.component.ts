import { Component } from '@angular/core';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  username = '';
  isLoggedIn = false;

  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    const currentUser = localStorage.getItem("User");
    if (currentUser)
      this.username = currentUser;
      
    this.isLoggedIn = this.usersService.isLoggedIn();
    //if (this.isLoggedIn) {
      // const user = this.usersService.getUser();
      // this.roles = user.roles;
      // this.showAdminBoard = this.roles.includes('ADMIN');
    //}
  }

  logout() {
    this.usersService.logout();
  }

}

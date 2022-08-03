import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { User } from 'src/app/interfaces/user';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription;
  public currentUser?: User;
  public loggedIn = false;

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loggedIn = this.usersService.isLoggedIn();
    this.subscription = this.route.params.subscribe(params => {
      const username = params['username'];
      this.usersService.getUserByName(username).subscribe({
        next: user => {
          this.currentUser = user;
          if (this.loggedIn !== this.usersService.isLoggedIn()) {
            this.loggedIn = this.usersService.isLoggedIn();
            window.location.reload();
          }
          //this.roles = user.roles;
        },
        error: err => { console.log(err)
          // if (err.error) 
          //   this.errorMessage = JSON.parse(err.error).message;
          // else 
          //   this.errorMessage = "Error with status: " + err.status;
        }
      });
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

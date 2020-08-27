import {Component, OnInit} from '@angular/core';
import {Auth} from 'aws-amplify';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'amplify-cognito-auth-demo';
  isLoggedIn = false;
  user: { id: string; username: string; email: string };

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(
      isLoggedIn => (this.isLoggedIn = isLoggedIn)
    );

    this.authService.auth$.subscribe(({id, username, email}) => {
      this.user = {id, username, email};
    });
  }

  webSignIn(): void {
    Auth.federatedSignIn();
  }

  signOut(): void {
    Auth.signOut();
  }
}

import {Component} from '@angular/core';
import {Auth, Hub} from 'aws-amplify';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'amplify-cognito-auth-demo';

  constructor() {
  }

  ngOnInit() {
    Hub.listen('auth', ({payload: {event, data}}) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          Auth.currentAuthenticatedUser().then((userData) => {
            console.log(userData);
          }).catch((error) => {
            console.error(error.message);
          });
          break;
        case 'signOut':
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.error('Sign in failure', data);
          break;
      }
    });
  }

  webSignIn() {
    Auth.federatedSignIn();
  }

  signOut() {
    Auth.signOut();
  }
}

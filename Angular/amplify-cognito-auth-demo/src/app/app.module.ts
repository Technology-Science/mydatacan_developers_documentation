import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';

/* Add Amplify imports */
import {AmplifyUIAngularModule} from '@aws-amplify/ui-angular';
import Amplify from 'aws-amplify';
import {AuthService} from './auth.service';

/* Configure Amplify resources */
Amplify.configure({
  Auth: {
    region: '',
    userPoolId: '',
    userPoolWebClientId: '',
    authenticationFlowType: 'USER_SRP_AUTH',
    oauth: {
      domain: '',
      scope: ['email', 'profile', 'openid'],
      redirectSignIn: 'http://localhost:4200',
      redirectSignOut: 'http://localhost:4200',
      responseType: 'code'
    }
  }
});

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, AmplifyUIAngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(_auth: AuthService) {
    console.log('starting AppModule');
  }
}

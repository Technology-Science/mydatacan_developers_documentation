import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';

/* Add Amplify imports */
import {AmplifyUIAngularModule} from '@aws-amplify/ui-angular';
import Amplify from 'aws-amplify';

/* Configure Amplify resources */
Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_pgy5ckrBj',
    userPoolWebClientId: '4dtqt1uhbvq2ui3om26poftpsk',
    authenticationFlowType: 'USER_SRP_AUTH',
    oauth: {
      domain: 'auth.mydatacan.org',
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
}

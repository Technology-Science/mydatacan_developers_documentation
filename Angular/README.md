# Integrating MyDataCan in an Angular app

This guide is for Angular developers who want to integrate [MyDataCan](https://harvard.mydatacan.org) in their app and have users log in using their [HarvardKey](https://key.harvard.edu) credentials.

MyDataCan uses [Amazon Cognito](https://aws.amazon.com/cognito/) for authentication and this guide shows how to use the [AWS Amplify](https://aws.amazon.com/amplify/) libraries for JavaScript to handle web sign-in with Cognito.

## Integration Steps

### Add Amplify dependencies to project

Using npm:

```
npm install --save aws-amplify @aws-amplify/ui-angular
```

### Import Amplify libraries and configure Amplify

Add the following `import` to your `AppModule`:

```js
import {AmplifyUIAngularModule} from '@aws-amplify/ui-angular';
import Amplify from 'aws-amplify';
```

In the same file, configure Amplify by calling `configure` with the following configuration object:

```js
Amplify.configure({
    Auth: {
        region: '', // COGNITO USER POOL REGION
        userPoolId: '', // COGNITO USER POOL ID
        userPoolWebClientId: '', // YOUR APP CLIENT ID
        authenticationFlowType: 'USER_SRP_AUTH',
        oauth: {
            domain: '', // COGNITO DOMAIN
            scope: [], // ARRAY OF SCOPES
            redirectSignIn: '', // CALLBACK URL
            redirectSignOut: '', // SIGN OUT URL
            responseType: 'code'
        }
    }
})
```

The values in the config object need to be replaced with real values provided by MyDataCan to the app developer.

### Call the necessary methods for web sign-in and fetching session data

The accompanying [demo app](amplify-cognito-auth-demo) demonstrates a very simple authentication flow in which a user clicks on a "Sign In" button, is redirected to HarvardKey to enter his or her credentials and then gets redirected back to the app where some personal information that comes with the ID token returned by Cognito is displayed.

The user data that is obtained when [calling the `currentAuthenticatedUser`](amplify-cognito-auth-demo/src/app/auth.service.ts#L41) contains all the session data, including the ID, Access and Refresh tokens.

## Resources

* [AWS Amplify Auth & Angular RxJS Simple State Management](https://dev.to/beavearony/aws-amplify-auth-angular-rxjs-simple-state-management-3jhd). _DEV_.
* [Getting started](https://docs.amplify.aws/start/q/integration/angular). _Amplify Docs_.
* [Authentication - Getting started](https://docs.amplify.aws/lib/auth/getting-started/q/platform/js). _Amplify Docs_.
* [AWS Amplify](https://github.com/aws-amplify/amplify-js). _GitHub_.
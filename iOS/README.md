# Integrating MyDataCan to an iOS app

![Demo GIF](demo.gif)

This guide is for iOS developers who want to integrate [MyDataCan](https://harvard.mydatacan.org) to their app and have users log in using their [HarvardKey](https://key.harvard.edu) credentials.

MyDataCan uses [Amazon Cognito](https://aws.amazon.com/cognito/) for authentication and this guide shows how to use the [AWS Amplify](https://aws.amazon.com/amplify/) libraries for iOS to handle web sign-in with Cognito.

## System Requirements

* [CocoaPods](https://cocoapods.org) dependency manager for Swift projects. To install CocoaPods, see the installation steps in the [Getting Started guide](https://guides.cocoapods.org/using/getting-started.html#installation).
* Xcode (tested with version 11.6, other IDEs such as [AppCode](https://www.jetbrains.com/objc/) were not tested).

Since this guide is meant for using existing Amazon Cognito resources and not provisioning new Cognito user pools or other AWS resources, installing the AWS Amplify CLI tool is **not** required.

## Integration Steps

The steps for integration can be divided into three main steps:

1. Install AWS Amplify libraries using CocoaPods.
2. Configure `amplifyconfiguration.json` and `Info.plist`
3. Call the necessary methods for web sign-in and fetching session data.

### Install AWS Amplify libraries using CocoaPods

In the main directory of your project, either run `pod init` or create an empty file called `Podfile`. In this file, define the dependencies as follows:

```ruby
platform :ios, '13.6'

target 'AmplifyCognitoAuthDemo' do
  use_frameworks!

  pod 'Amplify'
  pod 'AmplifyPlugins/AWSCognitoAuthPlugin'
end
```

You can also have a look at the [example `Podfile`](src/AmplifyCognitoAuthDemo/Podfile) from the demo app. Once the dependencies have been defined run

```
pod install --repo-update
```

Once they have been installed, you must open Xcode by running

```
xed .
```

You must run this command in the same directory where your `.xcworkspace` is.

### Configure `amplifyconfiguration.json`

In the sources directory of your project, create a new JSON file named `amplifyconfiguration.json`. The contents of this file must be something like the following

```json
{
  "auth": {
    "plugins": {
      "awsCognitoAuthPlugin": {
          "IdentityManager": {
            "Default": {}
          },
          "CognitoUserPool": {
              "Default": {
                "PoolId": "// PUT COGNITO USER POOL ID HERE //",
                "AppClientId": "// PUT YOUR APP CLIENT ID HERE  //",
                "AppClientSecret": "// PUT YOUR APP CLIENT SECRET HERE //",
                "Region": "// PUT YOUR COGNITO USER POOL REGION HERE //"
            }
          },
          "Auth": {
            "Default": {
              "OAuth": {
                  "WebDomain": "// PUT YOUR COGNITO DOMAIN HERE //",
                  "AppClientId": "// PUT YOUR APP CLIENT ID HERE //",
                  "AppClientSecret": "// PUT YOUR APP CLIENT SECRET HERE //",
                  "SignInRedirectURI": "// PUT YOUR CALLBACK URL HERE //",
                  "SignOutRedirectURI": "// PUT YOUR SIGN OUT URL HERE //",
                  "Scopes": [
                    "// PUT YOUR SCOPES HERE //"
                  ]
                },
              "authenticationFlowType": "USER_SRP_AUTH"
            }
          }
      }
    }
  }
}
```

The dummy values need to be replaced with real values provided by MyDataCan to the app developer.

### Configure `Info.plist`

The URL schemes for the sign-in and sign-out URLs must be added to `Info.plist`. In Xcode, open this file as source code, and add the following _before_ the closing `</dict>` tag

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>myapp</string>
    </array>
  </dict>
</array>
```

The "myapp" value must be consistent with the values for `SignInRedirectURI` and `SignOutRedirectURI` in `amplifyconfiguration.json`. If the values for `SignInRedirectURI` and `SignOutRedirectURI` are "myapp://", then "myapp" (without the "://") is what needs to be on `Info.plist`. Also, these URL schemes must be consistent with the ones defined in the Amazon Cognito settings in the AWS Console (check with the MyDataCan team).

## Resources

* [AWS Amplify Authentication Flow for iOS SwiftUI](https://www.youtube.com/watch?v=wSHnmtnzbfs). _YouTube_.
* [AWS Amplify Auth Web UI for iOS | SwiftUI 2.0, Xcode 12](https://www.youtube.com/watch?v=74fl2EgpXSE). _YouTube_.
* [Getting started](https://docs.amplify.aws/start/q/integration/ios). _Amplify Docs_.
* [Authentication - Getting started](https://docs.amplify.aws/lib/auth/getting-started/q/platform/ios). _Amplify Docs_.
* [Amplify for iOS](https://github.com/aws-amplify/amplify-ios). _GitHub_.

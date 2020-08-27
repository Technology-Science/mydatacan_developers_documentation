# Integrating MyDataCan in a React app

This guide is for React developers who want to integrate [MyDataCan](https://harvard.mydatacan.org) in their app and have users log in using their [HarvardKey](https://key.harvard.edu) credentials.

MyDataCan uses [Amazon Cognito](https://aws.amazon.com/cognito/) for authentication and this guide shows how to use the [AWS Amplify](https://aws.amazon.com/amplify/) libraries for JavaScript to handle web sign-in with Cognito.
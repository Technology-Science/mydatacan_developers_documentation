import React, {useEffect, useState, Fragment} from 'react';
import Amplify, {Auth, Hub} from 'aws-amplify';
import './App.css';
import {Button, Image} from 'react-bootstrap'
import logo from './logo.png'

Amplify.configure({
    Auth: {
        region: '',
        userPoolId: '',
        userPoolWebClientId: '',
        authenticationFlowType: 'USER_SRP_AUTH',
        oauth: {
            domain: '',
            scope: ['email', 'profile', 'openid'],
            redirectSignIn: 'http://localhost:3000',
            redirectSignOut: 'http://localhost:3000',
            responseType: 'code'
        }
    }
})

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        Hub.listen('auth', ({payload: {event, data}}) => {
            switch (event) {
                case 'signIn':
                case 'cognitoHostedUI':
                    getUser().then(userData => setUser(userData));
                    break;
                case 'signOut':
                    setUser(null);
                    break;
                case 'signIn_failure':
                case 'cognitoHostedUI_failure':
                    console.log('Sign in failure', data);
                    break;
            }
        });

        getUser().then(userData => setUser(userData));
    }, []);

    function getUser() {
        return Auth.currentAuthenticatedUser()
            .then(userData => userData)
            .catch(() => console.log('Not signed in'));
    }

    return (
        <div className={"vertical-center"}>
            <div className={"container text-center"}>
                {user ? (
                    <Fragment>
                        <h1>Hi {user.signInUserSession.idToken.payload.name}!</h1>
                        <p>Your full name
                            is {user.signInUserSession.idToken.payload.name} {user.signInUserSession.idToken.payload.family_name}</p>
                        <p>Your email address is {user.signInUserSession.idToken.payload.email}</p>
                        <Button variant={"primary"} onClick={() => Auth.signOut()}>Sign Out</Button>
                    </Fragment>
                ) : (
                    <Fragment>
                        <Image src={logo} alt={"MyDataCan logo"} width={"300px"} fluid/>
                        <br/>
                        <Button variant={"primary"} onClick={() => Auth.federatedSignIn()}>Sign In</Button>
                    </Fragment>
                )}
            </div>
        </div>
    );
}

export default App;

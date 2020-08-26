import React, {useEffect, useState} from 'react';
import Amplify, {Auth, Hub} from 'aws-amplify';
import './App.css';

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
        <div>
            <p>User: {user ? JSON.stringify(user.username) : 'None'}</p>
            {user ? (
                <button onClick={() => Auth.signOut()}>Sign Out</button>
            ) : (
                <button onClick={() => Auth.federatedSignIn()}>Federated Sign In</button>
            )}
        </div>
    );
}

export default App;

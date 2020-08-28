import React, {useEffect, useState} from 'react';
import {Button, Linking, Text, View, StyleSheet} from 'react-native';
import Amplify, {Auth, Hub} from 'aws-amplify';
import InAppBrowser from 'react-native-inappbrowser-reborn';

async function urlOpener(url, redirectUrl) {
  await InAppBrowser.isAvailable();
  const {type, url: newUrl} = await InAppBrowser.openAuth(url, redirectUrl, {
    showTitle: false,
    enableUrlBarHiding: true,
    enableDefaultShare: false,
    ephemeralWebSession: false,
  });

  if (type === 'success') {
    Linking.openURL(newUrl);
  }
}

Amplify.configure({
  Auth: {
    region: '', // COGNITO USER POOL REGION
    userPoolId: '', // COGNITO USER POOL ID
    userPoolWebClientId: '', // YOUR APP CLIENT ID
    authenticationFlowType: 'USER_SRP_AUTH',
    oauth: {
      domain: '', // COGNITO DOMAIN
      scope: ['email', 'openid', 'profile'], // ARRAY OF SCOPES
      redirectSignIn: 'myapp://', // CALLBACK URL
      redirectSignOut: 'myapp://', // SIGN OUT URL
      responseType: 'code',
      urlOpener,
    },
  },
});

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    Hub.listen('auth', ({payload: {event, data}}) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getUser().then((userData) => setUser(userData));
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

    getUser().then((userData) => setUser(userData));
  }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then((userData) => userData)
      .catch(() => console.log('Not signed in'));
  }

  return (
    <View>
      <Text style={styles.container}>User: {user ? JSON.stringify(user.username) : 'None'}</Text>
      {user ? (
        <Button title="Sign Out" onPress={() => Auth.signOut()} />
      ) : (
        <Button
          title="Federated Sign In"
          onPress={() => Auth.federatedSignIn()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
  },
});

export default App;

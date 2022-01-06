import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import auth from '@react-native-firebase/auth';
import RNBootSplash from 'react-native-bootsplash';

import {AuthContext} from './AuthProvider';

import AppStack from './AppStack';
import AuthNavigation from './AuthNavigation';

const Routes = () => {
  const {user, setUser} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged = user => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '432625471246-v0t28iarr07k24amatg4v2r51cbpqmfe.apps.googleusercontent.com',
    });
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return null;
  }

  return (
    <NavigationContainer onReady={() => RNBootSplash.hide()}>
      {user ? <AppStack /> : <AuthNavigation />}
    </NavigationContainer>
  );
};

export default Routes;

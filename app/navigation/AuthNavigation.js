import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import OnBoardingScreen from '../screens/OnBoardingScreen';

import LoginScreen from '../screens/Auth/LoginScreen';
import SignUp from '../screens/Auth/SignUp';
import ForgetPassword from '../screens/Auth/ForgetPassword';
import VerifyCode from '../screens/Register/VerifyCode';

const Stack = createStackNavigator();

function AuthNavigation() {
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);
  let routeName;

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '432625471246-v0t28iarr07k24amatg4v2r51cbpqmfe.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });

    console.log('authnavigation');
  }, []);

  if (isFirstLaunch === null) {
    return null;
  } else if (isFirstLaunch === true) {
    routeName = 'OnBoard';
  } else {
    routeName = 'SignUp';
  }
  return (
    <Stack.Navigator
      initialRouteName={routeName}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="OnBoard" component={OnBoardingScreen} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Forget" component={ForgetPassword} />
    </Stack.Navigator>
  );
}

export default AuthNavigation;

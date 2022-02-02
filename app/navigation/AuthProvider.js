import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import {GoogleSignin} from '@react-native-google-signin/google-signin';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        googleLogin: async () => {
          try {
            await GoogleSignin.hasPlayServices();
            const {idToken} = await GoogleSignin.signIn();

            // Create a Google credential with the token
            const googleCredential =
              auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            return auth().signInWithCredential(googleCredential);
          } catch (error) {
            console.log(error);
          }
        },
        logout: async () => {
          try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            auth().signOut();
          } catch (error) {
            console.error(error);
          }
        },
        signOut: async () => {
          try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();

            firestore()
              .collection('users')
              .doc(auth().currentUser.uid)
              .delete();

            firestore()
              .collection('about')
              .doc(auth().currentUser.uid)
              .delete();

            firestore()
              .collection('StoreName')
              .doc(auth().currentUser.uid)
              .delete();

            firestore()
              .collection('mycategory')
              .doc(auth().currentUser.uid)
              .delete();

            firestore()
              .collection('mystore')
              .doc(auth().currentUser.uid)
              .delete();

            auth().currentUser.delete();
            const storageRef = storage().ref(
              `profile/${auth().currentUser.uid}`,
            );
            storageRef.delete();

            setUser(false);
          } catch (error) {
            console.error(error);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};

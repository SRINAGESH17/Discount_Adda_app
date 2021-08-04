import React, {createContext, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export const AuthContext = createContext();

export const AuthProvider = ({children, navigation}) => {
  const [user, setUser] = useState(null);
  const [confirm, setConfirm] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            await auth().signInWithEmailAndPassword(email, password);
          } catch (error) {
            console.log(error);
          }
        },
        googleLogin: async () => {
          try {
            // Get the users ID token
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

        register: async (email, password, name, last) => {
          try {
            await auth()
              .createUserWithEmailAndPassword(email, password)
              .then(() => {
                firestore()
                  .collection('users')
                  .doc(auth().currentUser.uid)
                  .set({
                    fname: name,
                    lname: last,
                    email: email,
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                    userImg: null,
                  });
              })
              .catch(error => {
                console.log(
                  'Something went wrong with added user to firestore: ',
                  error,
                );
              });
          } catch (error) {
            console.log(error);
          }
        },
        phone: async phoneNumber => {
          try {
            const confirmation = await auth().signInWithPhoneNumber(
              '+91' + phoneNumber,
            );

            setConfirm(confirmation);
          } catch (error) {
            console.log(error);
          }
        },
        confirmCode: async (code, screen) => {
          try {
            await confirm.confirm(code).then(() => navigation.navigate(screen));
          } catch (error) {
            console.log('Invalid code.');
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
          } catch (error) {
            console.log(error);
          }
        },
        reset: async email => {
          try {
            await auth().sendPasswordResetEmail(email);
          } catch (e) {
            console.log(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};

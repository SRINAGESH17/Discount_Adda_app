import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

function StoreData({header, subheader}) {
  return firestore()
    .collection({header})
    .doc(auth().currentUser.uid)
    .collection({subheader})
    .doc(auth().currentUser.uid)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists === false) {
        console.log('false');
      }
      if (documentSnapshot.exists) {
        console.log(`true`, true);
      }
    });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default StoreData;

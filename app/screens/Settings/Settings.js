import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, Alert, Button} from 'react-native';
import * as Location from 'expo-location';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Settings = ({navigation}) => {
  const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);

  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    'Wait, we are fetching you location...',
  );

  useEffect(() => {
    CheckIfLocationEnabled();
    GetCurrentLocation();
  }, []);

  const CheckIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      Alert.alert(
        'Location Service not enabled',
        'Please enable your location services to continue',
        [{text: 'OK'}],
        {cancelable: false},
      );
    } else {
      setLocationServiceEnabled(enabled);
    }
  };

  const GetCurrentLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission not granted',
        'Allow the app to use location service.',
        [{text: 'OK'}],
        {cancelable: false},
      );
    }

    let {coords} = await Location.getLastKnownPositionAsync();

    if (coords) {
      const {latitude, longitude} = coords;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      console.log(
        '🚀😄 ~ file: Settings.js ~ line 45 ~ GetCurrentLocation ~ coords',
        coords,
      );
      firestore()
        .collection('StoreName')
        .doc(auth().currentUser.uid)
        .update({
          Coordinates: coords,
        })
        .catch(() => alert('Location  not updated'));

      for (let item of response) {
        // console.log(item)
        // let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;
        let address = `${item.city}`;

        setDisplayCurrentAddress(address);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.contentContainer}>
        <Text style={styles.title}>Your Current address</Text>
      </View> */}
      <Text style={styles.text}>{displayCurrentAddress}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FD0139',
  },
  text: {
    fontSize: 15,
    fontWeight: '400',
    color: '#000',
  },
});

export default Settings;

import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  TextInput,
  Keyboard,
  Text,
  ScrollView,
} from 'react-native';
import {Button} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import * as Location from 'expo-location';

function Address({navigation}) {
  let region = {
    latitude: 16.515099,
    longitude: 80.632095,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  };
  const [address, setaddress] = useState(null);

  const Address = region => {
    console.log(JSON.stringify(region));
    setaddress(region);
  };

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
      setaddress({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      });

      for (let item of response) {
        // console.log(item)
        let addressdetails = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;

        setDisplayCurrentAddress(addressdetails);
      }
    }
  };

  const shopaddress = () => {
    Keyboard.dismiss();
    console.log(address.longitude);

    firestore()
      .collection('StoreName')
      .doc(auth().currentUser.uid)
      .update({
        address: displayCurrentAddress,
        GeoPoint: new firestore.GeoPoint(address.latitude, address.longitude),
        coordinate: address,
      })
      .then(() => {
        Alert.alert('Successfully updated address');
        navigation.navigate('Mystore');
      })
      .catch(() => console.log('line 197 address not updated'));
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <SafeAreaView style={styles.container}>
        {address === null ? (
          <ActivityIndicator
            //visibility of Overlay Loading Spinner
            size="large"
            color="#D02824"
          />
        ) : (
          <MapView
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: address.latitude,
              longitude: address.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            style={styles.map}
            onRegionChangeComplete={region => Address(region)}>
            <Marker
              draggable
              coordinate={address}
              title="Address"
              description="Shop"
              image={require('../../assets/map_marker.png')}
              onDragEnd={e => setaddress(e.nativeEvent.coordinate)}
            />
          </MapView>
        )}

        <Button
          onPress={() => GetCurrentLocation()}
          mode="contained"
          style={{
            backgroundColor: '#D02824',
            marginTop: 10,
            width: 250,
            borderRadius: 20,
          }}>
          Tap to Current Location
        </Button>
        <View
          style={{
            backgroundColor: '#ccc',
            marginTop: 40,
            width: '90%',
            justifyContent: 'center',
            borderRadius: 20,
          }}>
          <TextInput
            placeholder={'Add address'}
            value={displayCurrentAddress}
            onChangeText={txt => setDisplayCurrentAddress(txt)}
            style={{
              width: '100%',
              color: '#000',
              marginStart: 10,
            }}
            placeholderTextColor="#aaa"
          />
        </View>
        <Button
          onPress={shopaddress}
          mode="contained"
          style={{
            backgroundColor: '#D02824',
            marginTop: 10,
            width: 150,
            marginBottom: 30,
            borderRadius: 20,
          }}>
          Submit
        </Button>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '70%',
  },
  text: {
    fontSize: 15,
    fontWeight: '400',
    color: '#000',
  },
});

export default Address;

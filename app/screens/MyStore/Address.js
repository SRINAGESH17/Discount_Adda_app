import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

function Address(props) {
  let region = {
    latitude: 16.515099,
    longitude: 80.632095,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  };
  const [address, setaddress] = useState(region);

  const Address = region => {
    Alert.alert(JSON.stringify(region));
    console.log(JSON.stringify(region));
    setaddress(region);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        initialRegion={address}
        style={styles.map}
        onRegionChangeComplete={region => Address(region)}
      />
      <View
        style={{
          top: '50%',
          left: '50%',
          marginLeft: -24,
          marginTop: -48,
          position: 'absolute',
        }}>
        <Image
          style={{height: 40, width: 40}}
          source={require('../../assets/map_marker.png')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Address;

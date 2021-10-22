import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {RNCamera} from 'react-native-camera';

import FormButton from '../../components/FormButton';

function QrScan({navigation}) {
  const [barcode, setBarcode] = useState(null);

  const QrScanner = value => {
    setBarcode(value);
    if (value.data != null) {
      navigation.navigate('Details', value.data);
    } else {
      navigation.goBack();
    }
    console.log(value.data.length);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Scan Card</Text>

      {barcode != null && (
        <View style={[styles.rnCamera, styles.rmCameraResult]}>
          <Text style={styles.rmCameraResultText}>{barcode.data}</Text>

          <View style={styles.cardContainer}>
            <TouchableOpacity onPress={() => setBarcode(null)}>
              <Image
                style={styles.img}
                source={require('../../assets/scanning.png')}
              />
            </TouchableOpacity>
            <Text style={styles.txt}>Looking for card...</Text>
          </View>
        </View>
      )}
      {barcode === null && (
        <RNCamera style={styles.rnCamera} onBarCodeRead={QrScanner} />
      )}

      <View style={styles.btn}>
        <FormButton
          buttonTitle="Cancel"
          onPress={() => navigation.navigate('Scan')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  btn: {
    padding: 20,
    marginTop: 90,
  },
  title: {
    color: '#333333',
    marginStart: 20,

    fontSize: 25,
  },
  img: {
    width: 320,
    height: 220,
  },
  cardContainer: {
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  txt: {
    color: 'grey',
    marginTop: 30,
  },
  rnCamera: {
    flex: 0.8,
    width: '94%',
    alignSelf: 'center',
    marginTop: 20,
  },
  rmCameraResult: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  rmCameraResultText: {
    fontSize: 20,
    color: '#62d1bc',
  },
  cameraControl: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnqr: {
    width: 240,
    borderRadius: 4,
    backgroundColor: '#62d1bc',
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginVertical: 8,
  },
  btnText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default QrScan;

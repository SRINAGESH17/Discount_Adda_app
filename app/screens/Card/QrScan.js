import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import FormButton from '../../components/FormButton';
const CAM_VIEW_HEIGHT = Dimensions.get('screen').width * 1.5;
const CAM_VIEW_WIDTH = Dimensions.get('screen').width;

const leftMargin = 100;
const topMargin = 50;
const frameWidth = 200;
const frameHeight = 250;

const scanAreaX = leftMargin / CAM_VIEW_HEIGHT;
const scanAreaY = topMargin / CAM_VIEW_WIDTH;
const scanAreaWidth = frameWidth / CAM_VIEW_HEIGHT;
const scanAreaHeight = frameHeight / CAM_VIEW_WIDTH;

function QrScan({navigation}) {
  const [scanned, setScanned] = useState(false);
  const [cardnumber, setcardnumber] = useState();

  const handleBarCodeScanned = value => {
    setScanned(true);
    setcardnumber(value.data);
    console.log('value: ', value.data);
    if (value.data != null) {
      navigation.navigate('Details', value.data);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Scan Card</Text>

      {scanned === true && (
        <View style={[styles.rnCamera, styles.rmCameraResult]}>
          <Text style={styles.rmCameraResultText}>{cardnumber}</Text>

          <View style={styles.cardContainer}>
            <TouchableOpacity onPress={() => setScanned(false)}>
              <Image
                style={styles.img}
                source={require('../../assets/scanning.png')}
              />
            </TouchableOpacity>
            <Text style={styles.txt}>Looking for card...</Text>
          </View>
        </View>
      )}
      {scanned === false && (
        <QRCodeScanner
          showMarker={true}
          markerStyle={{borderRadius: 20, borderColor: '#D02824'}}
          onRead={handleBarCodeScanned}
        />
      )}

      <View style={styles.btn}>
        <FormButton
          buttonTitle="Cancel"
          onPress={() => {
            navigation.navigate('Scan');
            setScanned(true);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  btn: {
    padding: 20,
    marginTop: 90,
    width: 200,
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

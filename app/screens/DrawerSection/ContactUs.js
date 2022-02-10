import React from 'react';
import {View, StyleSheet, Text, SafeAreaView, Linking} from 'react-native';

function ContactUs() {
  const callNumber = () => {
    let phoneNumber = `tel:${8447726766}`;

    Linking.openURL(phoneNumber);
  };
  const email = () => {
    Linking.openURL('mailto:Discountsadda.com@gmail.com');
  };

  const latitude = '16.502628';
  const longitude = '80.640869';
  const label =
    'Opposite :- Gateway Hotel,Beside Woodland Showroom, Bander Road , Vijayawada';

  // const url = Platform.select({
  //   ios: 'maps:' + latitude + ',' + longitude + '?q=' + label,
  //   android: 'geo:' + latitude + ',' + longitude + '?q=' + label,
  // });
  const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
  const latLng = `${latitude},${longitude}`;
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`,
  });
  const Maps = () => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        const browser_url =
          'https://www.google.de/maps/@' +
          latitude +
          ',' +
          longitude +
          '?q=' +
          label;
        return Linking.openURL(browser_url);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 20}}>Contact:-</Text>
        <Text
          onPress={callNumber}
          style={{
            marginStart: 20,
            color: '#7cb4f8',
            fontSize: 20,
            fontWeight: '700',
            textDecorationLine: 'underline',
          }}>
          +91 8447726766
        </Text>
      </View>
      <View style={{flexDirection: 'row', marginTop: 20}}>
        <Text style={{fontSize: 20}}>Email:-</Text>
        <Text
          onPress={email}
          style={{
            marginStart: 20,
            color: '#7cb4f8',
            fontSize: 18,
            fontWeight: '700',
            textDecorationLine: 'underline',
          }}>
          Discountsadda.com@gmail.com
        </Text>
      </View>
      <View style={{flexDirection: 'row', marginTop: 20}}>
        <Text style={{fontSize: 20}}>Address:-</Text>
        <Text
          onPress={Maps}
          style={{
            marginStart: 17,
            color: '#7cb4f8',
            fontSize: 18,
            fontWeight: '700',
            textDecorationLine: 'underline',
          }}>
          Opposite :- Gateway Hotel,{'\n'} Beside Woodland Showroom,{'\n'}
          Bander Road , Vijayawada
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
});

export default ContactUs;

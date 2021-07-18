import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import LottieView from 'lottie-react-native';

function Success({navigation}) {
  setTimeout(() => {
    navigation.navigate('Home'); // Stack Name
    console.log('complete');
  }, 1500);

  return (
    <View style={styles.container}>
      <LottieView
        autoPlay
        loop
        source={require('../../assets/Animations/success.json')}
      />
      <Text style={styles.txt}>Profile Successful updated</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  txt: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 50,
    marginStart: 10,
  },
});

export default Success;

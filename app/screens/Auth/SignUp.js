import React, {useContext, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Image,
  Animated,
  Dimensions,
} from 'react-native';

import SocialButton from '../../components/SocialButton';
import {AuthContext} from '../../navigation/AuthProvider';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

function SignUp({navigation}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const {googleLogin} = useContext(AuthContext);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.scrollView}>
      <View
        style={{
          width: windowWidth / 2.2,
          height: windowHeight / 4.5,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 40,
          marginTop: 30,
        }}>
        <Image
          style={{width: windowWidth / 2.4, height: windowHeight / 4.5}}
          source={require('../../assets/Logo.png')}
        />
      </View>

      <Animated.View style={[styles.header, {opacity: fadeAnim}]}>
        <Text style={styles.txt}>Welcome to DiscountsAdda-Merchant</Text>
      </Animated.View>

      <SocialButton
        buttonTitle="Login /Signup with Google"
        src={require('../../assets/google.png')}
        color="#707070"
        backgroundColor="#EAEBEC"
        onPress={() => googleLogin()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#2C3A4A',
    alignItems: 'center',
    padding: 20,
    flex: 1,
  },
  header: {
    marginTop: 30,
    marginBottom: 80,
  },
  txt: {
    color: '#ccc',
    fontSize: 22,
    marginTop: 5,
  },
});

export default SignUp;

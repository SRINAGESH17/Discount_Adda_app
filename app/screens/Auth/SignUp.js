import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  SafeAreaView,
  View,
  Button,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';

import * as yup from 'yup';
import {Formik} from 'formik';

import SocialButton from '../../components/SocialButton';
import FormInput from '../../components/FormInput';
import FormButton from '../../components/FormButton';
import {AuthContext} from '../../navigation/AuthProvider';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

function SignUp({navigation}) {
  // const [info, setInfo] = useState(null);

  const [loading, setLoading] = useState(false);

  const {phone, googleLogin} = useContext(AuthContext);

  const startLoading = db => {
    phone(db.contact);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Verify');
    }, 2000);
    // console.log(db.contact, db.name, db.last, db.email);
  };

  return (
    <SafeAreaView style={styles.scrollView}>
      <View
        style={{
          backgroundColor: '#EAEBEC',
          width: windowWidth / 2.2,
          height: windowHeight / 4.5,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 40,
          marginTop: 30,
        }}>
        <Image
          style={{width: windowWidth / 2.5, height: windowHeight / 6}}
          source={require('../../assets/Logo.png')}
        />
      </View>

      <View style={{marginTop: 30, marginBottom: 80}}>
        <Text style={styles.txt}>Welcome to DiscountAdda</Text>
        {/* <Text style={styles.txt}>DiscountAdda</Text> */}
      </View>

      <SocialButton
        buttonTitle="signup with Google"
        src={require('../../assets/google.png')}
        color="#707070"
        backgroundColor="#EAEBEC"
        onPress={() => googleLogin()}
      />
      {/* <SocialButton
        buttonTitle="signup with Facebook"
        src={require('../../assets/facebook.png')}
        color="#707070"
        backgroundColor="#EAEBEC"
        onPress={() => fbLogin()}
      /> */}
      {/* <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 15,
          marginTop: 10,
        }}>
        <View style={{flex: 1, height: 1, backgroundColor: '#FFFFFF'}} />
        <View>
          <Text
            style={{
              width: 50,
              textAlign: 'center',
              color: '#ccc',
              fontSize: 22,
            }}>
            Or
          </Text>
        </View>
        <View style={{flex: 1, height: 1, backgroundColor: '#E4E4E4'}} />
      </View> */}
      {/* {loading ? (
        <ActivityIndicator
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          size="large"
          color="#D02824"
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
        />
      ) : (
        <Formik
          initialValues={{
            contact: '',
          }}
          onSubmit={values => startLoading(values)}
          // onSubmit={values =>
          //   register(values.email, values.contact, values.name, values.last)
          // }
          validationSchema={yup.object().shape({
            contact: yup
              .string()
              .min(10)
              .max(10, 'Contact no. should not excced 10 digits.')
              .required(),
          })}>
          {({
            values,
            handleChange,
            errors,
            setFieldTouched,
            touched,
            isValid,
            handleSubmit,
          }) => (
            <View>
              <FormInput
                title="Contact"
                value={values.contact}
                onChangeText={handleChange('contact')}
                onBlur={() => setFieldTouched('contact')}
                placeholderText="Enter your contact here"
                keyboardType="phone-pad"
              />
              {touched.contact && errors.contact && (
                <Text style={{fontSize: 12, color: '#FF0D10'}}>
                  {errors.contact}
                </Text>
              )}

              <View style={{marginTop: 30}}>
                <Button
                  color="#D02824"
                  title="Sign Up"
                  disabled={!isValid}
                  onPress={handleSubmit}
                />
              </View>
            </View>
          )}
        </Formik>
      )} */}
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
  txt: {
    color: '#ccc',
    fontSize: 22,
    marginTop: 5,
  },
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ccc',
    fontFamily: 'Lato-Regular',
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
});

export default SignUp;

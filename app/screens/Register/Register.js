import React, {useState, useContext, useEffect} from 'react';
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
  BackHandler,
} from 'react-native';

import * as yup from 'yup';
import {Formik} from 'formik';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import FormInput from '../../components/FormInput';
import {AuthContext} from '../../navigation/AuthProvider';
import FormButton from '../../components/FormButton';

function Register({navigation}) {
  const [loading, setLoading] = useState(false);
  const [email, setemail] = useState('');
  const [img, setImg] = useState(null);

  const {logout, phone} = useContext(AuthContext);
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Hold on!', 'Are you sure you want to exit app?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'YES', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      };

      // Add Event Listener for hardwareBackPress
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, []),
  );

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const CurrentUserInfo = async () => {
        try {
          let info = await GoogleSignin.getCurrentUser();
          // console.log('User Info --> ', info);
          setImg(info.user.photo);
          setemail(info.user.email);
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_REQUIRED) {
            alert('User has not signed in yet');
            console.log('User has not signed in yet');
          } else {
            alert("Unable to get user's info");
            console.log("Unable to get user's info");
          }
        }
      };
      CurrentUserInfo();
    }

    console.log('Register SCreen');
  }, [isFocused]);

  const startLoading = db => {
    setLoading(true);

    firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .set({
        fname: db.name,
        lname: db.last,
        email: email,
        address: db.address,
        contact: db.contact,
        createdAt: firestore.Timestamp.fromDate(new Date()),
        userImg: img,
      })
      .then(() => {
        setLoading(false);
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      })
      .catch(() => alert('Details not submitted'));

    // console.log(db.contact, db.name, db.last, db.email);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Text style={styles.title}>Register </Text>
      {loading ? (
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
            name: '',
            last: '',
            address: '',
            contact: '',
          }}
          onSubmit={values => startLoading(values)}
          validationSchema={yup.object().shape({
            name: yup.string().required('Please, provide your name!'),
            address: yup.string().required('Please, provide address!'),
            contact: yup
              .string()
              .required()
              .matches(/^[0-9]+$/, 'Must be only digits')
              .min(10, 'Must be exactly 10 digits')
              .max(10, 'Must be exactly 10 digits'),
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
              <View style={{flexDirection: 'row'}}>
                <View style={{width: '50%'}}>
                  <FormInput
                    title="First Name"
                    value={values.name}
                    style={{width: '95%'}}
                    onChangeText={handleChange('name')}
                    onBlur={() => setFieldTouched('name')}
                    placeholderText="First Name"
                    autoCorrect={false}
                  />
                </View>
                <View style={{width: '50%'}}>
                  <FormInput
                    title="Last Name"
                    value={values.last}
                    onChangeText={handleChange('last')}
                    onBlur={() => setFieldTouched('last')}
                    placeholderText="Last Name"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>
              {touched.name && errors.name && (
                <Text style={{fontSize: 12, color: '#FF0D10'}}>
                  {errors.name}
                </Text>
              )}
              <FormInput
                title="Email"
                value={email}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <FormInput
                title="Address"
                value={values.address}
                onChangeText={handleChange('address')}
                onBlur={() => setFieldTouched('address')}
                placeholderText="Enter your Address here"
              />
              {touched.address && errors.address && (
                <Text style={{fontSize: 12, color: '#FF0D10'}}>
                  {errors.address}
                </Text>
              )}
              <FormInput
                title="Contact Details"
                value={values.contact}
                onChangeText={handleChange('contact')}
                onBlur={() => setFieldTouched('contact')}
                placeholderText="Enter your Phone Number here"
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
                  title="Register"
                  disabled={!isValid}
                  onPress={handleSubmit}
                />
              </View>
            </View>
          )}
        </Formik>
      )}
      <Text
        style={{
          color: '#ccc',
          fontSize: 22,
          marginTop: 30,
        }}>
        Try another account
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
        }}>
        <View style={{flex: 1, height: 1, backgroundColor: '#E4E4E4'}} />
      </View>
      <FormButton buttonTitle="Log Out" onPress={() => logout()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#2C3A4A',
    alignItems: 'center',
    padding: 20,
    paddingTop: 5,
    flexGrow: 1,
  },
  title: {
    color: '#fff',
    marginVertical: 20,
    fontSize: 30,
  },

  spinnerTextStyle: {
    color: '#D02824',
  },
});

export default Register;

import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  Alert,
  Button,
  TextInput,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import * as yup from 'yup';
import {Formik} from 'formik';

import {AuthContext} from '../../navigation/AuthProvider';

function ForgetPassword({navigation}) {
  // const reset = async () => {
  //   setShowLoading(true);
  //   try {
  //     await auth()
  //       .sendPasswordResetEmail(email)
  //       .then(() => navigation.navigate('Login'));
  //     setShowLoading(false);
  //   } catch (e) {
  //     setShowLoading(false);
  //     Alert.alert(e.message);
  //   }
  // };

  const {reset} = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 28, height: 50}}>Reset Password!</Text>
        </View>
        <Formik
          initialValues={{
            email: '',
          }}
          onSubmit={values => reset(values.email)}
          validationSchema={yup.object().shape({
            email: yup.string().email().required(),
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
              <View style={styles.subContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Your Email"
                  placeholderTextColor="black"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={() => setFieldTouched('email')}
                />
                {touched.email && errors.email && (
                  <Text style={{fontSize: 12, color: '#FF0D10'}}>
                    {errors.email}
                  </Text>
                )}
              </View>
              <View style={styles.subContainer}>
                <Button
                  style={styles.textInput}
                  title="Reset"
                  color="#D02824"
                  disabled={!isValid}
                  onPress={handleSubmit}
                />
              </View>
            </View>
          )}
        </Formik>
        <View style={styles.subContainer}>
          <Button
            style={styles.textInput}
            title="Back to Login"
            color="#D02824"
            onPress={() => {
              navigation.navigate('Login');
            }}
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    height: 400,
    padding: 20,
  },
  subContainer: {
    marginBottom: 20,
    padding: 5,
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 18,
    margin: 5,
    width: 300,
  },
});

export default ForgetPassword;

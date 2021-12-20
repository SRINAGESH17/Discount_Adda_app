import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  View,
  Button,
  Alert,
} from 'react-native';

import * as yup from 'yup';
import {Formik} from 'formik';

import SocialButton from '../../components/SocialButton';
import FormInput from '../../components/FormInput';
import FormButton from '../../components/FormButton';
import {AuthContext} from '../../navigation/AuthProvider';

function LoginScreen({navigation}) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const {login, googleLogin, fbLogin} = useContext(AuthContext);

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <SocialButton
        buttonTitle="login with Google"
        src={require('../../assets/google.png')}
        color="#707070"
        backgroundColor="#EAEBEC"
        onPress={() => googleLogin()}
      />
      <SocialButton
        buttonTitle="login with Facebook"
        src={require('../../assets/facebook.png')}
        color="#707070"
        backgroundColor="#EAEBEC"
        onPress={() => fbLogin()}
      />

      <View style={styles.orContanier}>
        <View style={styles.orstyle} />
        <View>
          <Text style={styles.ortxt}>Or</Text>
        </View>
        <View style={styles.orstyle} />
      </View>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={values => login(values.email, values.password)}
        validationSchema={yup.object().shape({
          email: yup.string().email().required(),
          password: yup
            .string()
            .min(6)
            .max(10, 'Password should not excced 10 chars.')
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
              title="Email"
              labelValue={email}
              value={values.email}
              onChangeText={handleChange('email')}
              placeholderText="abby@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onBlur={() => setFieldTouched('email')}
            />
            {touched.email && errors.email && (
              <Text style={{fontSize: 12, color: '#FF0D10'}}>
                {errors.email}
              </Text>
            )}
            <FormInput
              title="Password"
              labelValue={password}
              value={values.password}
              onChangeText={handleChange('password')}
              placeholderText="Enter your password here"
              secureTextEntry={true}
              onBlur={() => setFieldTouched('password')}
            />
            {touched.password && errors.password && (
              <Text style={{fontSize: 12, color: '#FF0D10'}}>
                {errors.password}
              </Text>
            )}
            {/* <View style={styles.checkboxContainer}>
              <CheckBox
                disabled={false}
                value={toggleCheckBox}
                tintColors="#FFFFFF"
                onValueChange={newValue => setToggleCheckBox(newValue)}
              />
              <Text style={{color: '#FFFFFF'}}>Remember me</Text>
            </View> */}

            {/* <FormButton
              buttonTitle="Log in"
              onPress={() => login(email, password)}
            /> */}
            <Button
              color="#D02824"
              title="Log in"
              disabled={!isValid}
              onPress={handleSubmit}
            />
          </View>
        )}
      </Formik>
      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => navigation.navigate('Forget')}>
        <Text style={styles.navButtonText}>Forgot Password ?</Text>
      </TouchableOpacity>

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1, height: 1, backgroundColor: '#FFFFFF'}} />
      </View>
      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.navButtonText}>Don't have an acount? Sign Up</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#2C3A4A',
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
    flexGrow: 1,
  },
  txt: {
    color: '#ccc',
    fontSize: 20,
    paddingTop: 15,
  },
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ccc',
  },
  ortxt: {
    width: 50,
    textAlign: 'center',
    color: '#ccc',
    fontSize: 22,
  },
  orstyle: {
    flex: 1,
    height: 1,
    backgroundColor: '#FFFFFF',
  },
  orContanier: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 10,
  },
});

export default LoginScreen;

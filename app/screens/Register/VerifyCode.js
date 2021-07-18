import React, {useState, useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import FormButton from '../../components/FormButton';
import FormInput from '../../components/FormInput';
import {AuthContext} from '../../navigation/AuthProvider';

export default function VerifyCode({route}) {
  const [code, setCode] = useState('');

  const {confirmCode} = useContext(AuthContext);

  return (
    <View style={styles.screen}>
      <FormInput
        title="Enter OTP "
        autoFocus
        value={code}
        onChangeText={setCode}
        placeholderText="Enter your OTP here"
        keyboardType="numeric"
      />
      <FormButton buttonTitle="Confirm OTP" onPress={() => confirmCode(code)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C3A4A',
    padding: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: 'lightblue',
    width: 300,
    marginVertical: 30,
    fontSize: 25,
    padding: 10,
    borderRadius: 8,
  },
  text: {
    fontSize: 25,
  },
});

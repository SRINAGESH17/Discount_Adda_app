import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimentions';
import {theme} from './theme';

const FormText = ({title, style, value, ...rest}) => {
  return (
    <>
      <View style={{width: '100%'}}>
        <Text style={styles.txt}>{title}</Text>
      </View>
      <View style={[styles.inputContainer, style]}>
        <Text style={styles.input} {...rest}>
          {value}
        </Text>
      </View>
    </>
  );
};

export default FormText;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 8,
    marginBottom: 10,
    width: '100%',
    height: windowHeight / 15,
    borderColor: '#ccc',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c3a4a',
  },

  input: {
    padding: 10,
    flex: 1,
    fontSize: 16,
    color: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    width: windowWidth / 1.5,
    height: windowHeight / 15,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  txt: {
    color: '#FFFFFF',
    fontSize: 20,
    paddingTop: 15,
  },
});

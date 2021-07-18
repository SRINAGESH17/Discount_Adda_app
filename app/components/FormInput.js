import React from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimentions';
import {theme} from './theme';

const FormInput = ({
  title,
  style,
  labelValue,
  placeholderText,
  iconType,
  errorText,
  description,
  ...rest
}) => {
  return (
    <>
      <View style={{width: '100%'}}>
        <Text style={styles.txt}>{title}</Text>
      </View>
      <View style={[styles.inputContainer, style]}>
        <TextInput
          value={labelValue}
          style={styles.input}
          numberOfLines={1}
          placeholder={placeholderText}
          placeholderTextColor="#ccc"
          {...rest}
        />
        {description && !errorText ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
        {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
      </View>
    </>
  );
};

export default FormInput;

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
    fontFamily: 'Lato-Regular',
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
  description: {
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 8,
    marginLeft: 20,
  },
});

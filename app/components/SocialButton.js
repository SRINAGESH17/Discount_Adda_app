import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Image} from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimentions';

const SocialButton = ({
  buttonTitle,
  btnType,
  color,
  backgroundColor,
  src,
  ...props
}) => {
  let bgColor = backgroundColor;
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, {backgroundColor: bgColor}]}
      {...props}>
      <View style={styles.btnTxtWrapper}>
        <Image style={styles.img} source={src} />
        <Text style={[styles.buttonText, {color: color}]}>{buttonTitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SocialButton;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
    width: '100%',
    height: windowHeight / 15,
    padding: 10,
    flexDirection: 'row',
    borderRadius: 8,
  },
  iconWrapper: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 30,
    height: 30,
  },
  btnTxtWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
});

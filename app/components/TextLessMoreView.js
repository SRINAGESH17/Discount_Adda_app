import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Dimensions,
  ShadowPropTypesIOS,
} from 'react-native';

const TextLessMoreView = ({text, targetLines}) => {
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback(e => {
    setLengthMore(e.nativeEvent.lines.length >= targetLines); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Text
        onTextLayout={onTextLayout}
        numberOfLines={textShown ? undefined : targetLines}
        style={{lineHeight: 21, fontFamily: 'CircularStd-Book'}}>
        {text}
      </Text>

      {lengthMore ? (
        <Text
          onPress={toggleNumberOfLines}
          style={{
            lineHeight: 21,
            color: 'red',
          }}>
          {textShown ? 'View less...' : 'View more...'}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
});

export default TextLessMoreView;

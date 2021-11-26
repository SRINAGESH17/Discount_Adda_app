import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Title, Button} from 'react-native-paper';

function ListView({list, sublist, onPress, styletitle}) {
  return (
    <View style={styles.container}>
      <Title style={[styles.title, styletitle]}>Selected List Items</Title>
      <View style={styles.liststyle}>
        <Text>{list}</Text>
        <Text style={{marginTop: 10}}>{sublist}</Text>
        {/* <Button
          mode="contained"
          uppercase={false}
          onPress={onPress}
          style={{
            backgroundColor: '#D02824',
            marginTop: 12,
            width: 120,
            marginBottom: 8,
          }}>
          Empty List
        </Button> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    marginTop: 40,
    marginBottom: 5,
    alignSelf: 'center',
  },
  liststyle: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    padding: 7,
    width: '80%',
    alignSelf: 'center',
  },
});

export default ListView;

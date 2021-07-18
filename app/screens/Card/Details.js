import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import FormButton from '../../components/FormButton';

function Details({navigation}) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Card details</Text>
      <View style={styles.imgcontainer}>
        <Image
          style={styles.image}
          source={require('../../assets/abhav.jpg')}
        />
        <Text style={styles.imgtxt}>USER SINCE 'MAY-2021'</Text>
      </View>

      <Text style={styles.name}>User Name</Text>
      <TextInput placeholder="User Name" />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1, height: 1, backgroundColor: '#ccc'}} />
      </View>
      <Text style={styles.name}>Email Id</Text>
      <TextInput placeholder="****************" />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1, height: 1, backgroundColor: '#ccc'}} />
      </View>
      <Text style={styles.name}>Mobile Number</Text>
      <Text style={styles.name}>+ 91 - ******2345</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1, height: 1, backgroundColor: '#ccc'}} />
      </View>
      <Text style={styles.name}>Card Expiry</Text>
      <Text style={styles.name}>
        08{'  '} May {'  '} 2018
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1, height: 1, backgroundColor: '#ccc'}} />
      </View>
      <View style={{marginTop: 30}}>
        <FormButton
          buttonTitle="Proceed"
          onPress={() => navigation.navigate('Bill')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  title: {
    color: '#333333',

    marginBottom: 10,
    fontSize: 20,
  },
  name: {
    fontSize: 16,
    marginTop: 20,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  imgcontainer: {
    // backgroundColor: 'yellow',
    alignItems: 'center',
    marginTop: 10,
  },
  imgtxt: {
    color: '#D02824',
    paddingTop: 10,
    fontSize: 16,
  },
});

export default Details;

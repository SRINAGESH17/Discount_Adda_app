import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import FormButton from '../../components/FormButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Details({navigation, route}) {
  const [Name, setName] = useState('');
  const [last, setlast] = useState('');
  const [img, setimg] = useState('');
  const [contact, setContact] = useState('');

  const [data, setdata] = useState([]);

  const [date, setDate] = useState('');
  const [expiry, setexpiry] = useState('');
  const [loading, setLoading] = useState(true);

  const cardno = route.params;

  useEffect(() => {
    Info();
  }, []);

  const Info = () =>
    fetch(`https://usercard.herokuapp.com/api/v1/userDetails/${cardno}`)
      .then(response => response.json())
      .then(resJson => {
        console.log('data', resJson.cardList[0].firstName);
        if (resJson.success === true) {
          setName(resJson.cardList[0].firstName);
          setlast(resJson.cardList[0].lastName);
          setContact(resJson.cardList[0].contactNumber);
          setDate(resJson.cardList[0].dateCreated);
          setexpiry(resJson.cardList[0].expiryDate);
          setimg(resJson.cardList[0].image);
          setLoading(false);
        }
      })
      .catch(error => {
        // console.error('error', error);
        Alert.alert(
          'Card with the given number not found Check Card number again',
        );
        navigation.goBack();
      });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Card details</Text>
      {loading ? (
        <ActivityIndicator animating={true} color="#D02824" size="large" />
      ) : (
        <View>
          <View style={styles.imgcontainer}>
            <Image style={styles.image} source={{uri: img}} />
            <Text style={styles.imgtxt}>USER SINCE {date}</Text>
          </View>

          <Text style={styles.name}>User Name</Text>
          <Text style={{marginTop: 10}}>
            {Name} {last}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1, height: 1, backgroundColor: '#ccc'}} />
          </View>
          <Text style={styles.name}>Email Id</Text>
          <Text>"****************"</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1, height: 1, backgroundColor: '#ccc'}} />
          </View>
          <Text style={styles.name}>Mobile Number</Text>
          <Text style={styles.name}>
            + 91 - {contact.replace(/.(?=.{4})/g, 'x')}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1, height: 1, backgroundColor: '#ccc'}} />
          </View>
          <Text style={styles.name}>Card Expiry</Text>

          <Text style={styles.name}>{expiry}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1, height: 1, backgroundColor: '#ccc'}} />
          </View>
          <View style={{marginTop: 30}}>
            <FormButton
              buttonTitle="Proceed"
              onPress={() =>
                navigation.navigate('Bill', {
                  cardNumber: cardno,
                  username: Name + last,
                  userImage: img,
                })
              }
            />
          </View>
        </View>
      )}
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

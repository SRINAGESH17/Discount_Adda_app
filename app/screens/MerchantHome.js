import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNetInfo} from '@react-native-community/netinfo';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function MerchantHome({navigation}) {
  const [name, setName] = useState('');
  const {uid} = auth().currentUser;
  const isFocused = useIsFocused();

  const [amount, setamount] = useState([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const netInfo = useNetInfo();

  useEffect(() => {
    if (isFocused) {
      firestore()
        .collection('users')
        .doc(uid)
        .get()
        .then(async function (documentSnapshot) {
          if (documentSnapshot.exists === false) {
            navigation.navigate('register');
          }

          console.log('User exists: ', documentSnapshot.exists);

          if (documentSnapshot.exists === true) {
            // console.log('User data: ', documentSnapshot.data());
            setName(documentSnapshot.data().fname);
            try {
              await AsyncStorage.setItem(
                'first',
                documentSnapshot.data().fname,
              );
              await AsyncStorage.setItem('last', documentSnapshot.data().lname);
              await AsyncStorage.setItem('mail', documentSnapshot.data().email);
              await AsyncStorage.setItem(
                'contact',
                documentSnapshot.data().contact,
              );

              await AsyncStorage.setItem(
                'date',
                JSON.stringify(
                  new Date(documentSnapshot.data().createdAt.toDate())
                    .toDateString()
                    .split(' ')
                    .slice(1)
                    .join(' '),
                ),
              );
            } catch (e) {
              console.log('err', e);
            }
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      Info();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const Info = () => {
    const Discountlist = `https://usercard.herokuapp.com/api/v1/discount/${uid}`;
    fetch(Discountlist)
      .then(res => res.json())
      .then(resJson => {
        if (resJson.success === true) {
          // console.log('array size', resJson.discountList.length);
          setamount([]);
          for (let i = 0; i < resJson.discountList.length; i++) {
            setamount(amt => [...amt, resJson.discountList[i].amount]);
          }
        } else {
          setamount([]);
        }
      })
      .catch(err => {
        console.log('Error: ', err);
      });
    // console.log(
    //   'amount',
    //   amount.reduce((a, b) => a + b, 0),
    // );
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.txt}>
          Good Morning {name} !! I hope you get a lot of{'\n'}customers today.
          All the best for today
        </Text>
        <View style={styles.verticleLine} />
        <Text style={styles.textAmount}>
          Total sell{'\n'}
          {'\u20B9'} {amount.reduce((a, b) => a + b, 0)}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.rankcontanier}>
          <Text
            style={{
              width: '93%',
              fontSize: 18,
              fontWeight: 'bold',
              color: '#000000',
            }}>
            # {Math.floor(Math.random() * (300 - 100 + 1) + 100)}
          </Text>
          <Text style={{color: '#2C2F32'}}>
            <View style={styles.CircleShape}>
              <Text style={{color: 'black'}}>i</Text>
            </View>
            Ranking is based on the maximum sells by each
          </Text>
          <Text>store and customer ranking</Text>
        </View>

        <Text style={styles.name}>Welcome {name} Stores !!</Text>

        <Animated.View
          style={{marginEnd: 5, marginStart: 10, opacity: fadeAnim}}>
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Scan')}>
              <Image
                style={{width: 110, height: 70}}
                source={require('../assets/scanicon.png')}
              />

              <Text style={styles.txtcard}>Scan Card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Report')}>
              <Image
                style={styles.img1}
                source={require('../assets/reports.png')}
              />
              <Text style={styles.txtcard}>Reports</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Mystore')}>
              <Image
                style={styles.img2}
                source={require('../assets/mystore.png')}
              />
              <Text style={styles.txtcard}>My Store</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('Profile')}>
              <Image
                style={styles.img}
                source={require('../assets/profile.png')}
              />
              <Text style={styles.txtcard}>Profile</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  txt: {
    color: '#F6D4D3',
    fontSize: 13,
    marginStart: 10,
  },
  textAmount: {
    color: 'white',
    fontSize: 14,
    marginEnd: 10,
  },
  verticleLine: {
    height: windowHeight / 10,
    width: 1,
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },
  CircleShape: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
    backgroundColor: '#DCE9F7',
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: windowWidth / 2.32,
    height: windowHeight / 4.5,
    marginStart: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    borderRadius: 10,
  },
  txtcard: {
    color: 'black',
    paddingTop: 10,
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#D02824',
    height: windowHeight / 10,
    width: windowWidth,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankcontanier: {
    backgroundColor: '#DCE9F7',
    height: 100,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 30,
    paddingStart: 20,
    marginEnd: 10,
    marginStart: 10,
  },
  name: {
    color: '#333333',
    marginStart: 10,
    marginVertical: 15,
    fontSize: 20,
  },
  img: {
    width: 62,
    height: 60,
  },
  img1: {
    width: 60,
    height: 66,
  },
  img2: {
    width: 66,
    height: 60,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: windowHeight / 4.2,
    width: '100%',
    // backgroundColor: 'red',
  },
});

export default MerchantHome;

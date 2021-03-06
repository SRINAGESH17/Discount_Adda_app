import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import FormButton from '../../components/FormButton';
import FormInput from '../../components/FormInput';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function ScanCard({navigation}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [card, setCard] = useState('');
  const [amount, setamount] = useState([]);
  const [name, setName] = useState('');
  const [last, setLast] = useState('');

  const {uid} = auth().currentUser;

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    navigation.navigate('Details', card);
  };

  const handleCardNumber = text => {
    let formattedText = text.split(' ').join('');
    if (formattedText.length > 0) {
      formattedText = formattedText.match(new RegExp('.{1,4}', 'g')).join(' ');
    }
    setCard(formattedText);
    // console.log('text', formattedText);
    return formattedText;
  };

  useEffect(() => {
    Info();
  }, []);

  const Info = () => {
    const Discountlist = `https://usercard.herokuapp.com/api/v1/discount/${uid}`;
    fetch(Discountlist)
      .then(res => res.json())
      .then(resJson => {
        if (resJson.success === true) {
          console.log('array size', resJson.discountList.length);
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
    firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot(documentSnapshot => {
        const userData = documentSnapshot.data();
        setName(userData.fname);
        setLast(userData.lname);
      });
    // console.log(
    //   'amount',
    //   amount.reduce((a, b) => a + b, 0),
    // );
  };

  return (
    <>
      <View style={styles.header}>
        <View style={{width: windowWidth * 0.78}}>
          <Text style={styles.txt}>
            Good Morning {name} {last} !! I hope you get a lot of customers
            today. All the best for today
          </Text>
        </View>

        <View style={styles.verticleLine} />
        <Text style={styles.textAmount}>
          Today's sell{'\n'}
          {'\u20B9'} {amount.reduce((a, b) => a + b, 0)}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Scan Card</Text>
        <View style={styles.cardContainer}>
          <Image
            style={styles.img}
            source={require('../../assets/scancard.png')}
          />
        </View>

        <Modal
          isVisible={isModalVisible}
          animationOut="fadeOutDown"
          animationIn="fadeInUp">
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(false)}>
                <Text style={{fontSize: 25}}>X</Text>
              </Pressable>
              <View
                style={{
                  flexDirection: 'column',
                }}>
                <Text style={{fontSize: 20, top: 20}}>
                  Enter your card Number
                </Text>

                <FormInput
                  style={{
                    backgroundColor: 'white',
                    marginTop: -8,
                    marginBottom: 10,
                  }}
                  styletext={{
                    color: '#000',
                  }}
                  value={card}
                  onChangeText={text => handleCardNumber(text)}
                  placeholderText="Enter your card no. here"
                  keyboardType="numeric"
                  maxLength={14}
                />
                <TouchableOpacity
                  style={{
                    backgroundColor: '#D02824',
                    alignItems: 'center',
                    padding: 8,
                    borderRadius: 10,
                    marginTop: 4,
                  }}
                  onPress={() => {
                    toggleModal();
                  }}>
                  <Text style={{color: 'white'}}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.buttonContainer}>
          <FormButton
            buttonTitle="Enter Card Number"
            onPress={() => setModalVisible(true)}
          />
          <FormButton
            buttonTitle="Scan Card"
            onPress={() => navigation.navigate('Qr')}
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    // height: Dimensions.get('screen').height * 0.7,
    flexGrow: 1,
  },
  txt: {
    color: '#F6D4D3',
    fontSize: 13,
    marginStart: 15,
  },
  textAmount: {
    color: 'white',
    fontSize: 14,
    marginEnd: 15,
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
    marginLeft: 5,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: 175,
    height: 175,
    marginHorizontal: 10,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#333333',
    marginStart: 20,
    marginVertical: 20,
    fontSize: 30,
  },
  img: {
    width: 300,
    height: 200,
    borderRadius: 10,
  },
  cardContainer: {
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    padding: 20,
    marginTop: 20,
    height: 190,
    justifyContent: 'space-between',
  },
  centeredView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    padding: 20,
    height: 200,
  },
  button: {
    borderRadius: 20,
    elevation: 5,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: 'white',
    right: 0,
    position: 'absolute',
    padding: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 18,
    marginTop: 26,
    backgroundColor: 'yellow',
  },
});

export default ScanCard;

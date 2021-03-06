import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  Dimensions,
  Alert,
  Pressable,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import FormButton from '../../components/FormButton';
import Modal from 'react-native-modal';
import FormInput from '../../components/FormInput';

const windowHeight = Dimensions.get('window').height;

function Bill({navigation, route}) {
  const [discount, setDiscount] = useState('');
  const [amount, setAmount] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [shopName, setShopName] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const details = route.params;
  const {uid} = auth().currentUser;

  const presentdate =
    new Date().toDateString() + ' ' + new Date().toLocaleTimeString();

  useEffect(() => {
    firestore()
      .collection('StoreName')
      .doc(uid)
      .get()
      .then(documentSnapshot => {
        setShopName(documentSnapshot.data().StoreName);
      });
  }, []);

  const Info = () => {
    if (discount.length === 0) {
      Alert.alert('Please enter the discount');
    } else {
      const socialfeed = 'https://usercard.herokuapp.com/api/v1/addsocialfeed';
      fetch(socialfeed, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantId: uid,
          name: details.username,
          userImage: details.userImage,
          amount: amount,
          amountsaved: (amount * discount) / 100,
          shopName: shopName,
          dateCreated: presentdate,
        }),
      });
      const discountdetails = 'https://usercard.herokuapp.com/api/v1/discount';
      fetch(discountdetails, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantId: uid,
          name: details.username,
          amount: amount,
          amountsaved: (amount * discount) / 100,
          dateCreated: presentdate,
          cardNumber: details.cardNumber,
        }),
      })
        .then(() => {
          Alert.alert('Discount Successfully Applied');
          navigation.navigate('Home');
        })
        .catch(error => Alert.alert(error));
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Order Purchase</Text>
      <View style={[styles.amountcontainer, styles.discounts]}>
        <Picker
          selectedValue={discount}
          onValueChange={(itemValue, itemIndex) => setDiscount(itemValue)}>
          <Picker.Item label="Add Discount" value="Discount" />
          <Picker.Item label="25 %" value="25" />
          <Picker.Item label="50 %" value="50" />
          <Picker.Item label="70 %" value="70" />
          <Picker.Item
            label="Add Discount"
            value={() => setModalVisible(true)}
          />
        </Picker>
      </View>
      <Modal
        isVisible={isModalVisible}
        animationOut="fadeOutDown"
        animationIn="fadeInUp">
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Add Discount here</Text>
            <FormInput
              style={{
                backgroundColor: 'white',
                marginTop: -8,
                marginBottom: 10,
                color: '#000',
              }}
              value={discount}
              onChangeText={number => setDiscount(number)}
              placeholderText="Enter your Discount value"
              keyboardType="numeric"
              maxLength={2}
            />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={toggleModal}>
              <Text style={styles.textStyle}>Close </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Text>
        Enter the total amount of the purchase{'\n'}done by the customer
      </Text>
      <View style={styles.amountcontainer}>
        <TextInput
          style={styles.amount}
          placeholder="2821.00"
          value={amount}
          maxLength={8}
          keyboardType="numeric"
          onChangeText={amt => setAmount(amt)}
        />
      </View>
      <Text style={styles.title}>Order Details</Text>
      <View style={styles.details}>
        <Text>Total Amount</Text>
        <Text>
          {'\u20B9'} {amount}
        </Text>
      </View>
      <View style={styles.details}>
        <Text>Discount ({discount})% : </Text>
        <Text>
          {'\u20B9'} {(amount * discount) / 100}
        </Text>
      </View>
      <View style={styles.verticleLine} />
      <View style={styles.details}>
        <Text>Grand Total </Text>
        <Text>
          {'\u20B9'} {amount - (amount * discount) / 100}
        </Text>
      </View>
      <View style={{alignItems: 'center', marginVertical: 20}}>
        <Text style={{color: 'green', fontWeight: '500', fontSize: 20}}>
          Saved Rs. {(amount * discount) / 100} on MRP
        </Text>
      </View>
      <View style={{marginTop: 20}}>
        {/* <FormButton
          buttonTitle={`Pay ${
            amount - (amount * discount) / 100
          } to the Merchant`}
        /> */}
        <FormButton buttonTitle="Submit" onPress={Info} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingStart: 20,
    paddingEnd: 20,
  },
  title: {
    color: '#333333',
    fontSize: 25,
    marginTop: 10,
  },
  amountcontainer: {
    marginTop: 8,
    marginBottom: 10,
    width: '100%',
    height: windowHeight / 15,
    borderColor: '#ccc',
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  discounts: {
    width: '52%',
    marginLeft: '50%',
  },
  amount: {
    padding: 10,
    flex: 1,
    fontSize: 16,
    color: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  verticleLine: {
    width: '100%',
    borderWidth: 0.5,
    backgroundColor: 'black',
    marginTop: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#D02824',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Bill;

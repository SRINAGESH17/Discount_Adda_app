import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  Dimensions,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import FormButton from '../../components/FormButton';

const windowHeight = Dimensions.get('window').height;

function Bill(props) {
  const [discount, setDiscount] = useState();
  const [amount, setAmount] = useState('');
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Order Purchase</Text>
      <View style={[styles.amountcontainer, styles.discounts]}>
        <Picker
          selectedValue={discount}
          onValueChange={(itemValue, itemIndex) => setDiscount(itemValue)}>
          <Picker.Item label="Discount List" value="Discount" />
          <Picker.Item label="25 %" value="25" />
          <Picker.Item label="50 %" value="50" />
          <Picker.Item label="70 %" value="70" />
        </Picker>
      </View>
      <Text>
        Enter the total amount of the purchase{'\n'}done by the customer
      </Text>
      <View style={styles.amountcontainer}>
        <TextInput
          style={styles.amount}
          placeholder="2821.00"
          value={amount}
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
      <View style={styles.verticleLine}></View>
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
        <FormButton
          buttonTitle={`Pay ${
            amount - (amount * discount) / 100
          } to the Merchant`}
        />
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
    width: '50%',
    marginLeft: '50%',
  },
  amount: {
    padding: 10,
    flex: 1,
    fontSize: 16,
    fontFamily: 'Lato-Regular',
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
});

export default Bill;

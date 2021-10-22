import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const data = [
  {
    id: 1,
    dateCreated: '10/02/21',
    name: 'Aman Singh',
    amount: '500',
    cardNumber: '83271232832',
  },
  {
    id: 2,
    dateCreated: '10/02/21',
    name: 'Aman Singh',
    amount: '500',
    cardNumber: '83271232832',
  },
  {
    id: 3,
    dateCreated: '10/02/21',
    name: 'Aman Singh',
    amount: '500',
    cardNumber: '83271232832',
  },
  {
    id: 4,
    dateCreated: '10/02/21',
    name: 'Aman Singh',
    amount: '500',
    cardNumber: '83271232832',
  },
  {
    id: 5,
    dateCreated: '10/02/21',
    name: 'Aman Singh',
    amount: '500',
    cardNumber: '83271232832',
  },
  {
    id: 6,
    dateCreated: '10/02/21',
    name: 'Aman Singh',
    amount: '500',
    cardNumber: '83271232832',
  },
  {
    id: 7,
    dateCreated: '10/02/21',
    name: 'Aman Singh',
    amount: '500',
    cardNumber: '83271232832',
  },
  {
    id: 8,
    dateCreated: '10/02/21',
    name: 'Aman Singh',
    amount: '500',
    cardNumber: '83271232832',
  },
  {
    id: 9,
    dateCreated: '10/02/21',
    name: 'Aman Singh',
    amount: '500',
    cardNumber: '83271232832',
  },
  {
    id: 10,
    dateCreated: '10/02/21',
    name: 'Aman Singh',
    amount: '500',
    cardNumber: '83271232832',
  },
  {
    id: 11,
    dateCreated: '10/02/21',
    name: 'Aman Singh',
    amount: '500',
    cardNumber: '83271232832',
  },
  {
    id: 12,
    dateCreated: '10/02/21',
    name: 'Aman Singh',
    amount: '500',
    cardNumber: '83271232832',
  },
  {
    id: 13,
    dateCreated: '10/02/21',
    name: 'Aman Singh',
    amount: '500',
    cardNumber: '83271232832',
  },
  {
    id: 14,
    dateCreated: '10/02/21',
    name: 'Aman Singh',
    amount: '500',
    cardNumber: '83271232832',
  },
  {
    id: 15,
    dateCreated: '10/02/21',
    name: 'Aman Singh',
    amount: '500',
    cardNumber: '83271232832',
  },
  {
    id: 16,
    dateCreated: '10/02/21',
    name: 'Aman Singh',
    amount: '500',
    cardNumber: '83271232832',
  },
  {
    id: 17,
    dateCreated: '10/02/21',
    name: 'Aman Singh',
    amount: '500',
    cardNumber: '83271232832',
  },
  {
    id: 18,
    dateCreated: '10/02/21',
    name: 'Aman Singh',
    amount: '500',
    cardNumber: '83271232832',
  },
  {
    id: 19,
    dateCreated: '10/02/21',
    name: 'Aman Singh',
    amount: '500',
    cardNumber: '83271232832',
  },
  {
    id: 20,
    dateCreated: '10/02/21',
    name: 'Aman Singh',
    amount: '500',
    cardNumber: '83271232832',
  },
  {
    id: 21,
    dateCreated: '10/02/21',
    name: 'Aman Singh',
    amount: '400',
    cardNumber: '83271232832',
  },
];

const header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.txt}>Date</Text>
      <View style={styles.verticleLine} />
      <Text style={[styles.txt, styles.customer]}>Customer{'\n'}Name </Text>
      <View style={styles.verticleLine} />
      <Text style={styles.txt}>Saved</Text>
      <View style={styles.verticleLine} />
      <Text style={[styles.txt, styles.cardno]}>Card{'\n'}Number</Text>
    </View>
  );
};

function TranscationRecord(props) {
  const [loading, setLoading] = useState(true);
  const [value, setvalue] = useState([]);
  const [response, setresponse] = useState('');
  const {uid} = auth().currentUser;
  useEffect(() => {
    Info();
  }, []);

  const Info = async () => {
    const Discountlist = `https://usercard.herokuapp.com/api/v1/discount/${uid}`;
    fetch(Discountlist)
      .then(res => res.json())
      .then(resJson => {
        console.log('data', resJson);
        if (resJson.success === true) {
          setvalue(resJson.discountList);
          setresponse('');
        } else {
          setresponse('No transaction Records found');
        }
      })
      .catch(err => {
        console.log('Error: ', err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Transcation Record</Text>
      {loading ? (
        <ActivityIndicator animating={true} color="#D02824" size="large" />
      ) : value.length === 0 ? (
        <Text>{response}</Text>
      ) : (
        <FlatList
          data={value}
          horizontal={false}
          keyExtractor={item => item.id}
          ListHeaderComponent={header}
          stickyHeaderIndices={[0]}
          ItemSeparatorComponent={() => (
            <View style={{height: 1, backgroundColor: 'lightgrey'}} />
          )}
          renderItem={({item}) => (
            <View style={styles.detail}>
              <Text style={styles.detailtxt}>{item.dateCreated}</Text>
              <Text style={styles.detailtxt}>{item.name}</Text>
              <Text style={[styles.detailtxt, styles.amount]}>
                {'\u20B9'} {item.amount}
              </Text>
              <Text style={styles.detailtxt}>{item.cardNumber}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    color: '#333333',
    marginStart: 20,
    marginBottom: 10,
    fontSize: 25,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#D02824',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    paddingStart: 5,
    paddingEnd: 5,
  },
  txt: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    marginStart: 10,
  },
  customer: {
    flex: 1.5,
  },
  cardno: {
    flex: 1.7,
  },

  verticleLine: {
    height: '100%',
    width: 1,
    backgroundColor: 'red',
    marginHorizontal: 10,
  },
  detail: {
    flexDirection: 'row',
    padding: 10,
    paddingEnd: 20,
    paddingVertical: 15,
  },
  detailtxt: {
    fontSize: 14,
    flex: 1,
  },
  amount: {
    marginStart: 30,
    flex: 0.7,
  },
});

export default TranscationRecord;

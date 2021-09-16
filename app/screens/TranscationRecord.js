import React from 'react';
import {View, StyleSheet, Text, FlatList, SafeAreaView} from 'react-native';

const data = [
  {
    id: 1,
    Date: '10/02/21',
    Customer: 'Aman Singh',
    Saved: '500',
    Card: '83271232832',
  },
  {
    id: 2,
    Date: '10/02/21',
    Customer: 'Aman Singh',
    Saved: '500',
    Card: '83271232832',
  },
  {
    id: 3,
    Date: '10/02/21',
    Customer: 'Aman Singh',
    Saved: '500',
    Card: '83271232832',
  },
  {
    id: 4,
    Date: '10/02/21',
    Customer: 'Aman Singh',
    Saved: '500',
    Card: '83271232832',
  },
  {
    id: 5,
    Date: '10/02/21',
    Customer: 'Aman Singh',
    Saved: '500',
    Card: '83271232832',
  },
  {
    id: 6,
    Date: '10/02/21',
    Customer: 'Aman Singh',
    Saved: '500',
    Card: '83271232832',
  },
  {
    id: 7,
    Date: '10/02/21',
    Customer: 'Aman Singh',
    Saved: '500',
    Card: '83271232832',
  },
  {
    id: 8,
    Date: '10/02/21',
    Customer: 'Aman Singh',
    Saved: '500',
    Card: '83271232832',
  },
  {
    id: 9,
    Date: '10/02/21',
    Customer: 'Aman Singh',
    Saved: '500',
    Card: '83271232832',
  },
  {
    id: 10,
    Date: '10/02/21',
    Customer: 'Aman Singh',
    Saved: '500',
    Card: '83271232832',
  },
  {
    id: 11,
    Date: '10/02/21',
    Customer: 'Aman Singh',
    Saved: '500',
    Card: '83271232832',
  },
  {
    id: 12,
    Date: '10/02/21',
    Customer: 'Aman Singh',
    Saved: '500',
    Card: '83271232832',
  },
  {
    id: 13,
    Date: '10/02/21',
    Customer: 'Aman Singh',
    Saved: '500',
    Card: '83271232832',
  },
  {
    id: 14,
    Date: '10/02/21',
    Customer: 'Aman Singh',
    Saved: '500',
    Card: '83271232832',
  },
  {
    id: 15,
    Date: '10/02/21',
    Customer: 'Aman Singh',
    Saved: '500',
    Card: '83271232832',
  },
  {
    id: 16,
    Date: '10/02/21',
    Customer: 'Aman Singh',
    Saved: '500',
    Card: '83271232832',
  },
  {
    id: 17,
    Date: '10/02/21',
    Customer: 'Aman Singh',
    Saved: '500',
    Card: '83271232832',
  },
  {
    id: 18,
    Date: '10/02/21',
    Customer: 'Aman Singh',
    Saved: '500',
    Card: '83271232832',
  },
  {
    id: 19,
    Date: '10/02/21',
    Customer: 'Aman Singh',
    Saved: '500',
    Card: '83271232832',
  },
  {
    id: 20,
    Date: '10/02/21',
    Customer: 'Aman Singh',
    Saved: '500',
    Card: '83271232832',
  },
  {
    id: 21,
    Date: '10/02/21',
    Customer: 'Aman Singh',
    Saved: '400',
    Card: '83271232832',
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
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Transcation Record</Text>
      <View>
        <FlatList
          data={data}
          horizontal={false}
          keyExtractor={item => item.id}
          ListHeaderComponent={header}
          stickyHeaderIndices={[0]}
          ItemSeparatorComponent={() => (
            <View style={{height: 1, backgroundColor: 'lightgrey'}} />
          )}
          renderItem={({item}) => (
            <View style={styles.detail}>
              <Text style={styles.detailtxt}>{item.Date}</Text>
              <Text style={styles.detailtxt}>{item.Customer}</Text>
              <Text style={[styles.detailtxt, styles.saved]}>
                {'\u20B9'} {item.Saved}
              </Text>
              <Text style={styles.detailtxt}>{item.Card}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
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
  saved: {
    marginStart: 30,
    flex: 0.7,
  },
});

export default TranscationRecord;

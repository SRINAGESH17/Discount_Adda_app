import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  Button,
  ScrollView,
  Alert,
} from 'react-native';
import {
  List,
  RadioButton,
  ActivityIndicator,
  Checkbox,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ListView from '../../../components/ListView';
import HeaderAlert from '../../../components/HeaderAlert';
import {API_URL, endPoints} from '../../../Config/Config';

const infoResturants = [
  {
    id: '1',
    item: 'Veg Resturant',
  },
  {
    id: '2',
    item: 'Hotels',
  },
  {
    id: '3',
    item: 'Bakeries',
  },
  {
    id: '4',
    item: 'Beverages',
  },
  {
    id: '5',
    item: 'Takeways',
  },
  {
    id: '6',
    item: 'Milk & Milk Products',
  },
];

function Resturants({navigation}) {
  const [rest, setRest] = useState([]);
  const [data, setdata] = useState([]);

  const [list, setlist] = useState('');

  const [isLoading, setisLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    getResturant();
  }, []);

  const getResturant = () => {
    setdata(infoResturants);

    const resturants = `${API_URL}/${endPoints.resturant}`;
    fetch(resturants)
      .then(res => res.json())
      .then(resJson => {
        setRest(resJson);
        // console.log(`restaurant`, resJson);
      })
      .catch(err => {
        console.log('Error: ', err);
      })
      .finally(() => setisLoading(false));
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('Resturants')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists === false) {
          setlist('Empty list');
        }
        if (documentSnapshot.exists) {
          setlist(documentSnapshot.data().restauranttype);
        }
      });
  };

  // on change value

  const onChangeValue = (itemSelected, index) => {
    const newData = data.map(item => {
      if (item.id === itemSelected.id) {
        return {
          ...item,
          selected: !item.selected,
        };
      }
      return {
        ...item,
        selected: item.selected,
      };
    });
    setdata(newData);
  };

  // submit  buttons
  const submit = () => {
    const listSelected = data.filter(item => item.selected === true);
    let contentAlert = '';
    listSelected.forEach(item => {
      contentAlert = contentAlert + item.item + ', ';
    });
    // Alert.alert(contentAlert);
    console.log('value of category', contentAlert);
    if (contentAlert.length === 0) {
      setVisible(true);
      Alert.alert('Selection is empty');
    } else {
      setLoading(true);
      firestore()
        .collection('mycategory')
        .doc(auth().currentUser.uid)
        .collection('Resturants')
        .doc(auth().currentUser.uid)
        .set({
          restauranttype: contentAlert,
          createdAt: firestore.Timestamp.fromDate(new Date()),
        })
        .then(() => {
          setLoading(false);
          getResturant();
        })
        .catch(() => alert('category   not updated'));
    }
  };
  const EmptyList = () => {
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('Resturants')
      .doc(auth().currentUser.uid)
      .set({
        restauranttype: null,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        getResturant();
        Alert.alert('List is empty');
      })
      .catch(() => alert('category   not updated'));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {visible && (
        <HeaderAlert text="Selected categories are empty" value={true} />
      )}

      {loading ? (
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 18}}>Details submitted</Text>
          <ActivityIndicator animating={true} color="#D02824" size="large" />
        </View>
      ) : (
        <View>
          {isLoading ? (
            <ActivityIndicator animating={true} color="#D02824" size="large" />
          ) : (
            data.map((item, index) => {
              return (
                <View key={index}>
                  <RadioButton.Item
                    label={item.item}
                    value={item.selected}
                    status={item.selected ? 'checked' : 'unchecked'}
                    onPress={() => onChangeValue(item, index)}
                    style={{}}
                  />
                </View>
              );
            })
          )}
          <Button color="#D02824" title="submit" onPress={submit} />
        </View>
      )}

      <ListView list={list} styletitle={{marginTop: 20}} onPress={EmptyList} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  Accordion: {
    marginTop: 10,
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
    padding: 5,
    width: 300,
    alignSelf: 'center',
  },
});

export default Resturants;

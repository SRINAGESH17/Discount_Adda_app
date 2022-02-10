import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  Button,
  Alert,
} from 'react-native';
import {List, RadioButton, ActivityIndicator} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import HeaderAlert from '../../../components/HeaderAlert';
import ListView from '../../../components/ListView';
import {API_URL, endPoints} from '../../../Config/Config';

function Emergency({navigation}) {
  const [data, setdata] = useState([]);

  const [isLoading, setisLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [emergency, setEmergency] = useState('');
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    getEmergency();
  }, []);

  const getEmergency = () => {
    const menurl = `${API_URL}/${endPoints.emergency}`;
    fetch(menurl)
      .then(res => res.json())
      .then(resJson => {
        setdata(resJson);
      })
      .catch(err => {
        console.log('Error: ', err);
      })
      .finally(() => setisLoading(false));

    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('Emergency')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists === false) {
          setEmergency(null);
        }
        if (documentSnapshot.exists) {
          setEmergency(documentSnapshot.data().emergency);
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
    console.log(contentAlert);
    if (contentAlert.length === 0) {
      setVisible(true);
      Alert.alert('Selection is empty');
    } else {
      setLoading(true);
      firestore()
        .collection('mycategory')
        .doc(auth().currentUser.uid)
        .collection('Emergency')
        .doc(auth().currentUser.uid)
        .set({
          emergency: contentAlert,
          createdAt: firestore.Timestamp.fromDate(new Date()),
        })
        .then(() => {
          setLoading(false);
          getEmergency();
        })
        .catch(() => alert('category   not updated'));
    }
  };
  const EmptyList = () => {
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('Emergency')
      .doc(auth().currentUser.uid)
      .set({
        emergency: null,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        getEmergency();
        Alert.alert('List is empty');
      })
      .catch(() => alert('category   not updated'));
  };
  // render items for flatlist

  const renderItemMen = ({item, index}) => {
    return (
      <View>
        <RadioButton.Item
          label={item.item}
          value={item.selected}
          status={item.selected ? 'checked' : 'unchecked'}
          onPress={() => onChangeValue(item, index)}
          style={{}}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
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
            <FlatList
              data={data}
              renderItem={renderItemMen}
              keyExtractor={item => `key-${item.id}`}
            />
          )}
          <Button color="#D02824" title="submit" onPress={submit} />
        </View>
      )}
      <ListView
        list={emergency}
        styletitle={{marginTop: 20}}
        onPress={EmptyList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  Accordion: {
    marginTop: 10,
  },
});

export default Emergency;

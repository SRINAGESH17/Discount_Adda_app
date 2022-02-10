import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  Button,
  Alert,
  TextInput,
} from 'react-native';
import {List, RadioButton, ActivityIndicator} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {xorBy} from 'lodash';
import ListView from '../../../components/ListView';
import {windowHeight, windowWidth} from '../../../utils/Dimentions';
import {API_URL, endPoints} from '../../../Config/Config';

function MedicneCategory({navigation}) {
  const [data, setdata] = useState([]);

  const [isLoading, setisLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [medical, setMedical] = useState('');

  const [visible, setVisible] = React.useState(false);

  const [filterdData, setfilterdData] = useState([]);

  const [search, setsearch] = useState('');

  useEffect(() => {
    getmedical();
  }, []);

  const getmedical = () => {
    const menurl = `${API_URL}/${endPoints.Medical.medicallist}`;
    fetch(menurl)
      .then(res => res.json())
      .then(resJson => {
        setdata(resJson);
        setfilterdData(resJson);
      })
      .catch(err => {
        console.log('Error: ', err);
      })
      .finally(() => setisLoading(false));

    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('Medical')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists === false) {
          setMedical(null);
        }
        if (documentSnapshot.exists) {
          setMedical(documentSnapshot.data().medical);
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
    if (contentAlert.length === 0) {
      setVisible(true);
      Alert.alert('Selection is empty');
    } else {
      setLoading(true);
      firestore()
        .collection('mycategory')
        .doc(auth().currentUser.uid)
        .collection('Medical')
        .doc(auth().currentUser.uid)
        .set({
          medical: contentAlert,
          createdAt: firestore.Timestamp.fromDate(new Date()),
        })
        .then(() => {
          setLoading(false);
          getmedical();
        })
        .catch(() => alert('category   not updated'));
    }
  };

  const EmptyList = () => {
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('Medical')
      .doc(auth().currentUser.uid)
      .set({
        medical: null,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        getmedical();
        Alert.alert('List is empty');
      })
      .catch(() => alert('category not updated'));
  };

  // render items for flatlist

  const rendeItemMedical = ({item, index}) => {
    return (
      <View>
        <RadioButton.Item
          label={item.item}
          value={item.selected}
          status={item.selected ? 'checked' : 'unchecked'}
          onPress={() => onChangeValue(item, index)}
        />
      </View>
    );
  };

  const searchFilter = text => {
    if (text) {
      const newData = data.filter(item => {
        const itemData = item.item ? item.item.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setdata(newData);
      setsearch(text);
    } else {
      setdata(filterdData);
      setsearch(text);
    }
  };

  return (
    <View style={styles.container}>
      {/* <List.Section>
        <List.Accordion
          title="Medical"
          id="1"
          expanded={expanded}
          onPress={handlePress}
          right={props =>
            expanded ? (
              <Image
                style={{width: 20, height: 20}}
                source={require('../../../assets/withdraw.png')}
                {...props}
              />
            ) : (
              <Image
                style={{width: 20, height: 20}}
                source={require('../../../assets/up-arrow.png')}
                {...props}
              />
            )
          }>

        </List.Accordion>
      </List.Section> */}
      {loading ? (
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 18}}>Details submitted</Text>
          <ActivityIndicator animating={true} color="#D02824" size="large" />
        </View>
      ) : (
        <View>
          <View style={styles.searchbox}>
            <TextInput
              value={search}
              placeholder="Search for categories here..."
              placeholderTextColor="#ccc"
              style={{
                color: '#000',
              }}
              onChangeText={txt => searchFilter(txt)}
            />

            <Image
              source={require('../../../assets/search.png')}
              style={{width: 20, height: 20, tintColor: '#000'}}
            />
          </View>
          {isLoading ? (
            <ActivityIndicator animating={true} color="#D02824" size="large" />
          ) : (
            <FlatList
              data={data}
              style={{height: windowHeight * 0.4}}
              renderItem={rendeItemMedical}
              keyExtractor={item => `key-${item.id}`}
            />
          )}
          <Button color="#D02824" title="submit" onPress={submit} />
        </View>
      )}

      <ListView
        list={medical}
        styletitle={{marginTop: 5}}
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
  searchbox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 20,
    borderWidth: 0.8,
    borderColor: '#ccc',
    width: windowWidth * 0.9,
    height: 40,
    margin: 10,
  },
});

export default MedicneCategory;

import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text, FlatList, Alert, Button} from 'react-native';
import {List, RadioButton, ActivityIndicator} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import SelectBox from 'react-native-multi-selectbox';
import {xorBy} from 'lodash';

const infoResturants = [
  {
    id: '1',
    item: 'Veg Resturant',
  },
  {
    id: '2',
    item: 'Non-Veg Resturant',
  },
  {
    id: '3',
    item: 'Veg & Non-Veg Resturant',
  },
];

function Resturants({navigation}) {
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [rest, setRest] = useState([]);
  const [data, setdata] = useState([]);

  const [isLoading, setisLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    gethome();
  }, []);

  const gethome = () => {
    setdata(infoResturants);

    const resturants = 'https://merchantitemlist.herokuapp.com/rest';
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
      contentAlert = contentAlert + item.item + ', ' + '\n';
    });
    // Alert.alert(contentAlert);
    console.log('value of category', contentAlert);

    setLoading(true);
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('Resturants')
      .doc(auth().currentUser.uid)
      .update({
        restauranttype: contentAlert,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })

      .catch(() => alert('category   not updated'));
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };
  const Submitcategory = () => {
    onMultiChange();
    let content = '';
    selectedTeams.forEach(item => {
      content = content + item.item + ',' + '\n';
    });
    console.log(`value from subcategory`, content);
    firestore()
      .collection('mycategory')
      .doc(auth().currentUser.uid)
      .collection('Resturants')
      .doc(auth().currentUser.uid)
      .update({
        resturantcategory: content,
        createdAt: firestore.Timestamp.fromDate(new Date()),
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
  function onMultiChange() {
    return item => setSelectedTeams(xorBy(selectedTeams, [item], 'id'));
  }

  return (
    <View style={styles.container}>
      <List.AccordionGroup>
        <List.Accordion
          title="Restaurant Type"
          id="1"
          right={props => <Text {...props}>+</Text>}>
          {loading ? (
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 18}}>Details submitted</Text>
              <ActivityIndicator
                animating={true}
                color="#D02824"
                size="large"
              />
            </View>
          ) : (
            <View>
              {isLoading ? (
                <ActivityIndicator
                  animating={true}
                  color="#D02824"
                  size="large"
                />
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
        </List.Accordion>
      </List.AccordionGroup>
      <View style={{height: 40}} />
      <Text style={{fontSize: 20, paddingBottom: 10}}>
        Add subcategory for Resturants
      </Text>
      {isLoading ? (
        <ActivityIndicator animating={true} color="#D02824" size="large" />
      ) : (
        <SelectBox
          label="Select Resturant types"
          options={rest}
          selectedValues={selectedTeams}
          onMultiSelect={onMultiChange()}
          onTapClose={onMultiChange()}
          isMulti
          inputPlaceholder="Type Here to search"
          toggleIconColor="#D02824"
          searchIconColor="#D02824"
          arrowIconColor="#D02824"
        />
      )}

      <View style={{marginTop: 10, width: 120}}>
        <Button color="#D02824" title="submit" onPress={Submitcategory} />
      </View>
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
  // box: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   paddingStart: 20,
  //   paddingEnd: 20,
  //   paddingVertical: 5,
  // },
  // check: {
  //   width: 20,
  //   height: 20,
  // },
});

export default Resturants;